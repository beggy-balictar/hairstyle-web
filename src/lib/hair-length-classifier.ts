import type { HairLength, HairLengthAnalysis, HairLengthMetrics } from "@/types/hair-length";

type LandmarkLike = {
  x: number;
  y: number;
  z?: number;
};

type ColorStats = {
  mean: [number, number, number];
  std: [number, number, number];
  confidence: number;
};

const POINTS = {
  foreheadTop: 10,
  chin: 152,
  leftTemple: 127,
  rightTemple: 356,
  leftCheek: 234,
  rightCheek: 454,
  leftJaw: 172,
  rightJaw: 397,
} as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function closeness(value: number, target: number, tolerance: number) {
  return clamp(1 - Math.abs(value - target) / tolerance);
}

function distance(a: LandmarkLike, b: LandmarkLike) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function colorDistance(pixel: [number, number, number], stats: ColorStats) {
  const [r, g, b] = pixel;
  const [mr, mg, mb] = stats.mean;
  const [sr, sg, sb] = stats.std;
  const nr = Math.abs(r - mr) / Math.max(16, sr * 2.2);
  const ng = Math.abs(g - mg) / Math.max(16, sg * 2.2);
  const nb = Math.abs(b - mb) / Math.max(16, sb * 2.2);
  return Math.sqrt(nr * nr + ng * ng + nb * nb) / Math.sqrt(3);
}

function collectColorStats(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  regions: Array<{ x: number; y: number; w: number; h: number }>,
): ColorStats {
  const values: number[][] = [];

  for (const region of regions) {
    const x0 = Math.max(0, Math.floor(region.x));
    const y0 = Math.max(0, Math.floor(region.y));
    const x1 = Math.min(width, Math.ceil(region.x + region.w));
    const y1 = Math.min(height, Math.ceil(region.y + region.h));

    for (let y = y0; y < y1; y += 2) {
      for (let x = x0; x < x1; x += 2) {
        const offset = (y * width + x) * 4;
        values.push([data[offset], data[offset + 1], data[offset + 2]]);
      }
    }
  }

  if (values.length === 0) {
    return {
      mean: [128, 128, 128],
      std: [48, 48, 48],
      confidence: 0,
    };
  }

  const mean: [number, number, number] = [0, 0, 0];
  for (const [r, g, b] of values) {
    mean[0] += r;
    mean[1] += g;
    mean[2] += b;
  }
  mean[0] /= values.length;
  mean[1] /= values.length;
  mean[2] /= values.length;

  const variance: [number, number, number] = [0, 0, 0];
  for (const [r, g, b] of values) {
    variance[0] += (r - mean[0]) ** 2;
    variance[1] += (g - mean[1]) ** 2;
    variance[2] += (b - mean[2]) ** 2;
  }

  variance[0] /= values.length;
  variance[1] /= values.length;
  variance[2] /= values.length;

  const std: [number, number, number] = [Math.sqrt(variance[0]), Math.sqrt(variance[1]), Math.sqrt(variance[2])];
  const spread = (std[0] + std[1] + std[2]) / 3;

  return {
    mean,
    std,
    confidence: clamp(values.length / 300, 0.25, 1) * clamp(1 - spread / 95, 0.25, 1),
  };
}

function rgbDist(a: readonly number[], b: readonly number[]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function summarizeHairLength(length: HairLength, metrics: HairLengthMetrics) {
  const ratio = metrics.belowChinLengthRatio.toFixed(2);
  switch (length) {
    case "bald":
      return `Very little hair signal above the forehead and crown; scalp region resembles skin texture and color. Crown coverage is low (${metrics.crownHairDensity.toFixed(2)}). This often indicates a shaved or naturally bald look—recommendations will favor minimal-hair styles.`;
    case "short":
      return `Visible hair stays mostly above the jaw or only slightly below the chin. Estimated below-chin ratio: ${ratio}.`;
    case "medium":
      return `Visible hair extends below the chin with moderate side coverage, which aligns with a medium-length profile. Estimated below-chin ratio: ${ratio}.`;
    case "long":
      return `Visible hair extends well below the chin with sustained lower coverage, which aligns with a long-hair profile. Estimated below-chin ratio: ${ratio}.`;
    default:
      return `Estimated hair length: ${length}.`;
  }
}

export async function classifyHairLengthFromImage(
  image: HTMLImageElement,
  landmarks: LandmarkLike[],
): Promise<HairLengthAnalysis> {
  if (!Array.isArray(landmarks) || landmarks.length < 455) {
    throw new Error("Not enough facial landmarks were detected to classify hair length.");
  }

  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  const foreheadTop = landmarks[POINTS.foreheadTop];
  const chin = landmarks[POINTS.chin];
  const leftTemple = landmarks[POINTS.leftTemple];
  const rightTemple = landmarks[POINTS.rightTemple];
  const leftCheek = landmarks[POINTS.leftCheek];
  const rightCheek = landmarks[POINTS.rightCheek];
  const leftJaw = landmarks[POINTS.leftJaw];
  const rightJaw = landmarks[POINTS.rightJaw];

  const faceHeight = distance(foreheadTop, chin) * imageHeight;
  const templeLeftX = leftTemple.x * imageWidth;
  const templeRightX = rightTemple.x * imageWidth;
  const cheekLeftX = leftCheek.x * imageWidth;
  const cheekRightX = rightCheek.x * imageWidth;
  const jawLeftX = leftJaw.x * imageWidth;
  const jawRightX = rightJaw.x * imageWidth;
  const faceWidth = Math.max(templeRightX - templeLeftX, cheekRightX - cheekLeftX, jawRightX - jawLeftX);
  const foreheadY = foreheadTop.y * imageHeight;
  const chinY = chin.y * imageHeight;

  const roiX = Math.max(0, Math.floor(templeLeftX - faceWidth * 0.65));
  const roiY = Math.max(0, Math.floor(foreheadY - faceHeight * 0.95));
  const roiRight = Math.min(imageWidth, Math.ceil(templeRightX + faceWidth * 0.65));
  const roiBottom = Math.min(imageHeight, Math.ceil(chinY + faceHeight * 1.2));
  const roiWidth = Math.max(32, roiRight - roiX);
  const roiHeight = Math.max(64, roiBottom - roiY);

  const baseCanvas = createCanvas(imageWidth, imageHeight);
  const baseContext = baseCanvas.getContext("2d", { willReadFrequently: true });
  if (!baseContext) {
    throw new Error("Could not prepare the image for hair-length classification.");
  }

  baseContext.drawImage(image, 0, 0, imageWidth, imageHeight);

  const hairSeedRegions = [
    {
      x: templeLeftX + faceWidth * 0.16,
      y: foreheadY - faceHeight * 0.34,
      w: faceWidth * 0.68,
      h: faceHeight * 0.18,
    },
    {
      x: templeLeftX - faceWidth * 0.14,
      y: foreheadY - faceHeight * 0.05,
      w: faceWidth * 0.16,
      h: faceHeight * 0.18,
    },
    {
      x: templeRightX - faceWidth * 0.02,
      y: foreheadY - faceHeight * 0.05,
      w: faceWidth * 0.16,
      h: faceHeight * 0.18,
    },
  ];

  const skinSeedRegions = [
    {
      x: cheekLeftX + faceWidth * 0.05,
      y: foreheadY + faceHeight * 0.24,
      w: faceWidth * 0.12,
      h: faceHeight * 0.16,
    },
    {
      x: cheekRightX - faceWidth * 0.17,
      y: foreheadY + faceHeight * 0.24,
      w: faceWidth * 0.12,
      h: faceHeight * 0.16,
    },
  ];

  const hairSeedData = baseContext.getImageData(roiX, roiY, roiWidth, roiHeight);
  const localHairSeedRegions = hairSeedRegions.map((region) => ({
    x: region.x - roiX,
    y: region.y - roiY,
    w: region.w,
    h: region.h,
  }));
  const localSkinSeedRegions = skinSeedRegions.map((region) => ({
    x: region.x - roiX,
    y: region.y - roiY,
    w: region.w,
    h: region.h,
  }));

  const hairStats = collectColorStats(hairSeedData.data, roiWidth, roiHeight, localHairSeedRegions);
  const skinStats = collectColorStats(hairSeedData.data, roiWidth, roiHeight, localSkinSeedRegions);

  const targetWidth = 192;
  const targetHeight = Math.max(128, Math.round((roiHeight / roiWidth) * targetWidth));
  const roiCanvas = createCanvas(roiWidth, roiHeight);
  const roiContext = roiCanvas.getContext("2d");
  if (!roiContext) {
    throw new Error("Could not normalize the hair-length crop.");
  }
  roiContext.putImageData(hairSeedData, 0, 0);

  const sampleCanvas = createCanvas(targetWidth, targetHeight);
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sampleContext) {
    throw new Error("Could not sample the image for hair-length analysis.");
  }
  sampleContext.drawImage(roiCanvas, 0, 0, targetWidth, targetHeight);
  const sampled = sampleContext.getImageData(0, 0, targetWidth, targetHeight).data;

  const localForeheadY = ((foreheadY - roiY) / roiHeight) * targetHeight;
  const localChinY = ((chinY - roiY) / roiHeight) * targetHeight;
  const localTempleLeftX = ((templeLeftX - roiX) / roiWidth) * targetWidth;
  const localTempleRightX = ((templeRightX - roiX) / roiWidth) * targetWidth;
  const localJawLeftX = ((jawLeftX - roiX) / roiWidth) * targetWidth;
  const localJawRightX = ((jawRightX - roiX) / roiWidth) * targetWidth;
  const localFaceHeight = (faceHeight / roiHeight) * targetHeight;
  const localFaceWidth = (faceWidth / roiWidth) * targetWidth;

  const mask = new Uint8Array(targetWidth * targetHeight);
  const centerX = (localTempleLeftX + localTempleRightX) / 2;

  let visibleTopY = targetHeight;
  let bottomY = localChinY;
  let lowerCoverageSum = 0;
  let lowerRows = 0;
  let lowerHalfCoverageSum = 0;
  let lowerHalfRows = 0;
  let sideCoverageSum = 0;
  let sideRows = 0;
  const rowCoverages: number[] = [];

  for (let y = 0; y < targetHeight; y += 1) {
    const normalizedY = (y - localForeheadY) / Math.max(1, localFaceHeight);
    const faceHalfWidth =
      normalizedY <= 0
        ? localFaceWidth * 0.32
        : normalizedY < 1
          ? localFaceWidth * (0.32 - normalizedY * 0.08)
          : localFaceWidth * 0.22;

    let rowHits = 0;
    let sideHits = 0;
    let lowerRowHits = 0;

    for (let x = 0; x < targetWidth; x += 1) {
      const offset = (y * targetWidth + x) * 4;
      const pixel: [number, number, number] = [sampled[offset], sampled[offset + 1], sampled[offset + 2]];
      const hairDist = colorDistance(pixel, hairStats);
      const skinDist = colorDistance(pixel, skinStats);
      const luma = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
      const chroma = Math.max(pixel[0], pixel[1], pixel[2]) - Math.min(pixel[0], pixel[1], pixel[2]);
      const outsideFace = Math.abs(x - centerX) > faceHalfWidth;
      const aboveForehead = y < localForeheadY;
      const belowChin = y > localChinY;
      const likelyHairColor = hairDist < 0.9 || (hairDist < 1.12 && hairDist + 0.08 < skinDist);
      const textureAssist = chroma > 14 || luma < 150;
      const geometryGate = aboveForehead || outsideFace || (belowChin && Math.abs(x - centerX) > faceHalfWidth * 0.6);
      const isHair = geometryGate && likelyHairColor && textureAssist;

      if (isHair) {
        mask[y * targetWidth + x] = 1;
        rowHits += 1;
        if (x < localJawLeftX || x > localJawRightX) {
          sideHits += 1;
        }
        if (belowChin) {
          lowerRowHits += 1;
        }
      }
    }

    const rowCoverage = rowHits / targetWidth;
    const sideCoverage = sideHits / Math.max(1, localJawLeftX + (targetWidth - localJawRightX));

    if (rowCoverage > 0.08) {
      visibleTopY = Math.min(visibleTopY, y);
    }

    if (y > localChinY) {
      lowerCoverageSum += rowCoverage;
      lowerRows += 1;
      if (rowCoverage > 0.06 || sideCoverage > 0.1) {
        bottomY = y;
      }
    }

    if (y > localChinY + localFaceHeight * 0.18) {
      lowerHalfCoverageSum += rowCoverage;
      lowerHalfRows += 1;
    }

    if (y > localForeheadY + localFaceHeight * 0.2 && y < localChinY + localFaceHeight * 0.25) {
      sideCoverageSum += sideCoverage;
      sideRows += 1;
    }

    rowCoverages.push(rowCoverage);
  }

  const foreheadBandEnd = Math.min(targetHeight - 1, Math.ceil(localForeheadY + targetHeight * 0.14));
  let crownSum = 0;
  let crownRows = 0;
  for (let y = 0; y <= foreheadBandEnd; y += 1) {
    crownSum += rowCoverages[y] ?? 0;
    crownRows += 1;
  }
  const crownHairDensity = crownRows ? crownSum / crownRows : 0;

  const upperFaceEnd = Math.min(targetHeight - 1, Math.floor(localChinY - localFaceHeight * 0.35));
  let upperSum = 0;
  let upperRows = 0;
  for (let y = 0; y <= Math.max(0, upperFaceEnd); y += 1) {
    upperSum += rowCoverages[y] ?? 0;
    upperRows += 1;
  }
  const upperFaceHairDensity = upperRows ? upperSum / upperRows : crownHairDensity;
  const hairSkinColorDistance = rgbDist(hairStats.mean, skinStats.mean);

  const visibleTopOffsetRatio = clamp((localForeheadY - visibleTopY) / Math.max(1, localFaceHeight), 0, 1.25);
  const belowChinLengthRatio = clamp((bottomY - localChinY) / Math.max(1, localFaceHeight), 0, 1.5);
  const lowerCoverage = clamp(lowerCoverageSum / Math.max(1, lowerRows) / 0.45);
  const lowerHalfCoverage = clamp(lowerHalfCoverageSum / Math.max(1, lowerHalfRows) / 0.36);
  const sideCoverage = clamp(sideCoverageSum / Math.max(1, sideRows) / 0.95);
  const hairSeedConfidence = clamp(hairStats.confidence * (1 - colorDistance(hairStats.mean, skinStats)), 0.2, 1);

  const metrics: HairLengthMetrics = {
    regionWidth: roiWidth,
    regionHeight: roiHeight,
    hairSeedConfidence,
    visibleTopOffsetRatio,
    belowChinLengthRatio,
    lowerCoverage,
    sideCoverage,
    lowerHalfCoverage,
    crownHairDensity,
    hairSkinColorDistance,
  };

  const scalpLike = clamp(1 - hairSkinColorDistance / 52, 0, 1);
  const baldCrown = clamp(1 - crownHairDensity / 0.085, 0, 1);
  const baldUpper = clamp(1 - upperFaceHairDensity / 0.09, 0, 1);
  const baldChin = clamp(1 - belowChinLengthRatio / 0.2, 0, 1);
  const baldSides = clamp(1 - sideCoverage / 0.28, 0, 1);
  const lowHairSignal = clamp(1 - hairSeedConfidence / 0.42, 0, 1);

  const scores: Record<HairLength, number> = {
    bald:
      0.28 * baldCrown +
      0.22 * baldUpper +
      0.18 * baldChin +
      0.14 * baldSides +
      0.14 * scalpLike +
      0.04 * lowHairSignal,
    short:
      0.4 * closeness(belowChinLengthRatio, 0.08, 0.2) +
      0.24 * closeness(lowerCoverage, 0.08, 0.12) +
      0.2 * closeness(lowerHalfCoverage, 0.02, 0.08) +
      0.16 * closeness(sideCoverage, 0.22, 0.22),
    medium:
      0.34 * closeness(belowChinLengthRatio, 0.34, 0.22) +
      0.26 * closeness(lowerCoverage, 0.2, 0.16) +
      0.24 * closeness(sideCoverage, 0.42, 0.24) +
      0.16 * closeness(lowerHalfCoverage, 0.12, 0.12),
    long:
      0.38 * closeness(belowChinLengthRatio, 0.74, 0.38) +
      0.24 * closeness(lowerCoverage, 0.34, 0.2) +
      0.2 * closeness(lowerHalfCoverage, 0.24, 0.16) +
      0.18 * closeness(sideCoverage, 0.54, 0.24),
  };

  if (hairSeedConfidence < 0.3) {
    scores.short += 0.05;
    scores.bald += 0.08;
  }

  const neckShadowFalseLong =
    belowChinLengthRatio > 0.32 &&
    crownHairDensity < 0.095 &&
    upperFaceHairDensity < 0.1 &&
    scalpLike > 0.14;

  if (neckShadowFalseLong) {
    scores.bald += 0.42;
    scores.long *= 0.12;
    scores.medium *= 0.28;
    scores.short *= 0.55;
  }

  const strongBaldProfile =
    crownHairDensity < 0.068 &&
    upperFaceHairDensity < 0.085 &&
    hairSkinColorDistance < 58 &&
    scalpLike > 0.12;

  if (strongBaldProfile) {
    scores.bald = Math.max(scores.bald, 0.9);
    scores.long *= 0.1;
    scores.medium *= 0.26;
    scores.short *= 0.5;
  }

  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]) as Array<[HairLength, number]>;
  let length = ordered[0][0];
  let bestScore = ordered[0][1];
  const secondScore = ordered[1]?.[1] ?? 0;

  if (
    length === "long" &&
    crownHairDensity < 0.078 &&
    upperFaceHairDensity < 0.095 &&
    scalpLike > 0.14
  ) {
    length = "bald";
    bestScore = Math.max(scores.bald, 0.74);
  }

  if (
    length === "medium" &&
    crownHairDensity < 0.065 &&
    upperFaceHairDensity < 0.08 &&
    hairSkinColorDistance < 55
  ) {
    length = "bald";
    bestScore = Math.max(scores.bald, 0.7);
  }

  const confidence = clamp(0.5 + (bestScore - secondScore) * 0.85 + hairSeedConfidence * 0.12, 0.5, 0.98);

  return {
    length,
    confidence,
    metrics,
    scores,
    summary: summarizeHairLength(length, metrics),
  };
}

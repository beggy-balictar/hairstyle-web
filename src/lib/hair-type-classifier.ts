import type { HairType, HairTypeAnalysis, HairTextureMetrics } from "@/types/hair-type";

type LandmarkLike = {
  x: number;
  y: number;
  z?: number;
};

const POINTS = {
  foreheadTop: 10,
  chin: 152,
  leftTemple: 127,
  rightTemple: 356,
  leftCheek: 234,
  rightCheek: 454,
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

function summarizeHairType(type: HairType, metrics: HairTextureMetrics) {
  const curliness = metrics.curlinessIndex.toFixed(2);
  switch (type) {
    case "straight":
      return `Hair pattern looks mostly linear with low curl complexity. Estimated curliness index: ${curliness}.`;
    case "wavy":
      return `Hair pattern shows moderate texture and direction changes that align with a wavy profile. Estimated curliness index: ${curliness}.`;
    case "curly":
      return `Hair pattern shows dense texture and high directional variation that align with a curly profile. Estimated curliness index: ${curliness}.`;
    default:
      return `Estimated hair type: ${type}.`;
  }
}

export async function classifyHairTypeFromImage(
  image: HTMLImageElement,
  landmarks: LandmarkLike[],
): Promise<HairTypeAnalysis> {
  if (!Array.isArray(landmarks) || landmarks.length < 455) {
    throw new Error("Not enough facial landmarks were detected to classify a hair type.");
  }

  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;

  const foreheadTop = landmarks[POINTS.foreheadTop];
  const chin = landmarks[POINTS.chin];
  const leftTemple = landmarks[POINTS.leftTemple];
  const rightTemple = landmarks[POINTS.rightTemple];
  const leftCheek = landmarks[POINTS.leftCheek];
  const rightCheek = landmarks[POINTS.rightCheek];

  const faceHeight = distance(foreheadTop, chin) * imageHeight;
  const templeLeftX = leftTemple.x * imageWidth;
  const templeRightX = rightTemple.x * imageWidth;
  const cheekTopY = Math.min(leftCheek.y, rightCheek.y) * imageHeight;
  const foreheadY = foreheadTop.y * imageHeight;

  const hairX = Math.max(0, Math.floor(templeLeftX - faceHeight * 0.18));
  const hairWidth = Math.min(imageWidth - hairX, Math.ceil(templeRightX - templeLeftX + faceHeight * 0.36));
  const hairTop = Math.max(0, Math.floor(foreheadY - faceHeight * 0.68));
  const hairBottom = Math.min(imageHeight, Math.ceil(cheekTopY + faceHeight * 0.06));
  const hairHeight = Math.max(24, hairBottom - hairTop);

  if (hairWidth < 24 || hairHeight < 24) {
    throw new Error("Visible hair region is too small to classify. Use an image where the hair is clearly shown.");
  }

  const sourceCanvas = createCanvas(imageWidth, imageHeight);
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });

  if (!sourceContext) {
    throw new Error("Could not prepare the image for hair-type classification.");
  }

  sourceContext.drawImage(image, 0, 0, imageWidth, imageHeight);
  const crop = sourceContext.getImageData(hairX, hairTop, hairWidth, hairHeight);

  const targetWidth = 128;
  const targetHeight = Math.max(64, Math.round((hairHeight / hairWidth) * targetWidth));
  const sampleCanvas = createCanvas(targetWidth, targetHeight);
  const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });

  if (!sampleContext) {
    throw new Error("Could not sample the hair region for analysis.");
  }

  const cropCanvas = createCanvas(hairWidth, hairHeight);
  const cropContext = cropCanvas.getContext("2d");

  if (!cropContext) {
    throw new Error("Could not normalize the hair crop for analysis.");
  }

  cropContext.putImageData(crop, 0, 0);
  sampleContext.drawImage(cropCanvas, 0, 0, targetWidth, targetHeight);
  const sampled = sampleContext.getImageData(0, 0, targetWidth, targetHeight).data;

  const gray = new Float32Array(targetWidth * targetHeight);
  for (let i = 0; i < gray.length; i += 1) {
    const offset = i * 4;
    gray[i] = 0.299 * sampled[offset] + 0.587 * sampled[offset + 1] + 0.114 * sampled[offset + 2];
  }

  let edgeCount = 0;
  let laplacianEnergy = 0;
  let totalConsidered = 0;
  let orientationTotal = 0;
  let verticalEnergy = 0;
  const bins = new Array(8).fill(0) as number[];

  for (let y = 1; y < targetHeight - 1; y += 1) {
    for (let x = 1; x < targetWidth - 1; x += 1) {
      const index = y * targetWidth + x;
      const left = gray[index - 1];
      const right = gray[index + 1];
      const top = gray[index - targetWidth];
      const bottom = gray[index + targetWidth];
      const gx = right - left;
      const gy = bottom - top;
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const laplacian = Math.abs(4 * gray[index] - left - right - top - bottom);
      laplacianEnergy += laplacian;
      totalConsidered += 1;

      if (magnitude > 24) {
        edgeCount += 1;
        orientationTotal += magnitude;
        const orientation = (Math.atan2(gy, gx) + Math.PI) % Math.PI;
        const bin = Math.min(7, Math.floor((orientation / Math.PI) * 8));
        bins[bin] += magnitude;
        const verticalDistance = Math.abs(orientation - Math.PI / 2);
        verticalEnergy += magnitude * clamp(1 - verticalDistance / (Math.PI / 2));
      }
    }
  }

  let entropy = 0;
  if (orientationTotal > 0) {
    for (const binValue of bins) {
      if (binValue <= 0) continue;
      const p = binValue / orientationTotal;
      entropy -= p * Math.log2(p);
    }
  }

  const orientationEntropy = clamp(entropy / 3);
  const edgeDensity = clamp(edgeCount / Math.max(1, totalConsidered) / 0.42);
  const textureScore = clamp((laplacianEnergy / Math.max(1, totalConsidered)) / 48);
  const verticalDominance = clamp(verticalEnergy / Math.max(1, orientationTotal));

  let oscillationSum = 0;
  let oscillationRows = 0;
  for (let y = Math.floor(targetHeight * 0.1); y < Math.floor(targetHeight * 0.9); y += 4) {
    let prevDelta = 0;
    let changes = 0;
    for (let x = 2; x < targetWidth - 2; x += 1) {
      const center = gray[y * targetWidth + x];
      const prev = gray[y * targetWidth + x - 2];
      const next = gray[y * targetWidth + x + 2];
      const delta = next - prev + center * 0.1;
      if (Math.abs(delta) < 6) continue;
      if (prevDelta !== 0 && Math.sign(delta) !== Math.sign(prevDelta)) {
        changes += 1;
      }
      prevDelta = delta;
    }
    oscillationSum += changes / Math.max(1, targetWidth / 8);
    oscillationRows += 1;
  }

  const waveOscillation = clamp(oscillationSum / Math.max(1, oscillationRows));
  const curlinessIndex = clamp(
    0.34 * orientationEntropy +
      0.28 * textureScore +
      0.2 * edgeDensity +
      0.1 * waveOscillation +
      0.08 * (1 - verticalDominance),
  );

  const metrics: HairTextureMetrics = {
    regionWidth: hairWidth,
    regionHeight: hairHeight,
    edgeDensity,
    textureScore,
    orientationEntropy,
    verticalDominance,
    waveOscillation,
    curlinessIndex,
  };

  const scores: Record<HairType, number> = {
    straight:
      0.34 * closeness(verticalDominance, 0.62, 0.22) +
      0.22 * closeness(orientationEntropy, 0.32, 0.18) +
      0.22 * closeness(textureScore, 0.28, 0.2) +
      0.12 * closeness(edgeDensity, 0.18, 0.15) +
      0.1 * closeness(waveOscillation, 0.18, 0.16),
    wavy:
      0.32 * closeness(curlinessIndex, 0.5, 0.22) +
      0.22 * closeness(orientationEntropy, 0.56, 0.18) +
      0.18 * closeness(verticalDominance, 0.42, 0.2) +
      0.16 * closeness(waveOscillation, 0.46, 0.22) +
      0.12 * closeness(textureScore, 0.52, 0.22),
    curly:
      0.34 * closeness(curlinessIndex, 0.78, 0.22) +
      0.22 * closeness(orientationEntropy, 0.78, 0.16) +
      0.18 * closeness(edgeDensity, 0.55, 0.22) +
      0.14 * closeness(textureScore, 0.76, 0.22) +
      0.12 * closeness(verticalDominance, 0.25, 0.16),
  };

  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]) as Array<[HairType, number]>;
  const [type, bestScore] = ordered[0];
  const secondScore = ordered[1]?.[1] ?? 0;
  const confidence = clamp(0.52 + (bestScore - secondScore) * 0.9 + bestScore * 0.18, 0.52, 0.98);

  return {
    type,
    confidence,
    metrics,
    scores,
    summary: summarizeHairType(type, metrics),
  };
}

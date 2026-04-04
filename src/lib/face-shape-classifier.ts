import type { FaceShape, FaceShapeAnalysis, FaceShapeMetrics } from "@/types/face-shape";

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
  leftJaw: 172,
  rightJaw: 397,
} as const;

function distance(a: LandmarkLike, b: LandmarkLike) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z ?? 0) - (b.z ?? 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function closeness(value: number, target: number, tolerance: number) {
  return clamp(1 - Math.abs(value - target) / tolerance);
}

function summarizeShape(shape: FaceShape, metrics: FaceShapeMetrics) {
  const ratio = metrics.lengthToWidthRatio.toFixed(2);
  switch (shape) {
    case "triangle":
      return `Jawline appears wider than the forehead, which matches a triangle profile. Length-to-width ratio: ${ratio}.`;
    case "oval":
      return `Face length is gently longer than the widest horizontal section, which fits an oval profile. Length-to-width ratio: ${ratio}.`;
    case "round":
      return `Face length and width are close, with soft width transitions that fit a round profile. Length-to-width ratio: ${ratio}.`;
    case "square":
      return `Forehead, cheekbones, and jawline are balanced with a strong jaw area, which fits a square profile. Length-to-width ratio: ${ratio}.`;
    case "oblong":
      return `Face is noticeably longer than it is wide, with softer sides that fit an oblong profile. Length-to-width ratio: ${ratio}.`;
    case "diamond":
      return `Cheekbones are the widest area while forehead and jaw taper inward, which fits a diamond profile. Length-to-width ratio: ${ratio}.`;
    case "rectangle":
      return `Face is long with fairly straight sides and a firm jawline, which fits a rectangle profile. Length-to-width ratio: ${ratio}.`;
    default:
      return `Detected ${shape} profile.`;
  }
}

export function classifyFaceShapeFromLandmarks(landmarks: LandmarkLike[]): FaceShapeAnalysis {
  if (!Array.isArray(landmarks) || landmarks.length < 455) {
    throw new Error("Not enough facial landmarks were detected to classify a face shape.");
  }

  const faceLength = distance(landmarks[POINTS.foreheadTop], landmarks[POINTS.chin]);
  const foreheadWidth = distance(landmarks[POINTS.leftTemple], landmarks[POINTS.rightTemple]);
  const cheekboneWidth = distance(landmarks[POINTS.leftCheek], landmarks[POINTS.rightCheek]);
  const jawWidth = distance(landmarks[POINTS.leftJaw], landmarks[POINTS.rightJaw]);
  const dominantWidth = Math.max(foreheadWidth, cheekboneWidth, jawWidth);

  const metrics: FaceShapeMetrics = {
    faceLength,
    foreheadWidth,
    cheekboneWidth,
    jawWidth,
    dominantWidth,
    lengthToWidthRatio: faceLength / dominantWidth,
    jawToForeheadRatio: jawWidth / foreheadWidth,
    cheekToJawRatio: cheekboneWidth / jawWidth,
    cheekToForeheadRatio: cheekboneWidth / foreheadWidth,
  };

  const widthsAreBalanced =
    1 -
    ((Math.max(foreheadWidth, cheekboneWidth, jawWidth) - Math.min(foreheadWidth, cheekboneWidth, jawWidth)) /
      dominantWidth);

  const scores: Record<FaceShape, number> = {
    triangle:
      0.55 * clamp((metrics.jawToForeheadRatio - 1.05) / 0.18) +
      0.25 * closeness(metrics.lengthToWidthRatio, 1.28, 0.35) +
      0.2 * clamp(1 - metrics.cheekToJawRatio, 0, 1),
    oval:
      0.42 * closeness(metrics.lengthToWidthRatio, 1.38, 0.22) +
      0.33 * closeness(metrics.cheekToForeheadRatio, 1.04, 0.14) +
      0.25 * closeness(metrics.jawToForeheadRatio, 0.92, 0.16),
    round:
      0.45 * closeness(metrics.lengthToWidthRatio, 1.1, 0.16) +
      0.3 * clamp(widthsAreBalanced, 0, 1) +
      0.25 * closeness(metrics.jawToForeheadRatio, 0.98, 0.12),
    square:
      0.4 * closeness(metrics.lengthToWidthRatio, 1.15, 0.16) +
      0.35 * clamp(widthsAreBalanced, 0, 1) +
      0.25 * closeness(metrics.jawToForeheadRatio, 1.0, 0.1),
    oblong:
      0.5 * closeness(metrics.lengthToWidthRatio, 1.62, 0.22) +
      0.25 * closeness(metrics.jawToForeheadRatio, 0.9, 0.16) +
      0.25 * closeness(metrics.cheekToJawRatio, 1.08, 0.15),
    diamond:
      0.45 * clamp((metrics.cheekToForeheadRatio - 1.06) / 0.14, 0, 1) +
      0.35 * clamp((metrics.cheekToJawRatio - 1.06) / 0.14, 0, 1) +
      0.2 * closeness(metrics.lengthToWidthRatio, 1.36, 0.24),
    rectangle:
      0.5 * closeness(metrics.lengthToWidthRatio, 1.62, 0.24) +
      0.3 * clamp(widthsAreBalanced, 0, 1) +
      0.2 * closeness(metrics.jawToForeheadRatio, 1.0, 0.1),
  };

  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]) as Array<[FaceShape, number]>;
  const [shape, bestScore] = ordered[0];
  const secondScore = ordered[1]?.[1] ?? 0;
  const confidence = clamp(0.55 + (bestScore - secondScore) * 0.8 + bestScore * 0.15, 0.55, 0.99);

  return {
    shape,
    confidence,
    metrics,
    scores,
    summary: summarizeShape(shape, metrics),
  };
}

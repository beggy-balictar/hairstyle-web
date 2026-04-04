export const FACE_SHAPES = [
  "triangle",
  "oval",
  "round",
  "square",
  "oblong",
  "diamond",
  "rectangle",
] as const;

export type FaceShape = (typeof FACE_SHAPES)[number];

export type FaceShapeMetrics = {
  faceLength: number;
  foreheadWidth: number;
  cheekboneWidth: number;
  jawWidth: number;
  dominantWidth: number;
  lengthToWidthRatio: number;
  jawToForeheadRatio: number;
  cheekToJawRatio: number;
  cheekToForeheadRatio: number;
};

export type FaceShapeAnalysis = {
  shape: FaceShape;
  confidence: number;
  metrics: FaceShapeMetrics;
  scores: Record<FaceShape, number>;
  summary: string;
};

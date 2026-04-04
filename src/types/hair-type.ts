export const HAIR_TYPES = ["straight", "wavy", "curly"] as const;

export type HairType = (typeof HAIR_TYPES)[number];

export type HairTextureMetrics = {
  regionWidth: number;
  regionHeight: number;
  edgeDensity: number;
  textureScore: number;
  orientationEntropy: number;
  verticalDominance: number;
  waveOscillation: number;
  curlinessIndex: number;
};

export type HairTypeAnalysis = {
  type: HairType;
  confidence: number;
  metrics: HairTextureMetrics;
  scores: Record<HairType, number>;
  summary: string;
};

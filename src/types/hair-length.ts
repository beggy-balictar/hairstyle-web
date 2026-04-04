export const HAIR_LENGTHS = ["short", "medium", "long"] as const;

export type HairLength = (typeof HAIR_LENGTHS)[number];

export type HairLengthMetrics = {
  regionWidth: number;
  regionHeight: number;
  hairSeedConfidence: number;
  visibleTopOffsetRatio: number;
  belowChinLengthRatio: number;
  lowerCoverage: number;
  sideCoverage: number;
  lowerHalfCoverage: number;
};

export type HairLengthAnalysis = {
  length: HairLength;
  confidence: number;
  metrics: HairLengthMetrics;
  scores: Record<HairLength, number>;
  summary: string;
};

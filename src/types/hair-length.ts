export const HAIR_LENGTHS = ["bald", "short", "medium", "long"] as const;

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
  /** Average hair-mask coverage in the crown band above the forehead (0–1). */
  crownHairDensity: number;
  /** RGB distance between hair-seed and skin-seed means (0–~440). */
  hairSkinColorDistance: number;
};

export type HairLengthAnalysis = {
  length: HairLength;
  confidence: number;
  metrics: HairLengthMetrics;
  scores: Record<HairLength, number>;
  summary: string;
};

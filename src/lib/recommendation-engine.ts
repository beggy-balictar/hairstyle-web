import type { Hairstyle } from "@prisma/client";
import type { FaceShape } from "@/types/face-shape";
import type { HairLength } from "@/types/hair-length";
import type { HairType } from "@/types/hair-type";

export type ScoredHairstyle = {
  hairstyle: Hairstyle;
  score: number;
  reason: string;
};

function parseShapeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).toLowerCase());
  }
  return [];
}

const lengthKeywords: Record<HairLength, string[]> = {
  bald: ["buzz", "bald", "shave", "skin", "fade", "crop"],
  short: ["pixie", "crop", "buzz", "short", "taper"],
  medium: ["bob", "lob", "medium", "shoulder"],
  long: ["long", "layer", "mermaid", "extensions"],
};

function lengthBonus(hairstyle: Hairstyle, hairLength: HairLength): number {
  const hay = `${hairstyle.name} ${hairstyle.category ?? ""} ${hairstyle.description ?? ""}`.toLowerCase();
  let bonus = 0;
  for (const kw of lengthKeywords[hairLength]) {
    if (hay.includes(kw)) bonus += 4;
  }
  return Math.min(bonus, 12);
}

function hairTypeBonus(hairstyle: Hairstyle, hairType: HairType): number {
  const hay = `${hairstyle.description ?? ""} ${hairstyle.name}`.toLowerCase();
  if (hairType === "curly" && (hay.includes("curl") || hay.includes("coil") || hay.includes("natural"))) return 8;
  if (hairType === "wavy" && (hay.includes("wave") || hay.includes("texture"))) return 6;
  if (hairType === "straight" && (hay.includes("sleek") || hay.includes("blunt") || hay.includes("straight"))) return 6;
  return 0;
}

export function scoreHairstyles(
  hairstyles: Hairstyle[],
  faceShape: FaceShape,
  hairType: HairType,
  hairLength: HairLength,
): ScoredHairstyle[] {
  const shapeLc = faceShape.toLowerCase();
  const shapeMatchedOnly = hairstyles.filter((hairstyle) => {
    const shapes = parseShapeList(hairstyle.suitableFaceShapes);
    return shapes.includes(shapeLc);
  });

  const scored = shapeMatchedOnly.map((hairstyle) => {
    let score = 75;
    const reason = `Strong match for your ${faceShape} face shape.`;

    score += lengthBonus(hairstyle, hairLength);
    score += hairTypeBonus(hairstyle, hairType);

    return { hairstyle, score, reason };
  });

  return scored.sort((a, b) => b.score - a.score);
}

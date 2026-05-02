import { readFile } from "fs/promises";
import path from "path";
import { GoogleGenAI, type Part } from "@google/genai";

const DEFAULT_MODEL = "gemini-2.5-flash-image";
const FALLBACK_MODELS = ["gemini-2.0-flash-exp-image-generation"];

function extToMime(ext: string): "image/jpeg" | "image/png" | "image/webp" {
  const e = ext.toLowerCase();
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  return "image/jpeg";
}

export function publicImagePathToAbsolute(publicUrl: string): string {
  const rel = publicUrl.startsWith("/") ? publicUrl.slice(1) : publicUrl;
  return path.join(process.cwd(), "public", rel);
}

export async function readPublicImageAsBase64(publicUrl: string): Promise<{ base64: string; mimeType: string }> {
  const abs = publicImagePathToAbsolute(publicUrl);
  const ext = path.extname(abs).replace(".", "") || "jpg";
  const buf = await readFile(abs);
  return { base64: buf.toString("base64"), mimeType: extToMime(ext) };
}

async function loadReferenceAsBase64(referenceImageUrl: string): Promise<{ base64: string; mimeType: string } | null> {
  const trimmed = referenceImageUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const res = await fetch(trimmed);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "image/jpeg";
    const mime = ct.startsWith("image/") ? ct.split(";")[0].trim() : "image/jpeg";
    return { base64: buf.toString("base64"), mimeType: mime };
  }
  if (trimmed.startsWith("/")) {
    try {
      return await readPublicImageAsBase64(trimmed);
    } catch {
      return null;
    }
  }
  return null;
}

export type HairstylePreviewParams = {
  faceImageBase64: string;
  faceMimeType: string;
  faceShape?: string | null;
  hairstyleName: string;
  matchScore?: number | null;
  hairstyleDescription?: string | null;
  referenceImageUrl?: string | null;
};

export async function generateHairstylePreviewImage(
  params: HairstylePreviewParams,
): Promise<{ pngBuffer: Buffer; model: string; note?: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const model = (process.env.GEMINI_HAIRSTYLE_MODEL || DEFAULT_MODEL).trim();
  const ai = new GoogleGenAI({ apiKey });

  const faceShape = params.faceShape?.trim() || "oval";
  const score = Number.isFinite(params.matchScore as number) ? Number(params.matchScore) : 92;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const styleText = params.hairstyleDescription?.trim();

  const instruction = [
    `Generate a realistic hairstyle preview for a person with ${faceShape} face shape.`,
    `Apply the hairstyle: ${params.hairstyleName}.`,
    `The hairstyle match score is ${clampedScore}%, so make it look highly suitable.`,
    "Use a clean salon-style portrait, front-facing angle, natural lighting, and realistic hair texture.",
    "Do not add text, logos, or extra accessories.",
    styleText ? `Style note: ${styleText}.` : "",
    "Edit only the hairstyle on the provided face image and keep the same person identity.",
  ]
    .filter(Boolean)
    .join(" ");

  const parts: Part[] = [
    { text: instruction },
    { inlineData: { mimeType: params.faceMimeType, data: params.faceImageBase64 } },
  ];

  let refNote: string | undefined;
  if (params.referenceImageUrl) {
    const ref = await loadReferenceAsBase64(params.referenceImageUrl);
    if (ref) {
      parts.push({ text: "REFERENCE hairstyle (style inspiration only):" });
      parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.base64 } });
    } else {
      refNote = "Reference image could not be loaded; generated using text only.";
    }
  }

  const modelsToTry = [model, ...FALLBACK_MODELS.filter((m) => m !== model)];
  let response:
    | Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>
    | undefined;
  let usedModel = model;
  let lastErr: unknown;

  for (const candidateModel of modelsToTry) {
    try {
      response = await ai.models.generateContent({
        model: candidateModel,
        contents: [{ role: "user", parts }],
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });
      usedModel = candidateModel;
      lastErr = undefined;
      break;
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const canRetryOnDifferentModel =
        msg.includes("429") || msg.includes("404") || msg.includes("not found") || msg.includes("does not exist");
      if (!canRetryOnDifferentModel) {
        break;
      }
    }
  }

  if (!response) {
    const msg = lastErr instanceof Error ? lastErr.message : String(lastErr ?? "Unknown Gemini error");
    if (msg.includes("API_KEY_INVALID") || msg.includes("API Key not found")) {
      throw new Error("Gemini API key is invalid. Please create/copy a fresh key from AI Studio and paste it into GEMINI_API_KEY.");
    }
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
      throw new Error("Gemini quota is exhausted for this key/project. Enable billing or wait for quota reset, then retry.");
    }
    throw new Error(`Gemini request failed: ${msg}`);
  }

  const candidate = response.candidates?.[0];
  const outParts = candidate?.content?.parts;
  if (!outParts?.length) {
    const reason = response.promptFeedback?.blockReason || "No image returned";
    throw new Error(`Gemini did not return an image (${reason}).`);
  }

  for (const part of outParts) {
    const inline = part.inlineData;
    if (inline?.data) {
      return { pngBuffer: Buffer.from(inline.data, "base64"), model: usedModel, note: refNote };
    }
  }

  const maybeData = typeof (response as { data?: string }).data === "string" ? (response as { data: string }).data : null;
  if (maybeData) {
    return { pngBuffer: Buffer.from(maybeData, "base64"), model: usedModel, note: refNote };
  }

  throw new Error("Gemini response contained no image bytes.");
}

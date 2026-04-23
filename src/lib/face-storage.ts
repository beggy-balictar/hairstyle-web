import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export function mimeToExt(mime: string): "jpg" | "png" | "webp" | null {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

export function assertAllowedImageMime(mime: string) {
  if (!ALLOWED.has(mime)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed.");
  }
}

export async function saveFaceUploadFile(id: string, buffer: Buffer, ext: "jpg" | "png" | "webp") {
  const dir = path.join(process.cwd(), "public", "uploads", "faces");
  await mkdir(dir, { recursive: true });
  const filename = `${id}.${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/faces/${filename}`;
}

import { NextResponse } from "next/server";
import { UploadType } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { assertAllowedImageMime, mimeToExt, saveFaceUploadFile } from "@/lib/face-storage";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  const uploadTypeRaw = String(form.get("uploadType") ?? "UPLOAD").toUpperCase();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }

  const uploadType = uploadTypeRaw === "CAMERA" ? UploadType.CAMERA : UploadType.UPLOAD;

  const mime = file.type || "application/octet-stream";
  try {
    assertAllowedImageMime(mime);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid file type." }, { status: 400 });
  }

  const ext = mimeToExt(mime);
  if (!ext) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
  }

  const id = randomUUID();
  try {
    const imageUrl = await saveFaceUploadFile(id, buffer, ext);

    const record = await prisma.faceUpload.create({
      data: {
        id,
        userId: session.sub,
        imageUrl,
        uploadType,
        fileName: file.name || null,
        fileSize: buffer.length,
        mimeType: mime,
      },
    });

    return NextResponse.json({
      id: record.id,
      imageUrl: record.imageUrl,
    });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not save upload." }, { status: 500 });
  }
}

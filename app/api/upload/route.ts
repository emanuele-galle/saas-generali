import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { auth } from "@/auth";
import {
  UPLOAD_DIR,
  MAX_FILE_SIZE,
  ALLOWED_TYPES,
  generateFilename,
  getPublicUrl,
} from "@/lib/upload";
import { validateMagicBytes } from "@/lib/file-validation";
import { db } from "@/server/db";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const replaceUrl = formData.get("replaceUrl") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nessun file fornito" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File troppo grande (max 5MB)" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo file non supportato. Usa JPEG, PNG, WebP, GIF o SVG." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "Il contenuto del file non corrisponde al tipo dichiarato" },
        { status: 400 },
      );
    }

    const filename = generateFilename(file.name);

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Resize with sharp (skip for SVG)
    let outputBuffer: Buffer = buffer;
    let outputFilename = filename;

    if (file.type !== "image/svg+xml") {
      const ext = path.extname(filename);
      if (ext !== ".webp" && ext !== ".gif") {
        outputFilename = filename.replace(ext, ".webp");
        outputBuffer = await sharp(buffer)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
      } else {
        outputBuffer = await sharp(buffer)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .toBuffer();
      }
    }

    const filepath = path.join(UPLOAD_DIR, outputFilename);
    await writeFile(filepath, outputBuffer);

    const url = getPublicUrl(outputFilename);

    // Save media record
    const media = await db.media.create({
      data: {
        filename: outputFilename,
        url,
        mimeType: file.type !== "image/svg+xml" ? "image/webp" : file.type,
        size: outputBuffer.length,
        uploadedBy: session.user.id,
      },
    });

    // Clean up old file if replacing
    if (replaceUrl) {
      const oldFilename = replaceUrl.split("/").pop();
      if (oldFilename) {
        const oldPath = path.join(UPLOAD_DIR, oldFilename);
        unlink(oldPath).catch(() => {});
        db.media.deleteMany({ where: { filename: oldFilename } }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      url,
      id: media.id,
      filename: outputFilename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload" },
      { status: 500 }
    );
  }
}

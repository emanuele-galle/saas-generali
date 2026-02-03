import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/upload";

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Prevent directory traversal
  const sanitized = path.basename(filename);
  const filepath = path.join(UPLOAD_DIR, sanitized);

  try {
    await stat(filepath);
    const buffer = await readFile(filepath);
    const ext = path.extname(sanitized).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File non trovato" }, { status: 404 });
  }
}

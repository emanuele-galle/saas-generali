import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  return `${randomUUID()}${ext}`;
}

export function getPublicUrl(filename: string): string {
  return `/api/uploads/${filename}`;
}

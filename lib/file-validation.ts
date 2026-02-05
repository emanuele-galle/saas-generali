const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46], // RIFF header
  "image/gif": [0x47, 0x49, 0x46, 0x38],
};

export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  // SVG: check for <svg in the first 1000 chars
  if (mimeType === "image/svg+xml") {
    const head = buffer.subarray(0, 1000).toString("utf-8");
    return head.includes("<svg");
  }

  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return false;

  if (buffer.length < expected.length) return false;

  return expected.every((byte, i) => buffer[i] === byte);
}

import { describe, it, expect } from "vitest";
import { validateMagicBytes } from "../file-validation";

describe("validateMagicBytes", () => {
  it("validates JPEG magic bytes", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(validateMagicBytes(buf, "image/jpeg")).toBe(true);
  });

  it("validates PNG magic bytes", () => {
    const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    expect(validateMagicBytes(buf, "image/png")).toBe(true);
  });

  it("validates WebP magic bytes (RIFF header)", () => {
    const buf = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00]);
    expect(validateMagicBytes(buf, "image/webp")).toBe(true);
  });

  it("validates GIF magic bytes", () => {
    const buf = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
    expect(validateMagicBytes(buf, "image/gif")).toBe(true);
  });

  it("validates SVG by checking for <svg tag", () => {
    const buf = Buffer.from('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(validateMagicBytes(buf, "image/svg+xml")).toBe(true);
  });

  it("rejects SVG without <svg tag", () => {
    const buf = Buffer.from("<html><body>Not an SVG</body></html>");
    expect(validateMagicBytes(buf, "image/svg+xml")).toBe(false);
  });

  it("rejects a .txt file disguised as JPEG", () => {
    const buf = Buffer.from("This is not a JPEG file at all");
    expect(validateMagicBytes(buf, "image/jpeg")).toBe(false);
  });

  it("rejects a PNG buffer declared as JPEG", () => {
    const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    expect(validateMagicBytes(buf, "image/jpeg")).toBe(false);
  });

  it("rejects unknown mime types", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff]);
    expect(validateMagicBytes(buf, "application/pdf")).toBe(false);
  });

  it("rejects buffers too short for magic bytes", () => {
    const buf = Buffer.from([0xff, 0xd8]);
    expect(validateMagicBytes(buf, "image/jpeg")).toBe(false);
  });
});

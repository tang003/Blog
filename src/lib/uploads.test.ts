import { describe, expect, it } from "vitest";
import { extensionForUpload, validateUploadFile } from "./uploads";

const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
const jpg = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
const gif = Buffer.from("GIF89a", "ascii");
const webp = Buffer.from("RIFFxxxxWEBP", "ascii");

describe("upload validation", () => {
  it("maps extensions from mime types", () => {
    expect(extensionForUpload("image/jpeg")).toBe("jpg");
    expect(extensionForUpload("image/png")).toBe("png");
    expect(extensionForUpload("image/webp")).toBe("webp");
    expect(extensionForUpload("image/gif")).toBe("gif");
    expect(extensionForUpload("text/plain")).toBe("bin");
  });

  it("accepts supported image signatures", () => {
    expect(validateUploadFile("image/png", png.length, png)).toBeNull();
    expect(validateUploadFile("image/jpeg", jpg.length, jpg)).toBeNull();
    expect(validateUploadFile("image/gif", gif.length, gif)).toBeNull();
    expect(validateUploadFile("image/webp", webp.length, webp)).toBeNull();
  });

  it("rejects unsupported, oversized, and spoofed files", () => {
    expect(validateUploadFile("text/plain", 4, Buffer.from("test"))).toBe("Unsupported image type.");
    expect(validateUploadFile("image/png", 5 * 1024 * 1024 + 1, png)).toBe(
      "Image must be smaller than 5MB.",
    );
    expect(validateUploadFile("image/png", 4, Buffer.from("nope"))).toBe("Invalid image content.");
  });
});

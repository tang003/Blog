export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function extensionForUpload(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export function hasValidImageMagicBytes(type: string, bytes: Buffer) {
  if (type === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }

  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (type === "image/gif") {
    const signature = bytes.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }

  if (type === "image/webp") {
    return (
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

export function validateUploadFile(type: string, size: number, bytes: Buffer) {
  if (!allowedTypes.has(type)) {
    return "Unsupported image type.";
  }

  if (size > MAX_UPLOAD_SIZE) {
    return "Image must be smaller than 5MB.";
  }

  if (!hasValidImageMagicBytes(type, bytes)) {
    return "Invalid image content.";
  }

  return null;
}

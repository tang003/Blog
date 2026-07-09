import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type StorageDriver = "local" | "s3";

type UploadObjectInput = {
  key: string;
  contentType: string;
  body: Buffer;
};

export function getStorageDriver(): StorageDriver {
  return process.env.STORAGE_DRIVER === "s3" ? "s3" : "local";
}

export function getUploadPublicUrl(path: string) {
  const cdnBaseUrl = process.env.UPLOAD_PUBLIC_BASE_URL?.replace(/\/$/, "");

  if (cdnBaseUrl && path.startsWith("/uploads/")) {
    return `${cdnBaseUrl}${path}`;
  }

  return path;
}

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });
}

export async function uploadObject(input: UploadObjectInput) {
  assertStorageConfigured();

  if (getStorageDriver() !== "s3") {
    throw new Error("uploadObject only supports s3 storage.");
  }

  const bucket = process.env.S3_BUCKET;

  if (!bucket) {
    throw new Error("S3_BUCKET is required.");
  }

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return getUploadPublicUrl(`/${input.key}`);
}

export function assertStorageConfigured() {
  if (getStorageDriver() === "local") {
    return;
  }

  const required = [
    "S3_ENDPOINT",
    "S3_BUCKET",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "UPLOAD_PUBLIC_BASE_URL",
  ];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing storage environment variables: ${missing.join(", ")}`);
  }
}

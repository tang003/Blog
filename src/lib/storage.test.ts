import { afterEach, describe, expect, it } from "vitest";
import { assertStorageConfigured, getStorageDriver, getUploadPublicUrl } from "./storage";

describe("storage config", () => {
  const originalDriver = process.env.STORAGE_DRIVER;
  const originalBaseUrl = process.env.UPLOAD_PUBLIC_BASE_URL;
  const originalBucket = process.env.S3_BUCKET;

  afterEach(() => {
    process.env.STORAGE_DRIVER = originalDriver;
    process.env.UPLOAD_PUBLIC_BASE_URL = originalBaseUrl;
    process.env.S3_BUCKET = originalBucket;
  });

  it("defaults to local storage", () => {
    delete process.env.STORAGE_DRIVER;
    expect(getStorageDriver()).toBe("local");
  });

  it("maps upload paths to a public base URL", () => {
    process.env.UPLOAD_PUBLIC_BASE_URL = "https://cdn.example.com/";
    expect(getUploadPublicUrl("/uploads/a.png")).toBe("https://cdn.example.com/uploads/a.png");
  });

  it("requires S3 settings when S3 storage is enabled", () => {
    process.env.STORAGE_DRIVER = "s3";
    delete process.env.S3_BUCKET;

    expect(() => assertStorageConfigured()).toThrow("S3_BUCKET");
  });
});

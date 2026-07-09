import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  assertStorageConfigured,
  getStorageDriver,
  getUploadPublicUrl,
  uploadObject,
} from "@/lib/storage";
import { extensionForUpload, validateUploadFile } from "@/lib/uploads";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const error = validateUploadFile(file.type, file.size, bytes);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  assertStorageConfigured();

  const filename = `${Date.now()}-${randomUUID()}.${extensionForUpload(file.type)}`;

  if (getStorageDriver() === "s3") {
    const url = await uploadObject({
      key: `uploads/${filename}`,
      contentType: file.type,
      body: bytes,
    });

    return NextResponse.json({ url });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  await writeFile(path.join(uploadDir, filename), bytes);

  return NextResponse.json({
    url: getUploadPublicUrl(`/uploads/${filename}`),
  });
}

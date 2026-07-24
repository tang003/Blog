import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const CONTENT_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

type RouteContext = {
  params: Promise<{
    filename: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { filename } = await context.params;

  if (!/^[a-zA-Z0-9._-]+\.(gif|jpe?g|png|webp)$/i.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    const file = await readFile(filePath);
    const extension = path.extname(filename).toLowerCase();

    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

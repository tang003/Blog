import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "blog-silas",
    timestamp: new Date().toISOString(),
  });
}

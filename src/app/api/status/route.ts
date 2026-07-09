import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [posts, comments, pageViews] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.comment.count(),
    prisma.pageView.count(),
  ]);

  return NextResponse.json({
    ok: true,
    posts,
    comments,
    pageViews,
    timestamp: new Date().toISOString(),
  });
}

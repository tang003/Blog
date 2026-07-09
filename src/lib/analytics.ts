import { prisma } from "@/lib/prisma";

export function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function recordPostView(postId: string, path: string, headers?: Headers) {
  const referrer = headers?.get("referer") ?? null;
  const userAgent = headers?.get("user-agent") ?? null;
  const date = startOfUtcDay();

  await prisma.$transaction([
    prisma.post.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.pageView.create({
      data: { path, referrer, userAgent },
    }),
    prisma.dailyPostView.upsert({
      where: {
        postId_date: {
          postId,
          date,
        },
      },
      create: {
        postId,
        date,
        count: 1,
      },
      update: {
        count: { increment: 1 },
      },
    }),
  ]);
}

export async function getAdminStats() {
  const [totalViews, todayViews, popularPosts, recentViews] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({
      where: { createdAt: { gte: startOfUtcDay() } },
    }),
    prisma.post.findMany({
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, viewCount: true },
    }),
    prisma.dailyPostView.findMany({
      orderBy: { date: "desc" },
      take: 14,
      include: { post: { select: { title: true, slug: true } } },
    }),
  ]);

  return { totalViews, todayViews, popularPosts, recentViews };
}

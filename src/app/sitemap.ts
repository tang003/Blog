import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${site.url}/archive`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${site.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        tags: true,
        updatedAt: true,
      },
    });

    return [
      ...baseRoutes,
      ...posts.map((post) => ({
        url: `${site.url}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...Array.from(new Set(posts.flatMap((post) => post.tags))).map((tag) => ({
        url: `${site.url}/tags/${encodeURIComponent(tag)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return baseRoutes;
  }
}

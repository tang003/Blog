import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SearchPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: Date | null;
};

export function buildSearchWhere(query: string): Prisma.PostWhereInput {
  return {
    published: true,
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { excerpt: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
      { tags: { has: query } },
    ],
  };
}

export async function searchPosts(query: string) {
  const posts = await prisma.$queryRaw<SearchPost[]>`
    SELECT
      "id",
      "title",
      "slug",
      "excerpt",
      "tags",
      "publishedAt"
    FROM "Post"
    WHERE
      "published" = true
      AND (
        to_tsvector('simple', "title" || ' ' || "excerpt" || ' ' || "content")
          @@ plainto_tsquery('simple', ${query})
        OR "title" ILIKE ${`%${query}%`}
        OR "excerpt" ILIKE ${`%${query}%`}
        OR "content" ILIKE ${`%${query}%`}
        OR ${query} = ANY("tags")
      )
    ORDER BY
      ts_rank(
        to_tsvector('simple', "title" || ' ' || "excerpt" || ' ' || "content"),
        plainto_tsquery('simple', ${query})
      ) DESC,
      "publishedAt" DESC NULLS LAST
    LIMIT 50
  `;

  if (posts.length > 0) {
    return posts;
  }

  return prisma.post.findMany({
    where: buildSearchWhere(query),
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
    },
  });
}

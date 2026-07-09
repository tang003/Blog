import { prisma } from "@/lib/prisma";

const CHUNK_SIZE = 1200;

export function chunkText(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];

  for (let index = 0; index < normalized.length; index += CHUNK_SIZE) {
    chunks.push(normalized.slice(index, index + CHUNK_SIZE));
  }

  return chunks;
}

export async function rebuildAiDocuments() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true, slug: true, content: true, updatedAt: true },
  });

  for (const post of posts) {
    const chunks = chunkText(`${post.title}\n${post.content}`);

    await prisma.aiDocument.deleteMany({ where: { postId: post.id } });

    for (const [chunk, content] of chunks.entries()) {
      await prisma.aiDocument.create({
        data: {
          postId: post.id,
          chunk,
          content,
          metadata: {
            title: post.title,
            slug: post.slug,
            updatedAt: post.updatedAt.toISOString(),
          },
        },
      });
    }
  }
}

export async function searchAiDocuments(query: string) {
  return prisma.aiDocument.findMany({
    where: {
      content: { contains: query, mode: "insensitive" },
    },
    take: 8,
    include: {
      post: { select: { title: true, slug: true } },
    },
  });
}

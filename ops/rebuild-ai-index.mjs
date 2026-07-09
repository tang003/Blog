import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const chunkSize = 1200;

function chunkText(content) {
  const normalized = content.replace(/\s+/g, " ").trim();
  const chunks = [];

  for (let index = 0; index < normalized.length; index += chunkSize) {
    chunks.push(normalized.slice(index, index + chunkSize));
  }

  return chunks;
}

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

await prisma.$disconnect();

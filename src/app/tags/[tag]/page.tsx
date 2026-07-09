import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: decodedTag,
    description: `Silas Blog 中标记为 ${decodedTag} 的文章。`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      tags: {
        has: decodedTag,
      },
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
    },
  });

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="py-12">
      <p className="text-sm font-medium uppercase text-teal-700">Tag</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{decodedTag}</h1>
      <p className="mt-3 text-zinc-600">共 {posts.length} 篇文章。</p>

      <div className="mt-10 grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

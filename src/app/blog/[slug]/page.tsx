import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, published: true },
  });

  if (!post || !post.published) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: `${post.title} | Silas Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl py-12 sm:py-16">
      <time className="text-sm text-zinc-500">
        {post.publishedAt?.toLocaleDateString("zh-CN") ?? "未设置日期"}
      </time>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-6 text-xl leading-8 text-zinc-600">{post.excerpt}</p>
      {post.tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-10 border-t border-zinc-200 pt-8">
        <MarkdownContent content={post.content} />
      </div>
    </article>
  );
}

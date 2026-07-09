import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { MarkdownContent } from "@/components/markdown-content";
import { TableOfContents } from "@/components/table-of-contents";
import { createCommentAction } from "@/app/blog/actions";
import { recordPostView } from "@/lib/analytics";
import { extractToc } from "@/lib/markdown";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

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
    select: { title: true, excerpt: true, published: true, coverImage: true },
  });

  if (!post || !post.published) {
    return { title: "文章不存在" };
  }

  const url = `${site.url}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
      url,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  await recordPostView(post.id, `/blog/${post.slug}`, await headers());

  const toc = extractToc(post.content);
  const publishedAt = post.publishedAt ?? post.createdAt;
  const articleUrl = `${site.url}/blog/${post.slug}`;

  const [previousPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: {
        published: true,
        publishedAt: { lt: publishedAt },
      },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true },
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        publishedAt: { gt: publishedAt },
      },
      orderBy: { publishedAt: "asc" },
      select: { title: true, slug: true },
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    datePublished: publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage ? [post.coverImage] : undefined,
    author: {
      "@type": "Person",
      name: "Silas",
    },
  };

  return (
    <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <article className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <time>{post.publishedAt?.toLocaleDateString("zh-CN") ?? "未设置日期"}</time>
          <span>{post.viewCount + 1} 次阅读</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-6 text-xl leading-8 text-zinc-600">{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-teal-50 hover:text-teal-700"
                href={`/tags/${encodeURIComponent(tag)}`}
                key={tag}
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}

        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="mt-8 aspect-[16/9] w-full rounded-lg object-cover"
            src={post.coverImage}
          />
        ) : null}

        <div className="mt-10 border-t border-zinc-200 pt-8">
          <MarkdownContent content={post.content} />
        </div>

        <nav className="mt-12 grid gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-2">
          {previousPost ? (
            <Link
              className="rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-teal-300"
              href={`/blog/${previousPost.slug}`}
            >
              <span className="text-sm text-zinc-500">上一篇</span>
              <p className="mt-2 font-semibold text-zinc-950">{previousPost.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              className="rounded-lg border border-zinc-200 bg-white p-5 text-right transition hover:border-teal-300"
              href={`/blog/${nextPost.slug}`}
            >
              <span className="text-sm text-zinc-500">下一篇</span>
              <p className="mt-2 font-semibold text-zinc-950">{nextPost.title}</p>
            </Link>
          ) : null}
        </nav>

        <section className="mt-12 border-t border-zinc-200 pt-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            评论 {post.comments.length > 0 ? `(${post.comments.length})` : ""}
          </h2>
          <div className="mt-6 grid gap-4">
            {post.comments.map((comment) => (
              <article className="rounded-lg border border-zinc-200 bg-white p-5" key={comment.id}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{comment.author}</h3>
                  <time className="text-sm text-zinc-500">
                    {comment.createdAt.toLocaleString("zh-CN")}
                  </time>
                </div>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-700">
                  {comment.content}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5">
            <CommentForm action={createCommentAction.bind(null, post.id, post.slug)} />
          </div>
        </section>
      </article>

      <aside className="hidden lg:sticky lg:top-8 lg:block">
        <TableOfContents items={toc} />
      </aside>
    </div>
  );
}

import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
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
  } catch {
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts.slice(0, 8);
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 12);

  return (
    <div className="py-12 sm:py-16">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase text-teal-700">
          Personal Notes
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          记录技术、项目和一些长期有用的想法。
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          这里会放技术文章、项目复盘和慢慢沉淀下来的笔记。内容支持 Markdown、标签、搜索、归档、RSS 和站点地图。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            href="/search"
          >
            搜索文章
          </Link>
          <Link
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
            href="/archive"
          >
            查看归档
          </Link>
        </div>
      </section>

      {tags.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">常用标签</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 ring-1 ring-zinc-200 transition hover:bg-teal-50 hover:text-teal-700 hover:ring-teal-200"
                href={`/tags/${encodeURIComponent(tag)}`}
                key={tag}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
            <p className="mt-2 text-sm text-zinc-500">
              从 PostgreSQL 读取已发布内容。
            </p>
          </div>
          <div className="flex gap-4 text-sm font-medium text-teal-700">
            <Link className="hover:text-teal-900" href="/search">
              搜索
            </Link>
            <a className="hover:text-teal-900" href="/rss.xml">
              RSS
            </a>
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-4">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-zinc-600">
            暂时没有文章。进入后台新建并发布一篇文章后，这里会自动显示。
          </div>
        )}
      </section>
    </div>
  );
}

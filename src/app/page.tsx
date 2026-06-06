import Link from "next/link";
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
          这里会放技术文章、项目复盘和一些慢慢沉淀下来的笔记。现在已经支持后台发布、标签、Markdown、RSS 和站点地图。
        </p>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
            <p className="mt-2 text-sm text-zinc-500">
              从 PostgreSQL 读取已发布内容。
            </p>
          </div>
          <a className="text-sm font-medium text-teal-700 hover:text-teal-900" href="/rss.xml">
            RSS
          </a>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <article
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                key={post.id}
              >
                <time className="text-sm text-zinc-500">
                  {post.publishedAt?.toLocaleDateString("zh-CN") ?? "未设置日期"}
                </time>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  <Link className="hover:text-teal-700" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-zinc-600">{post.excerpt}</p>
                {post.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
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
              </article>
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

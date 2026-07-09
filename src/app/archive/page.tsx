import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "文章归档",
  description: "按发布时间整理 Silas Blog 的所有文章。",
};

export default async function ArchivePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },
  });

  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const date = post.publishedAt ?? new Date();
    const key = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
    acc[key] = acc[key] ?? [];
    acc[key].push(post);
    return acc;
  }, {});

  return (
    <div className="py-12">
      <p className="text-sm font-medium uppercase text-teal-700">Archive</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">文章归档</h1>
      <p className="mt-3 text-zinc-600">按发布时间整理所有已发布文章。</p>

      <div className="mt-10 grid gap-8">
        {Object.entries(grouped).map(([month, monthPosts]) => (
          <section key={month}>
            <h2 className="border-b border-zinc-200 pb-3 text-xl font-semibold">
              {month}
            </h2>
            <div className="mt-4 grid gap-3">
              {monthPosts.map((post) => (
                <Link
                  className="group flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-white px-4 py-3 transition hover:border-teal-300"
                  href={`/blog/${post.slug}`}
                  key={post.id}
                >
                  <span className="font-medium group-hover:text-teal-700">
                    {post.title}
                  </span>
                  <time className="shrink-0 text-sm text-zinc-500">
                    {post.publishedAt?.toLocaleDateString("zh-CN") ?? "未设置日期"}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

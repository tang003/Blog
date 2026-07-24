import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { DeletePostForm } from "@/components/delete-post-form";
import { getAdminPath } from "@/lib/admin-path";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deletePostAction, logoutAction } from "./actions";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const { q, status } = await searchParams;
  const query = q?.trim() ?? "";
  const selectedStatus = status ?? "all";

  const where: Prisma.PostWhereInput = {
    ...(selectedStatus === "published" ? { published: true } : {}),
    ...(selectedStatus === "draft" ? { published: false } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      tags: true,
      published: true,
      viewCount: true,
      updatedAt: true,
      _count: { select: { comments: true } },
    },
  });

  const allCounts = await prisma.post.groupBy({
    by: ["published"],
    _count: { _all: true },
  });
  const publishedCount = allCounts.find((item) => item.published)?._count._all ?? 0;
  const draftCount = allCounts.find((item) => !item.published)?._count._all ?? 0;

  return (
    <AdminShell
      actions={
        <>
          <Link
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            href={getAdminPath("/new")}
          >
            新建文章
          </Link>
          <form action={logoutAction}>
            <button
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
              type="submit"
            >
              退出
            </button>
          </form>
        </>
      }
      description={`已发布 ${publishedCount} 篇，草稿 ${draftCount} 篇。这里负责管理内容，前台只负责展示。`}
      title="文章管理"
    >
      <form className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:grid-cols-[1fr_auto_auto]">
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={query}
          name="q"
          placeholder="搜索标题、摘要或 slug"
        />
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={selectedStatus}
          name="status"
        >
          <option value="all">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        <button
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          type="submit"
        >
          筛选
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {posts.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {posts.map((post) => (
              <div
                className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                key={post.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <span
                      className={
                        post.published
                          ? "rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                          : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
                      }
                    >
                      {post.published ? "已发布" : "草稿"}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-sm text-zinc-500">/{post.slug}</p>
                  {post.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
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
                  <p className="mt-2 text-sm text-zinc-500">
                    更新于 {post.updatedAt.toLocaleString("zh-CN")} / {post.viewCount} 次阅读 /{" "}
                    {post._count.comments} 条评论
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.published ? (
                    <Link
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                      href={`/blog/${post.slug}`}
                    >
                      前台查看
                    </Link>
                  ) : null}
                  <Link
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                    href={getAdminPath(`/${post.id}/edit`)}
                  >
                    编辑
                  </Link>
                  <DeletePostForm action={deletePostAction.bind(null, post.id)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-zinc-600">没有匹配的文章。</div>
        )}
      </div>
    </AdminShell>
  );
}

import Link from "next/link";
import { deletePostAction, logoutAction } from "./actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      tags: true,
      published: true,
      updatedAt: true,
    },
  });

  return (
    <div className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-teal-700">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">文章管理</h1>
        </div>
        <div className="flex gap-3">
          <Link
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            href="/admin/new"
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
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-zinc-200 bg-white">
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
                  <p className="mt-1 text-sm text-zinc-500">
                    更新于 {post.updatedAt.toLocaleString("zh-CN")}
                  </p>
                </div>
                <div className="flex gap-3">
                  {post.published ? (
                    <Link
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                      href={`/blog/${post.slug}`}
                    >
                      查看
                    </Link>
                  ) : null}
                  <Link
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                    href={`/admin/${post.id}/edit`}
                  >
                    编辑
                  </Link>
                  <form action={deletePostAction.bind(null, post.id)}>
                    <button
                      className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                      type="submit"
                    >
                      删除
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-zinc-600">
            还没有文章。先新建一篇，把发布流程跑起来。
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { DeletePostForm } from "@/components/delete-post-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCommentAction, toggleCommentApprovalAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  await requireAdmin();

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  return (
    <div className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-teal-700">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">评论管理</h1>
          <p className="mt-3 text-zinc-600">共 {comments.length} 条评论。</p>
        </div>
        <Link
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
          href="/admin"
        >
          返回文章管理
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {comments.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {comments.map((comment) => (
              <article className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]" key={comment.id}>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold">{comment.author}</h2>
                    <span
                      className={
                        comment.approved
                          ? "rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                          : "rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
                      }
                    >
                      {comment.approved ? "显示中" : "已隐藏"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    来自{" "}
                    <Link className="font-medium text-teal-700" href={`/blog/${comment.post.slug}`}>
                      {comment.post.title}
                    </Link>{" "}
                    · {comment.createdAt.toLocaleString("zh-CN")}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-700">
                    {comment.content}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-3">
                  <form
                    action={toggleCommentApprovalAction.bind(
                      null,
                      comment.id,
                      comment.approved,
                    )}
                  >
                    <button
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                      type="submit"
                    >
                      {comment.approved ? "隐藏" : "显示"}
                    </button>
                  </form>
                  <DeletePostForm
                    action={deleteCommentAction.bind(null, comment.id)}
                    confirmMessage="确定要删除这条评论吗？这个操作不能撤销。"
                    label="删除"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-zinc-600">还没有评论。</div>
        )}
      </div>
    </div>
  );
}

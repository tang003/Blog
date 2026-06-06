import { notFound } from "next/navigation";
import { deletePostAction, updatePostAction } from "../../actions";
import { PostForm } from "@/components/post-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  await requireAdmin();
  const { id } = await params;
  const { error, saved } = await searchParams;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-teal-700">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">编辑文章</h1>
        </div>
        <form action={deletePostAction.bind(null, post.id)}>
          <button
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            type="submit"
          >
            删除文章
          </button>
        </form>
      </div>

      {saved ? (
        <p className="mt-6 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
          已保存。
        </p>
      ) : null}
      {error === "slug" ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          这个 slug 已经存在，请换一个。
        </p>
      ) : null}

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
        <PostForm
          action={updatePostAction.bind(null, post.id)}
          post={post}
          submitLabel="保存修改"
        />
      </div>
    </div>
  );
}

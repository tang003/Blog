import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { DeletePostForm } from "@/components/delete-post-form";
import { PostForm } from "@/components/post-form";
import { getAdminPath } from "@/lib/admin-path";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deletePostAction, updatePostAction } from "../../actions";

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
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      tags: true,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <AdminShell
      actions={
        <>
          {post.published ? (
            <Link
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
              href={`/blog/${post.slug}`}
            >
              前台查看
            </Link>
          ) : null}
          <DeletePostForm
            action={deletePostAction.bind(null, post.id)}
            label="删除文章"
          />
        </>
      }
      description={`当前地址：/${post.slug}`}
      title="编辑文章"
    >
      {saved ? (
        <p className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
          已保存。
        </p>
      ) : null}
      {error === "slug" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          这个 slug 已经存在，请换一个。
        </p>
      ) : null}

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
        <PostForm
          action={updatePostAction.bind(null, post.id)}
          backHref={getAdminPath()}
          post={post}
          submitLabel="保存修改"
        />
      </div>
    </AdminShell>
  );
}

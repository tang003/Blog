import { PostForm } from "@/components/post-form";
import { getAdminPath } from "@/lib/admin-path";
import { requireAdmin } from "@/lib/auth";
import { createPostAction } from "../actions";

type NewPostPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl py-12">
      <p className="text-sm font-medium uppercase text-teal-700">Studio</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">新建文章</h1>
      <p className="mt-3 text-zinc-600">
        输入标题后会自动生成 slug，图片上传会自动插入 Markdown，预览区会实时渲染正文。
      </p>

      {error === "slug" ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          这个 slug 已经存在，请换一个。
        </p>
      ) : null}

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
        <PostForm action={createPostAction} backHref={getAdminPath()} submitLabel="创建文章" />
      </div>
    </div>
  );
}

import { AdminShell } from "@/components/admin-shell";
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
    <AdminShell
      description="写作、上传图片、实时预览和发布都在这里完成。保存后会进入编辑页继续调整。"
      title="新建文章"
    >
      {error === "slug" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          这个 slug 已经存在，请换一个。
        </p>
      ) : null}

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
        <PostForm
          action={createPostAction}
          backHref={getAdminPath()}
          draftKey="new-post"
          submitLabel="创建文章"
        />
      </div>
    </AdminShell>
  );
}

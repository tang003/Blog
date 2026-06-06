import type { Post } from "@prisma/client";

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  post?: Post;
  submitLabel: string;
};

export function PostForm({ action, post, submitLabel }: PostFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700">标题</span>
        <input
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={post?.title}
          name="title"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700">Slug</span>
        <input
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={post?.slug}
          name="slug"
          placeholder="my-first-post"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700">标签</span>
        <input
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={post?.tags.join(", ")}
          name="tags"
          placeholder="Next.js, Docker, Prisma"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700">摘要</span>
        <textarea
          className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={post?.excerpt}
          name="excerpt"
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-zinc-700">正文 Markdown</span>
        <textarea
          className="min-h-96 rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-7 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={post?.content}
          name="content"
          required
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-zinc-700">
        <input
          className="size-4 rounded border-zinc-300 text-teal-700"
          defaultChecked={post?.published ?? false}
          name="published"
          type="checkbox"
        />
        发布文章
      </label>

      <div className="flex items-center gap-3">
        <button
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          type="submit"
        >
          {submitLabel}
        </button>
        <a
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
          href="/admin"
        >
          返回
        </a>
      </div>
    </form>
  );
}

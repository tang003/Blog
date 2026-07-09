"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { MarkdownContent } from "@/components/markdown-content";

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  post?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    published: boolean;
  };
  submitLabel: string;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      disabled={pending}
      type="submit"
    >
      {pending ? "保存中..." : label}
    </button>
  );
}

export function PostForm({ action, post, submitLabel }: PostFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  const previewTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags],
  );

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      const result = (await response.json()) as { url: string };
      setCoverImage((current) => current || result.url);
      setContent((current) => `${current}${current ? "\n\n" : ""}![图片](${result.url})`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="grid gap-8">
      <div className="grid gap-6">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标题</span>
          <input
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="title"
            onChange={(event) => handleTitleChange(event.target.value)}
            required
            value={title}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">Slug</span>
          <input
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="slug"
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            placeholder="my-first-post"
            value={slug}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">标签</span>
          <input
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="tags"
            onChange={(event) => setTags(event.target.value)}
            placeholder="Next.js, Docker, Prisma"
            value={tags}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">封面图 URL</span>
          <input
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="coverImage"
            onChange={(event) => setCoverImage(event.target.value)}
            placeholder="/uploads/cover.webp"
            value={coverImage}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">摘要</span>
          <textarea
            className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="excerpt"
            onChange={(event) => setExcerpt(event.target.value)}
            required
            value={excerpt}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-700">正文 Markdown</span>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500">
              {uploading ? "上传中..." : "上传图片"}
              <input
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadImage(file);
                  }
                  event.currentTarget.value = "";
                }}
                type="file"
              />
            </label>
            <span className="text-sm text-zinc-500">
              上传后会自动插入 Markdown 图片链接。
            </span>
          </div>
          <textarea
            className="min-h-96 rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-7 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="content"
            onChange={(event) => setContent(event.target.value)}
            required
            value={content}
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
          <SubmitButton label={submitLabel} />
          <a
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
            href="/admin"
          >
            返回
          </a>
        </div>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-stone-50 p-5">
        <div className="mb-5 border-b border-zinc-200 pb-4">
          <h2 className="text-lg font-semibold tracking-tight">实时预览</h2>
          <p className="mt-1 text-sm text-zinc-500">
            这里会按前台文章样式渲染 Markdown。
          </p>
        </div>
        <article>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="mb-6 aspect-[16/9] w-full rounded-lg object-cover"
              src={coverImage}
            />
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight">
            {title || "未命名文章"}
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            {excerpt || "摘要会显示在这里。"}
          </p>
          {previewTags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {previewTags.map((tag) => (
                <span
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-8 border-t border-zinc-200 pt-6">
            {content ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-zinc-500">正文预览会显示在这里。</p>
            )}
          </div>
        </article>
      </section>
    </form>
  );
}

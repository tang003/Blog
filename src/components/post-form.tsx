"use client";

import { useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { MarkdownContent } from "@/components/markdown-content";

type UploadedImage = {
  name: string;
  previewUrl: string;
  url: string;
};

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  backHref: string;
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

export function PostForm({ action, backHref, post, submitLabel }: PostFormProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

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

  function insertImageMarkdown(image: UploadedImage) {
    const markdown = `![${image.name.replace(/\.[^.]+$/, "")}](${image.url})`;
    const textarea = contentRef.current;

    if (!textarea) {
      setContent((current) => `${current}${current ? "\n\n" : ""}${markdown}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
    const suffix = after && !after.startsWith("\n") ? "\n\n" : "";
    const next = `${before}${prefix}${markdown}${suffix}${after}`;
    const nextCursor = before.length + prefix.length + markdown.length;

    setContent(next);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const adminApiBase =
        process.env.NEXT_PUBLIC_ADMIN_API_PATH?.replace(/\/+$/, "") || "/studio-api";

      const response = await fetch(`${adminApiBase}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      const result = (await response.json()) as { url: string };
      const image = {
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        url: result.url,
      };

      setUploadedImages((current) => [image, ...current]);
      setCoverImage((current) => current || result.url);
      insertImageMarkdown(image);
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
              上传后会插入到当前光标位置，并在下方显示缩略图。
            </span>
          </div>
          {uploadedImages.length > 0 ? (
            <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-2">
              {uploadedImages.map((image) => (
                <div
                  className="grid grid-cols-[72px_1fr] gap-3 rounded-md bg-white p-2 ring-1 ring-zinc-200"
                  key={`${image.url}-${image.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="size-18 rounded object-cover"
                    src={image.previewUrl}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-700">{image.name}</p>
                    <p className="mt-1 truncate font-mono text-xs text-zinc-500">{image.url}</p>
                    <button
                      className="mt-2 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 transition hover:border-zinc-500"
                      onClick={() => insertImageMarkdown(image)}
                      type="button"
                    >
                      插入到正文
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <textarea
            className="min-h-96 rounded-md border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-7 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            name="content"
            onChange={(event) => setContent(event.target.value)}
            ref={contentRef}
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
            href={backHref}
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

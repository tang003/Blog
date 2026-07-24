"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { MarkdownContent } from "@/components/markdown-content";
import { MarkdownEditor, type MarkdownEditorHandle } from "@/components/markdown-editor";

type UploadedImage = {
  name: string;
  previewUrl: string;
  url: string;
};

type DraftPayload = {
  content: string;
  coverImage: string;
  excerpt: string;
  savedAt: string;
  slug: string;
  tags: string;
  title: string;
};

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  backHref: string;
  draftKey?: string;
  post?: {
    id?: string;
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

function formatDraftTime(value: string) {
  return new Date(value).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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

export function PostForm({
  action,
  backHref,
  draftKey = "new",
  post,
  submitLabel,
}: PostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const editorRef = useRef<MarkdownEditorHandle>(null);
  const storageKey = `silas-blog:draft:${draftKey}`;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [draftRestored, setDraftRestored] = useState(false);
  const [lastDraftSave, setLastDraftSave] = useState("");
  const [uploadError, setUploadError] = useState("");
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

  const isDirty =
    title !== (post?.title ?? "") ||
    slug !== (post?.slug ?? "") ||
    excerpt !== (post?.excerpt ?? "") ||
    coverImage !== (post?.coverImage ?? "") ||
    tags !== (post?.tags.join(", ") ?? "") ||
    content !== (post?.content ?? "");

  useEffect(() => {
    const rawDraft = window.localStorage.getItem(storageKey);

    if (!rawDraft) {
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as Partial<DraftPayload>;
      const hasDifferentContent =
        draft.title !== title ||
        draft.slug !== slug ||
        draft.excerpt !== excerpt ||
        draft.coverImage !== coverImage ||
        draft.tags !== tags ||
        draft.content !== content;

      if (hasDifferentContent && window.confirm("检测到本地自动保存的草稿，要恢复吗？")) {
        window.setTimeout(() => {
          setTitle(draft.title ?? "");
          setSlug(draft.slug ?? "");
          setExcerpt(draft.excerpt ?? "");
          setCoverImage(draft.coverImage ?? "");
          setTags(draft.tags ?? "");
          setContent(draft.content ?? "");
          setDraftRestored(true);
        }, 0);
      }

      if (draft.savedAt) {
        window.setTimeout(() => setLastDraftSave(draft.savedAt ?? ""), 0);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    // Run once on mount. The initial state is intentionally captured here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const savedAt = new Date().toISOString();
    const draft: DraftPayload = {
      content,
      coverImage,
      excerpt,
      savedAt,
      slug,
      tags,
      title,
    };
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setLastDraftSave(savedAt);
    }, 800);

    return () => window.clearTimeout(timer);
  }, [content, coverImage, excerpt, isDirty, slug, storageKey, tags, title]);

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    function submitOnShortcut(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "s") {
        return;
      }

      event.preventDefault();
      formRef.current?.requestSubmit();
    }

    window.addEventListener("keydown", submitOnShortcut);
    return () => window.removeEventListener("keydown", submitOnShortcut);
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function insertMarkdown(markdown: string, options: { block?: boolean } = {}) {
    const text = options.block ? `\n\n${markdown}\n\n` : markdown;
    const next = `${content}${text}`;

    if (editorRef.current) {
      setContent(next);
      editorRef.current.setMarkdown(next);
      editorRef.current.focus();
      return;
    }

    setContent(next);
  }

  function insertLink() {
    const text = window.prompt("链接文字", "链接文字");
    if (!text) return;

    const url = window.prompt("链接地址", "https://");
    if (!url) return;

    insertMarkdown(`[${text}](${url})`);
  }

  function insertCodeBlock() {
    const language = window.prompt("代码语言，例如 js、ts、bash", "ts") ?? "";
    insertMarkdown(`\`\`\`${language.trim()}\n// 在这里写代码\n\`\`\``, { block: true });
  }

  function insertTable() {
    insertMarkdown("| 列 1 | 列 2 |\n| --- | --- |\n| 内容 | 内容 |", { block: true });
  }

  function insertCallout() {
    insertMarkdown("> [!NOTE]\n> 在这里写提示内容。", { block: true });
  }

  function rememberUploadedImage(file: File, url: string) {
    const image = {
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      url,
    };

    setUploadedImages((current) => [image, ...current]);
    setCoverImage((current) => current || url);

    return image;
  }

  function insertImageMarkdown(image: UploadedImage) {
    insertMarkdown(`![${image.name.replace(/\.[^.]+$/, "")}](${image.url})`, { block: true });
  }

  async function uploadImage(file: File) {
    setUploadError("");
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
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "图片上传失败，请稍后重试。");
      }

      const result = (await response.json()) as { url: string };
      return rememberUploadedImage(file, result.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "图片上传失败，请稍后重试。";
      setUploadError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
    }
  }

  async function uploadImages(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        const image = await uploadImage(file);
        insertImageMarkdown(image);
      }
    }
  }

  function clearLocalDraft() {
    window.localStorage.removeItem(storageKey);
    setLastDraftSave("");
    setDraftRestored(false);
  }

  return (
    <form action={action} className="grid gap-8" ref={formRef}>
      <div className="sticky top-0 z-10 -mx-6 border-b border-zinc-200 bg-white/95 px-6 py-3 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-500">
            {isDirty ? "有未保存修改" : "内容已保存"}
            {lastDraftSave ? ` / 本地草稿 ${formatDraftTime(lastDraftSave)}` : null}
            {draftRestored ? " / 已恢复草稿" : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {lastDraftSave ? (
              <button
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                onClick={clearLocalDraft}
                type="button"
              >
                清除本地草稿
              </button>
            ) : null}
            <SubmitButton label={submitLabel} />
            <a
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
              href={backHref}
            >
              返回
            </a>
          </div>
        </div>
      </div>

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

        <div className="grid gap-6 md:grid-cols-2">
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
        </div>

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

        <section className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-zinc-700">正文</span>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                onClick={insertLink}
                type="button"
              >
                插入链接
              </button>
              <button
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                onClick={insertCodeBlock}
                type="button"
              >
                代码块
              </button>
              <button
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                onClick={insertTable}
                type="button"
              >
                表格
              </button>
              <button
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                onClick={insertCallout}
                type="button"
              >
                提示块
              </button>
              <label className="inline-flex cursor-pointer items-center rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500">
                {uploading ? "上传中..." : "上传图片"}
                <input
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  data-testid="post-image-upload"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void uploadImage(file).then(insertImageMarkdown).catch(() => undefined);
                    }
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
              </label>
            </div>
          </div>
          {uploadError ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {uploadError}
            </p>
          ) : null}
          <input name="content" type="hidden" value={content} />
          <div
            className="rounded-lg border border-zinc-300 bg-white p-2"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void uploadImages(event.dataTransfer.files).catch(() => undefined);
            }}
            onPaste={(event) => {
              const images = Array.from(event.clipboardData.files).filter((file) =>
                file.type.startsWith("image/"),
              );
              if (images.length > 0) {
                event.preventDefault();
                void uploadImages(images).catch(() => undefined);
              }
            }}
          >
            <MarkdownEditor
              onChange={setContent}
              onImageUpload={async (file) => {
                const image = await uploadImage(file);
                return image.url;
              }}
              ref={editorRef}
              value={content}
            />
          </div>
          <p className="text-sm text-zinc-500">
            支持工具栏排版、链接、表格、代码块、拖拽图片、粘贴截图和 Ctrl+S 保存。本地草稿会自动保存到当前浏览器。
          </p>
          {uploadedImages.length > 0 ? (
            <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-2">
              {uploadedImages.map((image) => (
                <div
                  className="grid grid-cols-[72px_1fr] gap-3 rounded-md bg-white p-2 ring-1 ring-zinc-200"
                  key={`${image.url}-${image.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="size-18 rounded object-cover" src={image.previewUrl} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-700">{image.name}</p>
                    <p className="mt-1 truncate font-mono text-xs text-zinc-500">{image.url}</p>
                    <button
                      className="mt-2 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 transition hover:border-zinc-500"
                      onClick={() => insertImageMarkdown(image)}
                      type="button"
                    >
                      再插入一次
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <label className="flex items-center gap-3 text-sm text-zinc-700">
          <input
            className="size-4 rounded border-zinc-300 text-teal-700"
            defaultChecked={post?.published ?? false}
            name="published"
            type="checkbox"
          />
          发布文章
        </label>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-stone-50 p-5">
        <div className="mb-5 border-b border-zinc-200 pb-4">
          <h2 className="text-lg font-semibold tracking-tight">文章效果预览</h2>
          <p className="mt-1 text-sm text-zinc-500">
            这里会按前台文章样式渲染标题、摘要、标签和正文，方便发布前做最后检查。
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
          <h1 className="text-3xl font-semibold tracking-tight">{title || "未命名文章"}</h1>
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

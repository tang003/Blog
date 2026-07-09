import Link from "next/link";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    publishedAt: Date | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md">
      <time className="text-sm text-zinc-500">
        {post.publishedAt?.toLocaleDateString("zh-CN") ?? "未设置日期"}
      </time>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">
        <Link className="hover:text-teal-700" href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-2xl leading-7 text-zinc-600">{post.excerpt}</p>
      {post.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-teal-50 hover:text-teal-700"
              href={`/tags/${encodeURIComponent(tag)}`}
              key={tag}
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}

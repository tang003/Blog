import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { searchPosts } from "@/lib/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "搜索文章",
  description: "搜索 Silas Blog 中的文章、标签和正文内容。",
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const posts = query ? await searchPosts(query) : [];

  return (
    <div className="py-12">
      <p className="text-sm font-medium uppercase text-teal-700">Search</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">搜索文章</h1>
      <p className="mt-3 text-zinc-600">按标题、摘要、正文和标签查找内容。</p>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row" role="search">
        <input
          className="min-h-11 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={query}
          name="q"
          placeholder="例如 Docker、Next.js、PostgreSQL"
        />
        <button
          className="rounded-md bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          type="submit"
        >
          搜索
        </button>
      </form>

      <section className="mt-10">
        {query ? (
          <p className="mb-5 text-sm text-zinc-500">
            找到 {posts.length} 篇和 &quot;{query}&quot; 相关的文章。
          </p>
        ) : (
          <p className="text-zinc-600">输入关键词后开始搜索。</p>
        )}

        {posts.length > 0 ? (
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

import Link from "next/link";
import { searchAiDocuments } from "@/lib/ai-search";

export const dynamic = "force-dynamic";

type AskPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AskPage({ searchParams }: AskPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchAiDocuments(query) : [];

  return (
    <div className="py-12">
      <p className="text-sm font-medium uppercase text-teal-700">AI Search</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">问我的博客</h1>
      <p className="mt-3 max-w-2xl leading-7 text-zinc-600">
        先从文章索引中检索相关片段。后续接入 embedding 和大模型后，可以在这里生成自然语言回答。
      </p>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row" role="search">
        <input
          className="min-h-11 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          defaultValue={query}
          name="q"
          placeholder="例如：为什么选择 PostgreSQL？"
        />
        <button
          className="rounded-md bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          type="submit"
        >
          检索
        </button>
      </form>

      <div className="mt-10 grid gap-4">
        {query && results.length === 0 ? (
          <p className="text-zinc-600">暂时没有找到相关片段。可以先运行 npm run ai:index 重建索引。</p>
        ) : null}

        {results.map((item) => (
          <article className="rounded-lg border border-zinc-200 bg-white p-5" key={item.id}>
            <Link
              className="font-semibold text-zinc-950 transition hover:text-teal-700"
              href={`/blog/${item.post.slug}`}
            >
              {item.post.title}
            </Link>
            <p className="mt-3 line-clamp-4 leading-7 text-zinc-600">{item.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

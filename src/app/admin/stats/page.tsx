import Link from "next/link";
import { getAdminPath } from "@/lib/admin-path";
import { getAdminStats } from "@/lib/analytics";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  await requireAdmin();
  const stats = await getAdminStats();

  return (
    <div className="py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-teal-700">Analytics</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">访问统计</h1>
        </div>
        <Link className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500" href={getAdminPath()}>
          返回文章管理
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">总访问</p>
          <p className="mt-2 text-3xl font-semibold">{stats.totalViews}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">今日访问</p>
          <p className="mt-2 text-3xl font-semibold">{stats.todayViews}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">热门文章</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          {stats.popularPosts.length > 0 ? (
            stats.popularPosts.map((post) => (
              <Link className="flex items-center justify-between gap-4 border-b border-zinc-200 p-4 last:border-b-0 hover:bg-zinc-50" href={`/blog/${post.slug}`} key={post.id}>
                <span className="font-medium">{post.title}</span>
                <span className="text-sm text-zinc-500">{post.viewCount} 次</span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-zinc-600">暂无访问数据。</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">最近每日访问</h2>
        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          {stats.recentViews.length > 0 ? (
            stats.recentViews.map((item) => (
              <div className="flex items-center justify-between gap-4 border-b border-zinc-200 p-4 last:border-b-0" key={item.id}>
                <span>
                  {item.date.toLocaleDateString("zh-CN")} / {item.post.title}
                </span>
                <span className="text-sm text-zinc-500">{item.count} 次</span>
              </div>
            ))
          ) : (
            <p className="p-4 text-zinc-600">暂无每日访问记录。</p>
          )}
        </div>
      </section>
    </div>
  );
}

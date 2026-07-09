import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Silas Blog 和这个个人博客项目。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-12 sm:py-16">
      <p className="text-sm font-medium uppercase text-teal-700">About</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">关于这个博客</h1>
      <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-700">
        <p>
          这是一个用于记录技术实践、项目复盘和长期想法的个人博客。它不是展示模板，
          而是一个可以持续写作、管理、部署和备份的内容系统。
        </p>
        <p>
          当前版本使用 Next.js、React、PostgreSQL、Prisma 和 Docker 构建，支持后台发布、
          Markdown 编辑、封面图、标签、搜索、归档、评论、RSS、sitemap 和代码高亮。
        </p>
        <p>
          第一版的重点是把写作、浏览、管理和部署链路打通。后续可以继续接入统计、
          全文检索或 AI 检索，让内容沉淀更容易被重新发现。
        </p>
      </div>
    </div>
  );
}

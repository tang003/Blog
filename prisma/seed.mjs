import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "第一篇博客：把个人站先跑起来",
    slug: "first-post",
    excerpt: "先完成一个能部署、能读取数据库、能展示文章的个人博客第一版。",
    tags: ["Next.js", "Docker", "Prisma"],
    content: `## 先把主线跑通

个人博客的第一版不需要一开始就很复杂。真正重要的是先把写作、展示、管理和部署的主线连起来。

### 当前已经具备的能力

- Next.js 负责页面、后台和服务端渲染
- PostgreSQL 保存文章、评论和统计数据
- Prisma 管理模型、迁移和种子数据
- Docker Compose 负责本地和服务器部署
- Markdown 编辑器支持实时预览、封面图、代码高亮和图片上传
- 公开页面支持标签、搜索、归档、RSS、sitemap 和评论
- 运维部分已经准备了备份、恢复和 Caddy 反向代理配置

## 一个最小部署命令

\`\`\`bash
docker compose up -d --build
\`\`\`

这条命令会启动数据库、执行迁移，并运行博客应用。`,
    published: true,
    publishedAt: new Date("2026-06-06T08:00:00.000Z"),
  },
  {
    title: "技术栈选择记录",
    slug: "tech-stack-notes",
    excerpt: "为什么第一版选择 Next.js、PostgreSQL、Prisma 和 Docker。",
    tags: ["Architecture", "PostgreSQL"],
    content: `## 为什么选这套组合

这套组合的好处是边界清晰，也方便长期维护。个人博客不用过度设计，但底层能力要稳定。

### Next.js

Next.js 本身就是 React 框架，可以同时处理前端页面和服务端能力。对博客来说，它能很好地承担文章页、后台页面、RSS 和 sitemap。

### PostgreSQL

PostgreSQL 稳定可靠，适合长期保存文章、标签、评论和统计数据。未来如果要做全文搜索，也可以先从 PostgreSQL 自带能力开始。

### Prisma

Prisma 的 schema 和 migration 对个人项目很友好，数据模型一眼能看懂，迭代也不容易乱。

### Docker

Docker Compose 让应用和数据库在服务器上用同一套配置启动。

\`\`\`txt
Next.js + PostgreSQL + Prisma + Docker
\`\`\`

这套方案不花哨，但适合把博客长期养下去。`,
    published: true,
    publishedAt: new Date("2026-06-06T09:00:00.000Z"),
  },
];

for (const post of posts) {
  await prisma.post.upsert({
    where: { slug: post.slug },
    update: post,
    create: post,
  });
}

await prisma.$disconnect();

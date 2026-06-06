import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "第一篇博客：把个人站先跑起来",
    slug: "first-post",
    excerpt: "先完成一个能部署、能读取数据库、能展示文章的最小版本。",
    tags: ["Next.js", "Docker", "Prisma"],
    content: `## 先把主线跑通

个人博客的第一版不需要一开始就很复杂。

这次先把主线打通：Next.js 负责页面和服务端能力，PostgreSQL 存文章数据，Prisma 管理模型和迁移，Docker 负责部署。

后续可以继续增加：

- 后台编辑
- 登录
- 评论
- 搜索
- RSS 和站点地图`,
    published: true,
    publishedAt: new Date("2026-06-06T08:00:00.000Z"),
  },
  {
    title: "技术栈选择记录",
    slug: "tech-stack-notes",
    excerpt: "为什么第一版选择 Next.js、PostgreSQL、Prisma 和 Docker。",
    tags: ["Architecture", "PostgreSQL"],
    content: `## 为什么选这个组合

这个组合的好处是边界清楚，也方便长期维护。

Next.js 本身就是 React 框架，可以同时处理前端页面和后端接口。PostgreSQL 稳定可靠，Prisma 的 schema 和迁移体验适合个人项目快速迭代。

Docker Compose 则让应用和数据库在服务器上用同一套配置启动。

\`\`\`txt
Next.js + PostgreSQL + Prisma + Docker
\`\`\``,
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

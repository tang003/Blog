# Silas Blog

Personal blog starter built with Next.js, React, PostgreSQL, Prisma, and Docker.

## Local Development

1. Copy the environment file:

```bash
cp .env.example .env
```

Default local admin password:

```txt
silas-admin
```

Change `ADMIN_PASSWORD` and `ADMIN_SECRET` before putting the site on a public server.
Set `SITE_URL` to your public domain so RSS and sitemap URLs are correct.

2. Start PostgreSQL:

```bash
docker compose up -d db
```

3. Apply migrations and seed posts:

```bash
npm run db:deploy
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Docker Deployment

```bash
docker compose up --build -d
```

The app runs on http://localhost:3001. The `migrate` service applies pending Prisma migrations before the app starts.

Seed demo posts in Docker:

```bash
docker compose --profile seed run --rm seed
```

Admin dashboard:

```txt
http://localhost:3001/admin
```

Feed and sitemap:

```txt
http://localhost:3001/rss.xml
http://localhost:3001/sitemap.xml
```

## Useful Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run lint
npm run build
```

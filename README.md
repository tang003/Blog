# Silas Blog

Personal blog built with Next.js, React, PostgreSQL, Prisma, and Docker.

## Engineering Docs

- [Engineering Docs](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [Development Guide](./docs/development.md)
- [Operations Guide](./docs/operations.md)
- [Testing And Quality](./docs/testing.md)
- [Roadmap](./docs/roadmap.md)

## Features

- Blog home, post detail, tags, archive, search, about page
- Admin login, post list, create, edit, publish/draft, delete
- Markdown editor with live preview, automatic slug generation, image upload, and code highlighting
- Article table of contents, code copy button, previous/next navigation, comments, moderation, and view count
- RSS, sitemap, robots.txt, Docker deployment, Caddy reverse proxy, and database backup scripts
- Vitest unit tests and GitHub Actions CI for lint, test, build, and audit
- Login and comment rate limiting, comment blocklist, access statistics, JSON-LD SEO, and AI document indexing
- Security headers, dynamic Open Graph image, web app manifest, health checks, and status endpoint

## Local Development

1. Copy the environment file:

```bash
cp .env.example .env
```

Default local admin password:

```txt
silas-admin
```

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

The app runs on http://localhost:3001.

Seed demo posts in Docker:

```bash
docker compose --profile seed run --rm seed
```

Run with Caddy reverse proxy:

```bash
docker compose --profile proxy up --build -d
```

Use `ops/.env.production.example` as the production environment template.

## Public Pages

```txt
http://localhost:3001
http://localhost:3001/search
http://localhost:3001/ask
http://localhost:3001/archive
http://localhost:3001/about
http://localhost:3001/tags/Next.js
http://localhost:3001/rss.xml
http://localhost:3001/sitemap.xml
http://localhost:3001/robots.txt
http://localhost:3001/api/health
http://localhost:3001/api/ready
http://localhost:3001/api/status
http://localhost:3001/opengraph-image
```

Private studio:

```txt
http://localhost:3001/tang
```

## Backup And Restore

Windows PowerShell:

```powershell
npm run backup
npm run restore -- ./backups/blog-YYYYMMDD-HHMMSS.sql
powershell -ExecutionPolicy Bypass -File ./ops/backup-retention.ps1
```

Linux/macOS shell:

```bash
sh ./ops/backup.sh
sh ./ops/restore.sh ./backups/blog-YYYYMMDD-HHMMSS.sql
sh ./ops/backup-retention.sh
```

## Second Version Enhancements

- `ADMIN_USERS` supports comma-separated admin credentials, for example `admin:password,editor:password`.
- `COMMENT_MODERATION=true` holds new comments for review.
- `COMMENT_BLOCKLIST` marks comments containing listed words as pending review.
- `COMMENT_WEBHOOK_URL` can receive a JSON notification when a new comment arrives.
- `ADMIN_PATH` and `ADMIN_API_PATH` hide the editing studio behind private paths. The default dashboard is `/tang`, while direct `/admin` and `/api/admin` requests return 404.
- `/tang/stats` shows total views, today's views, popular posts, and recent daily views.
- `/ask` searches the AI document index. Run `npm run ai:index` after publishing or updating posts.
- `STORAGE_DRIVER=local` is the current upload mode. `UPLOAD_PUBLIC_BASE_URL` can point uploaded images at a CDN.
- `STORAGE_DRIVER=s3` enables S3/R2-compatible uploads with `S3_ENDPOINT`, `S3_BUCKET`, credentials, and `UPLOAD_PUBLIC_BASE_URL`.
- `.github/workflows/deploy.yml` is a manual SSH deployment template with pre-deploy backup and readiness checks.
- `next.config.ts` adds baseline security headers for all responses and `X-Robots-Tag` for admin pages.

## Production Checklist

- Change `ADMIN_PASSWORD`
- Configure `ADMIN_USERS`
- Change `ADMIN_SECRET`
- Change `ADMIN_PATH` and `ADMIN_API_PATH` if you want a private, non-default editing URL
- Change `POSTGRES_PASSWORD`
- Set `SITE_URL` to the public HTTPS domain
- Set `SITE_DOMAIN` for Caddy
- Set `COMMENT_MODERATION=true` if comments should require review before display
- Keep PostgreSQL private; do not expose port `5432` publicly
- Run regular database backups
- Schedule `ops/backup-retention.*` after backups and keep a remote copy
- Keep the `uploads_data` Docker volume backed up if you use local image uploads

## Useful Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run lint
npm test
npm run e2e
npm run build
npm audit --audit-level=moderate
npm run ai:index
docker compose ps
docker compose logs app
```

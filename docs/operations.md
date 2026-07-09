# Operations Guide

## Deployment Model

Docker Compose services:

- `app`: Next.js standalone app.
- `migrate`: one-shot Prisma migration runner.
- `seed`: optional seed job under profile `seed`.
- `ai-index`: optional AI document index job under profile `ai`.
- `db`: PostgreSQL.
- `caddy`: optional reverse proxy under profile `proxy`.

Start production-like stack:

```bash
docker compose up -d --build
```

Run Caddy:

```bash
docker compose --profile proxy up -d --build
```

Rebuild AI index:

```bash
docker compose --profile ai run --rm ai-index
```

## Environment Variables

Core:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma/PostgreSQL connection string |
| `SITE_URL` | Public canonical site URL |
| `SITE_DOMAIN` | Caddy domain |
| `POSTGRES_USER` | PostgreSQL user |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | PostgreSQL database |

Admin:

| Variable | Purpose |
| --- | --- |
| `ADMIN_USERS` | Comma-separated `username:password` credentials |
| `ADMIN_PASSWORD` | Legacy/default local password fallback |
| `ADMIN_SECRET` | HMAC signing secret for admin cookie |

Comments:

| Variable | Purpose |
| --- | --- |
| `COMMENT_MODERATION` | Hold comments pending review when `true` |
| `COMMENT_BLOCKLIST` | Comma-separated words that force review |
| `COMMENT_WEBHOOK_URL` | Optional JSON webhook for new comments |

Uploads:

| Variable | Purpose |
| --- | --- |
| `STORAGE_DRIVER` | `local` or `s3` |
| `UPLOAD_PUBLIC_BASE_URL` | CDN/public base URL for uploads |
| `S3_ENDPOINT` | S3/R2 endpoint |
| `S3_BUCKET` | Bucket name |
| `S3_REGION` | Region, defaults to `auto` |
| `S3_FORCE_PATH_STYLE` | Enable path-style addressing |
| `S3_ACCESS_KEY_ID` | S3/R2 access key |
| `S3_SECRET_ACCESS_KEY` | S3/R2 secret key |

## Health And Status

| Endpoint | Purpose |
| --- | --- |
| `/api/health` | Lightweight liveness check |
| `/api/ready` | Readiness check with database query |
| `/api/status` | Operational counters for posts, comments, page views |

Docker app healthcheck uses `/api/ready`.

## Backup And Restore

Windows:

```powershell
npm run backup
npm run restore -- ./backups/blog-YYYYMMDD-HHMMSS.sql
powershell -ExecutionPolicy Bypass -File ./ops/backup-retention.ps1
```

Linux/macOS:

```bash
sh ./ops/backup.sh
sh ./ops/restore.sh ./backups/blog-YYYYMMDD-HHMMSS.sql
sh ./ops/backup-retention.sh
```

Recommended production practice:

- Run backup before each deploy.
- Run daily scheduled backups.
- Apply backup retention.
- Copy backups to remote object storage.
- Periodically test restore on a disposable database.

## Deploy Workflow

`.github/workflows/deploy.yml` is a manual SSH deployment template. It:

1. SSHes into the server.
2. Runs backup and retention when database is running.
3. Pulls latest code.
4. Runs `docker compose up -d --build`.
5. Rebuilds AI index when possible.
6. Polls `/api/ready`.
7. Prints `docker compose ps`.

Required GitHub secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH`

## Production Checklist

- Set strong `ADMIN_USERS`.
- Set long random `ADMIN_SECRET`.
- Set strong `POSTGRES_PASSWORD`.
- Set `SITE_URL` to HTTPS public domain.
- Set `SITE_DOMAIN` for Caddy.
- Decide `STORAGE_DRIVER`.
- If using local uploads, back up `uploads_data`.
- If using S3/R2, test upload and public URL before launch.
- Enable `COMMENT_MODERATION=true`.
- Configure backup schedule and retention.
- Confirm `/api/ready` is healthy after deploy.


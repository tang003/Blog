# System Development Plan

## Purpose

This document defines how Silas Blog should evolve as a small but serious engineering project. It is not only a feature list. It describes module ownership, development sequence, quality gates, and how future changes should be planned.

## Product Shape

Silas Blog should be treated as a personal content platform with these areas:

| Area | Goal |
| --- | --- |
| Public site | Fast, readable, SEO-friendly blog and archive |
| Studio | Private authoring and operations workspace |
| Content engine | Markdown rendering, search, tags, RSS, sitemap |
| Media system | Image upload, storage, validation, future gallery |
| Interaction | Comments, moderation, notifications |
| Analytics | Page views and content performance |
| AI retrieval | Article index, retrieval, future answer generation |
| Operations | Docker, deployment, backups, health checks, CI |

## Architecture Principles

- Keep public reading fast and simple.
- Keep private studio routes behind authentication.
- Keep database writes in server actions or route handlers.
- Keep reusable logic in `src/lib/*`.
- Keep UI components focused and replaceable.
- Keep operational scripts repeatable.
- Prefer incremental migrations over large rewrites.

## Current Baseline

The project already has:

- Next.js App Router.
- PostgreSQL and Prisma.
- Docker Compose.
- Hidden admin path with session login.
- Markdown editor and renderer.
- Image upload.
- Comments and moderation.
- Search, archive, RSS, sitemap.
- Analytics.
- AI retrieval index.
- CI, build, audit, E2E tests.
- Engineering docs.

## Target System Modules

### Public Module

Responsibilities:

- Home page.
- Blog detail page.
- Tag page.
- Search page.
- Archive page.
- About page.
- RSS, sitemap, robots.

Rules:

- Public pages should not import admin-only code.
- Public post rendering should use one canonical Markdown renderer.
- Public pages should work when there are zero posts.

### Studio Module

Responsibilities:

- Login and logout.
- Article CRUD.
- Comment moderation.
- Analytics.
- Future media library, autosave, revisions, settings.

Rules:

- All studio pages must call `requireAdmin`.
- All studio links should use `getAdminPath`.
- Public navigation must not expose the studio path.
- Studio API links should use the configured admin API path.

### Content Module

Responsibilities:

- Normalize post inputs.
- Validate slug, tags, excerpt, and content.
- Render Markdown.
- Generate headings and table of contents.
- Prepare search index and AI chunks.

Rules:

- Content validation should be shared by create and update.
- Markdown rendering behavior should be covered by tests.
- Any renderer change must verify code blocks, links, images, headings, and tables.

### Media Module

Responsibilities:

- Validate image type, size, and magic bytes.
- Store local or S3/R2 uploads.
- Return public URLs.
- Future: media library metadata and thumbnails.

Rules:

- Never trust file extension alone.
- Keep local uploads backed up if local storage is used.
- For production, prefer object storage.

### Interaction Module

Responsibilities:

- Comment form validation.
- Rate limiting.
- Moderation.
- Blocklist.
- Optional webhook.

Rules:

- Public comment submission must remain low-risk and rate-limited.
- Moderation defaults should be stricter in production.

### AI Module

Responsibilities:

- Build article chunks.
- Retrieve relevant chunks for `/ask`.
- Future: embeddings and generated answers.

Rules:

- Keep retrieval and generation separate.
- Any generated answer must cite source article chunks.
- Add rate limiting before exposing generated answers publicly.

### Operations Module

Responsibilities:

- Docker.
- Migrations.
- Seed jobs.
- Backups.
- Restore.
- CI.
- Deployment.
- Health checks.

Rules:

- Production changes require a rollback path.
- CI must run lint, tests, build, and audit.
- Backups must be tested after first production deployment.

## Development Workflow

Use this workflow for every non-trivial change:

1. Define the user problem.
2. Identify affected modules.
3. Update or create docs if behavior changes.
4. Implement the smallest useful version.
5. Add focused tests.
6. Run verification.
7. Commit with a clear message.
8. Push to GitHub.

## Quality Gates

Required before commit:

```powershell
npm run lint
npm test
npm run build
npm audit --audit-level=moderate
```

Required for UI or workflow changes:

```powershell
npm run e2e
```

Required for Docker or deployment changes:

```powershell
docker compose up -d --build
```

Then verify:

```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/ready -UseBasicParsing
```

## Release Workflow

### Local Release Candidate

1. Confirm `main` is clean.
2. Run quality gates.
3. Rebuild Docker.
4. Smoke test public site and `/tang`.
5. Push to GitHub.
6. Confirm GitHub Actions is green.

### Production Release

1. Pull latest code on server or trigger GitHub deploy workflow.
2. Run pre-deploy backup.
3. Run Prisma migrations.
4. Rebuild containers.
5. Check `/api/ready`.
6. Check public home page.
7. Check hidden studio login.
8. Keep previous backup until the release is verified.

## Documentation Rules

Update docs when changing:

- Architecture or module boundaries.
- Environment variables.
- Database schema.
- Deployment process.
- Backup and restore behavior.
- Editor workflow.
- AI/search behavior.
- Security-sensitive logic.

## Near-Term Priorities

1. Redesign editor into a real writing studio.
2. Add autosave and unsaved-change protection.
3. Add media library and drag/paste upload.
4. Deploy to a real server with domain and HTTPS.
5. Add production backup schedule.
6. Add admin audit page.
7. Expand AI retrieval into cited RAG.

## Definition Of Done

A feature is done when:

- It solves the stated user problem.
- It has a clear owner module.
- It passes required quality gates.
- It does not break public pages with empty data.
- It is documented if it changes behavior.
- It is pushed to GitHub.

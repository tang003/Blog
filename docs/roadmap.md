# Engineering Roadmap

This roadmap is biased toward engineering maturity rather than feature volume.

## Phase 1: Stabilize The Current Product

Status: mostly complete.

- Blog publishing and public reading.
- Admin CRUD and comment moderation.
- Docker deployment.
- PostgreSQL migrations.
- Backups and restore scripts.
- Unit tests, E2E tests, CI.
- Health/readiness checks.
- Basic security headers.

Recommended remaining work:

- Add a small admin audit page for login attempts and recent operational events.
- Add explicit empty states for analytics and AI search.
- Add a restore rehearsal document after the first production deployment.

## Phase 2: Production Operations

Goal: make the project safe to run continuously on a server.

- Enable real domain and HTTPS through Caddy.
- Use strong production secrets.
- Configure scheduled backups.
- Copy backups to R2/S3.
- Configure uptime monitoring against `/api/ready`.
- Configure log retention or log forwarding.
- Add deployment rollback notes.

## Phase 3: Storage And Media

Goal: remove local disk as the long-term source of truth for uploads.

- Use `STORAGE_DRIVER=s3`.
- Configure Cloudflare R2 or S3.
- Serve uploads through CDN public URL.
- Add image size/resolution metadata if needed.
- Optional: add image optimization or thumbnail generation.

## Phase 4: Search And AI

Goal: improve content discovery as article count grows.

- Keep PostgreSQL full-text search for normal search.
- Extend `AiDocument` to store real embedding vectors.
- Add an embedding generation job.
- Add an LLM answer endpoint for `/ask`.
- Show cited article chunks under generated answers.
- Add rate limiting to AI endpoints before public launch.

## Phase 5: Admin Experience

Goal: make repeated writing and maintenance smoother.

- Redesign the editor as a private writing studio. See `docs/editor-redesign.md`.
- Autosave drafts.
- Preview tokens for unpublished posts.
- Media library with drag-and-drop and paste upload.
- Code block language picker, link dialog, table insert, and callout blocks.
- Revision history and restore.
- Bulk comment moderation.
- Bulk post actions.
- Admin audit log.
- Role-based admin permissions: owner, editor, moderator.

## Phase 6: Observability

Goal: make failures diagnosable.

- Add structured logs.
- Track failed login events in admin UI.
- Track comment moderation queue size.
- Add request duration metrics if traffic grows.
- Add error boundary or error reporting integration.

## Decision Principles

- Prefer boring, understandable infrastructure.
- Keep personal-blog complexity proportional to actual use.
- Add abstractions only when a second implementation exists or is clearly imminent.
- Keep all production-changing operations scriptable and documented.
- Tests should cover logic that is easy to break and hard to notice manually.

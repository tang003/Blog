# Testing And Quality

## Test Layers

| Layer | Command | Purpose |
| --- | --- | --- |
| Unit tests | `npm test` | Fast tests for pure logic and route helpers |
| Lint | `npm run lint` | Static code quality |
| Build | `npm run build` | TypeScript, Next.js build, route validation |
| Audit | `npm audit --audit-level=moderate` | Dependency vulnerability check |
| E2E | `npm run e2e` | Browser-level workflow checks |

## Current Coverage

Unit tests cover:

- Markdown heading slug/TOC extraction.
- Comment form parsing and validation.
- Upload MIME/size/magic-byte validation.
- Storage config behavior.
- AI chunking.
- Health route.
- Manifest shape.

E2E tests cover:

- Public home page rendering.
- Article page rendering.
- Search page behavior.
- Admin route protection.
- Health endpoints.

## Adding Tests

Use unit tests when:

- Logic is in `src/lib`.
- Validation rules change.
- Data transformation changes.
- Config helpers change.

Use E2E tests when:

- A user-facing workflow changes.
- Login or admin protection changes.
- Form submission behavior changes.
- Navigation, SEO routes, or health endpoints change.

## CI

`.github/workflows/ci.yml` runs:

```bash
npm ci
npm run lint
npm test
npm run build
npm audit --audit-level=moderate
```

E2E currently runs locally because it depends on a running app and database. If the project moves to full CI E2E, add a PostgreSQL service, run migrations and seed data, start the app, then run Playwright.

## Review Checklist

Before merging a meaningful change:

- Tests pass.
- Build passes.
- Audit is clean.
- Docker build succeeds for deployment-related changes.
- Migrations are present for schema changes.
- README/docs are updated for operational or architectural changes.
- No `.env`, backups, uploads, test-results, or reports are committed.
- Public Chinese copy is not mojibake.


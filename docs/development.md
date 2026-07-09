# Development Guide

## Prerequisites

- Node.js 24 or compatible runtime.
- Docker Desktop for PostgreSQL and production-like local runs.
- npm.

## Local Setup

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

Development server:

```txt
http://localhost:3000
```

Docker app:

```bash
docker compose up -d --build
```

Docker URL:

```txt
http://localhost:3001
```

## Common Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run ai:index
npm test
npm run e2e
npm run lint
npm run build
npm audit --audit-level=moderate
docker compose ps
docker compose logs app
```

## Coding Conventions

- Use TypeScript and keep strict mode clean.
- Keep server actions small; move reusable logic into `src/lib`.
- Prefer structured validation helpers over inline form parsing.
- Add or update tests when changing helpers in `src/lib`.
- Add migrations for schema changes and never edit old migrations after they are applied.
- Keep UI copy in clean Chinese unless a label is intentionally English.
- Do not commit runtime data such as backups, uploads, `.env`, `test-results`, or Playwright reports.

## Feature Workflow

1. Identify the domain area: content, admin, comments, search, analytics, uploads, AI, or operations.
2. Update data model first if needed.
3. Generate and apply a Prisma migration.
4. Implement reusable logic in `src/lib`.
5. Wire the page, route handler, or server action.
6. Add unit tests for pure logic.
7. Add E2E coverage for user-facing workflow changes.
8. Run the verification checklist.
9. Update docs if the change affects behavior, operations, or architecture.

## Verification Checklist

```bash
npm test
npm run lint
npm run build
npm audit --audit-level=moderate
docker compose up -d --build
npm run e2e
```

For changes involving uploads:

- Test unauthenticated upload returns `401`.
- Test authenticated local upload returns `200`.
- For S3/R2, test with real object storage credentials in a non-production bucket.

For changes involving database schema:

- Run `npm run db:generate`.
- Run `npm run db:deploy` against a disposable database.
- Confirm Docker `migrate` service completes.

## Admin Defaults

Local defaults:

```txt
ADMIN_USERS=admin:silas-admin
ADMIN_SECRET=replace-with-a-long-random-secret
```

Production must override these values.


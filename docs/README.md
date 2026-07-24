# Silas Blog Engineering Docs

This directory is the engineering handbook for Silas Blog. It is meant to make future changes safer, more consistent, and easier to plan.

## Document Map

- [Architecture](./architecture.md): system shape, module boundaries, request flows, and data model.
- [Development Guide](./development.md): local setup, coding conventions, feature workflow, and common commands.
- [Operations Guide](./operations.md): Docker deployment, environment variables, backups, health checks, and release process.
- [Testing And Quality](./testing.md): unit tests, E2E tests, CI checks, and review checklist.
- [System Development Plan](./system-development-plan.md): module ownership, development sequence, quality gates, and release workflow.
- [Editor Redesign Plan](./editor-redesign.md): writing studio direction, editor capabilities, data model ideas, and milestones.
- [Post Studio Open Source Spec](./post-studio-open-source-spec.md): open-source CMS-inspired implementation plan for the create/edit article workflow.
- [Agents And Workflows](./agents-workflows.md): specialized workflow roles for planning, architecture, implementation, QA, operations, security, and docs.
- [Roadmap](./roadmap.md): engineering-oriented future direction and phased improvement plan.

## Current Project Position

Silas Blog is no longer a minimal demo. It is a production-leaning personal blog platform with:

- Next.js app router, React, PostgreSQL, Prisma, and Docker Compose.
- Admin publishing workflow, Markdown authoring, image uploads, comments, search, RSS, sitemap, and analytics.
- Security hardening, health checks, backup scripts, CI, E2E tests, and deploy workflow.
- AI document indexing and an `/ask` retrieval entry point.

The docs should be updated whenever a change affects architecture, deployment, data shape, or operational behavior.

# Editor Redesign Plan

## Problem Statement

The current editor is functional but still feels like a developer-facing Markdown form. It supports writing, upload, preview, and publishing, but the workflow is not yet close to a mature content platform such as CSDN, Juejin, or a lightweight CMS.

The main issue is not only the editor package. The writing experience depends on the whole authoring workflow:

- Create a draft quickly.
- Keep content safe while writing.
- Insert links, images, code blocks, and tables without remembering syntax.
- Preview the final article confidently.
- Manage publication state, metadata, SEO, and revision history.
- Move between admin pages and public pages without losing context.

## Product Goal

Build the admin editor into a private writing studio:

- Friendly enough for everyday writing.
- Structured enough for engineering notes and project documentation.
- Safe enough to avoid losing drafts.
- Extensible enough to support AI assistance later.

## Target Experience

The editor page should feel like this:

1. Open `/tang/new` or edit an existing post.
2. Write in a large central editor with a familiar toolbar.
3. Insert images by upload, drag-and-drop, paste, or gallery selection.
4. Insert links through a small dialog.
5. Insert code blocks with language selection.
6. See live preview and final article preview.
7. Autosave silently.
8. Publish, unpublish, or save draft from a sticky action bar.
9. Open the public preview in one click.

## Recommended Editor Direction

For the implementation-level plan inspired by open source CMS/editor projects, see `docs/post-studio-open-source-spec.md`.

### Short Term

Keep Markdown as the source format.

Reasons:

- Current database model already stores Markdown content.
- Markdown is portable and easy to back up.
- Code blocks, links, headings, images, and tables are natural in Markdown.
- It avoids committing too early to a complex rich-text JSON format.

Use `MDXEditor` as the current editor engine and keep it wrapped behind the local `MarkdownEditor` component. This keeps the authoring experience Markdown-first while avoiding a hard dependency on one package across the whole form.

### Medium Term

Evaluate one of these editor engines:

| Option | Fit | Notes |
| --- | --- | --- |
| `MDXEditor` | Strong Markdown authoring | Good toolbar model and richer Markdown editing experience. |
| `Milkdown` | Markdown-first rich editing | More flexible, more setup cost. |
| `TipTap` | Rich text CMS editor | Excellent UX, but content is usually JSON/HTML unless carefully converted. |
| `Lexical` | Custom content platform | Powerful, but more engineering work. |

Current decision: use `MDXEditor` first because the project should stay Markdown-first.

## Editor Information Architecture

The edit page should be split into predictable zones:

| Zone | Purpose |
| --- | --- |
| Header | Article title, status, save/publish actions, public preview link |
| Metadata panel | Slug, excerpt, tags, cover image, SEO fields |
| Editor canvas | Markdown or rich Markdown editing |
| Asset panel | Uploaded images, reusable assets, copy/insert actions |
| Preview panel | Final rendering using the same public Markdown renderer |
| Diagnostics | Unsaved changes, autosave state, validation errors |

Avoid making every control visible at once. Metadata and assets can live in tabs or collapsible panels.

## Core Features

### Phase A: Make Writing Safer

- Autosave drafts every 5-10 seconds after changes.
- Show save state: unsaved, saving, saved, failed.
- Warn before leaving with unsaved changes.
- Add manual save shortcut support: `Ctrl+S`.
- Add draft recovery if autosave exists but the post was not saved.

### Phase B: Make Insertion Easier

- Link dialog with text and URL fields.
- Image upload by button, drag-and-drop, and paste.
- Image gallery for previously uploaded files.
- Code block insert dialog with language selector.
- Table insert action.
- Callout insert action for notes, warnings, and tips.

### Phase C: Make Preview Trustworthy

- Reuse `MarkdownContent` rendering for final preview.
- Use the same code highlight theme in editor preview and public page.
- Validate broken local image paths before publishing.
- Validate duplicate headings if table of contents relies on heading ids.
- Add preview for unpublished posts through a signed preview token.

### Phase D: Make Publishing Professional

- Separate actions: save draft, publish, unpublish, schedule later.
- Add SEO title and SEO description fields.
- Add canonical slug validation before saving.
- Show publication checklist before publishing:
  - title exists
  - excerpt exists
  - slug exists
  - cover image optional but valid if present
  - content length is reasonable
  - images resolve

### Phase E: Make Editing Scalable

- Revision history.
- Compare revisions.
- Restore a previous version.
- Duplicate post.
- Bulk actions in article list.
- Filter by tag, status, and updated date.

## Data Model Additions

Recommended future Prisma models:

```prisma
model PostRevision {
  id        String   @id @default(cuid())
  postId    String
  title     String
  slug      String
  excerpt   String
  content   String
  tags      String[]
  createdAt DateTime @default(now())
  author    String?
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
}

model MediaAsset {
  id          String   @id @default(cuid())
  url         String   @unique
  filename    String
  mimeType    String
  size        Int
  width       Int?
  height      Int?
  storageKey  String?
  createdAt   DateTime @default(now())
}

model DraftAutosave {
  id        String   @id @default(cuid())
  postId    String?
  clientId  String
  payload   Json
  updatedAt DateTime @updatedAt
}
```

Only add these when implementing the corresponding feature. Do not migrate early without UI use.

## API Surface

Planned admin APIs:

| Endpoint | Purpose |
| --- | --- |
| `POST /studio-api/uploads` | Upload image. Existing route. |
| `GET /studio-api/media` | List uploaded media assets. |
| `POST /studio-api/drafts/autosave` | Store draft autosave payload. |
| `GET /studio-api/drafts/recover` | Recover unsaved draft. |
| `GET /studio-api/posts/:id/revisions` | List revisions. |
| `POST /studio-api/posts/:id/revisions/:revisionId/restore` | Restore revision. |
| `POST /studio-api/preview-token` | Generate signed preview link. |

All admin APIs must require the same admin session as the current upload route.

## Frontend Components

Recommended component split:

| Component | Responsibility |
| --- | --- |
| `PostEditorPage` | Page-level data and server action wiring |
| `PostEditorShell` | Layout, sticky actions, dirty state |
| `PostMetadataPanel` | Slug, excerpt, tags, cover image, SEO |
| `MarkdownEditor` | Editing engine wrapper |
| `MediaPanel` | Uploads, gallery, insert actions |
| `PublishChecklist` | Validation before publish |
| `RevisionDrawer` | Revision list and restore |
| `PreviewPane` | Final render using public Markdown renderer |

The editor engine should be wrapped behind `MarkdownEditor` so future replacement does not touch the full form.

## Implementation Milestones

1. Extract current editor into dedicated components.
2. Add dirty state, leave warning, and `Ctrl+S`.
3. Add link/code/table insert dialogs.
4. Add image drag-and-drop and paste upload.
5. Add media asset model and gallery.
6. Add autosave API and UI status.
7. Add preview token for unpublished posts.
8. Add revisions.
9. Replace the first-pass editor engine with `MDXEditor`.

## Implemented In First Pass

The first implementation pass improves the authoring workflow and now uses `MDXEditor` as the writing surface:

- Local browser autosave for new posts and existing post edits.
- Draft recovery prompt when a local draft is detected.
- Unsaved-change warning before closing or refreshing the page.
- `Ctrl+S` / `Cmd+S` submits the current form.
- Sticky save bar with dirty state and local draft timestamp.
- Quick insert actions for links, code blocks, tables, and callout blocks.
- Image upload by button, drag-and-drop, and paste.
- Uploaded image list with thumbnail and re-insert action.
- Toolbar support for headings, bold/italic/underline, lists, links, images, tables, and code blocks.

The next implementation pass should move autosave from local storage to a server-side autosave API if drafts need to move across browsers or devices.

## Acceptance Criteria

- A new post can be written without knowing Markdown syntax for common operations.
- Uploaded images are visible before publishing.
- Leaving the page cannot silently lose unsaved writing.
- Published rendering matches editor final preview.
- The editor can support future AI writing assistance without large rewrites.

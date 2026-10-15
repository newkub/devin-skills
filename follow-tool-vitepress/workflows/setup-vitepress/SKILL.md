---
name: follow-tool-vitepress-setup-vitepress
description: Install VitePress, create the docs structure and a basic `.vitepress/config.ts`
argument-hint: "[scope]"
related:
  - follow-gitignore
  - follow-lang-typescript
  - follow-tool-vite
  - run-docs
---

## Goal

Install VitePress and create the docs site so dev/build/preview work — directory structure, basic `config.ts`, package scripts — first-time setup

## Scope

Use for a project that doesn't have VitePress yet — init, `docs/` layout, basic nav/sidebar. Theme customization is in `workflows/config-theme/SKILL.md`; migration is in `workflows/migrate-from-docusaurus/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: check the state before setup

1. Check for an existing `docs/` + `.vitepress/` or `vitepress` dependency — if present → skip to verify
2. Determine single project or monorepo — for a monorepo, `docs/` is its own workspace
3. Determine the package manager from the lockfile

### 2. Create Docs Structure

> Goal: create the directory structure

1. Create `docs/` at the root with the `.vitepress/` config directory inside
2. Monorepo: create `docs/package.json` (`vitepress` dependency + `dev`/`build`/`preview` scripts) and add `docs` to `workspaces` in the root
3. Single project: put scripts in the root `package.json` as `dev:docs`/`build:docs`/`preview:docs`
4. Do `/follow-gitignore` — `docs/.gitignore` covering `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/`
5. Do `/follow-lang-typescript` — `docs/tsconfig.json` for type checking the `.vitepress/` (`noEmit: true`, `types: ["vitepress"]`)

### 3. Install And Config

> Goal: install and create the basic config

1. Install `bun add -d vitepress` in the docs workspace/root (version: see the parent skill or official docs — stable 1.x, `next` for preview)
2. Create `.vitepress/config.ts` with `defineConfig` from `vitepress`: `title`, `description`, `lang`, `themeConfig.nav`, `themeConfig.sidebar`, `markdown.deadLinks: 'ignore'`
3. Create `docs/index.md` with frontmatter `layout: home` + hero/features, or `layout: doc` as needed

### 4. Verify

> Goal: confirm dev/build work

1. Run `vitepress dev` (in `docs/`) — opening the localhost URL must show the home page
2. Run `vitepress build` — output in `.vitepress/dist/` with no unintended dead-links error
3. If it fails → do `/resolve-errors` max 3 rounds, then stop and report

## Rules

### 1. Structure

- `.vitepress/config.ts` always uses `defineConfig` — type safety
- monorepo: `docs/` is a workspace with its own `package.json`
- nav/sidebar live in `themeConfig`

### 2. Content

- frontmatter for metadata; `layout: home` for the landing page
- `deadLinks: 'ignore'` during setup — switch to strict once content is stable

### 3. Idempotent

- If `.vitepress/` already exists → verify only, never re-init

- Use /follow-gitignore if needed
- Use /follow-lang-typescript if needed
- Use /follow-tool-vite if needed
- Use /run-docs if needed

## Expected Outcome

- `docs/` + `.vitepress/config.ts` created
- `vitepress dev`/`build`/`preview` work
- Monorepo workspace setup correct (if used)

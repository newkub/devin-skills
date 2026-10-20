---
name: follow-tool-vitepress-migrate-from-docusaurus
description: Migrate a docs site from Docusaurus to VitePress — content, frontmatter, nav/sidebar
argument-hint: "[scope]"
related:
  - follow-tool-vitepress
  - update-gitignore
  - run-docs
---

## Goal

Move a documentation site from Docusaurus to VitePress safely — markdown content, frontmatter, sidebar/nav structure — with a rollback path

## Scope

Use when a project has a Docusaurus site and wants to switch to VitePress — does not cover fresh setup (see `workflows/setup-vitepress/SKILL.md`) or deep theme customization (see `workflows/config-theme/SKILL.md`)

## Execute

### 1. Plan Migration

> Goal: map from→to before starting

1. Read `docusaurus.config.ts`/`docusaurus.config.js` — record title, tagline, navbar items, footer, i18n locales, plugins used
2. Read `sidebars.ts`/`sidebars.js` — map the sidebar structure
3. Inventory content dirs: `docs/`, `blog/`, `src/pages/`, `static/` — do `/deep-analyze` or `scan-codebase` for a large site
4. Write the rollback path: keep the Docusaurus config/content until VitePress verify passes — separate branch/commit per step

### 2. Setup VitePress Skeleton

> Goal: create the VitePress structure alongside Docusaurus

1. Follow `workflows/setup-vitepress/SKILL.md` — create `docs/` + `.vitepress/` (use a temp dir name if it collides with the Docusaurus `docs/`)
2. Map `docusaurus.config` → `.vitepress/config.ts`: `title`/`tagline` → `title`/`description`, navbar → `themeConfig.nav`, footer → `themeConfig.footer` (if the theme supports it)

### 3. Migrate Content

> Goal: move the markdown content while converting frontmatter

1. Copy `docs/` markdown files → the VitePress content dir — most frontmatter keys are compatible (`title`, `description`)
2. Convert Docusaurus-specific frontmatter: `sidebar_position` → order via the `sidebar` config in `themeConfig` instead; `slug` → the file path structure; `id` → has no direct VitePress equivalent
3. Convert Docusaurus admonitions `:::note`/`:::tip`/`:::warning`/`:::danger` → VitePress custom containers (`::: info`, `::: tip`, `::: warning`, `::: danger`) — use `/use-astgrep` for a bulk transform when there are many
4. Convert MDX-specific syntax (`<Tabs>`, `<TabItem>`, `import` components) → VitePress markdown/Vue equivalents — manual review file by file
5. Move `static/` assets → the VitePress `public/` dir inside the docs dir
6. Rebuild the sidebar: Docusaurus `sidebars` → `themeConfig.sidebar` object; navbar → `themeConfig.nav`
7. Blog: VitePress has no built-in blog plugin — decide whether to migrate as pages, use a plugin/community solution, or split the blog out — ask the user if unclear

### 4. Migrate i18n (If Any)

> Goal: move the locales

1. Docusaurus `i18n/<locale>` → VitePress `locales` config + content dirs by path prefix
2. See details in `workflows/config-theme/SKILL.md` step i18n

### 5. Verify And Cutover

> Goal: confirm the new site works equivalently before deleting the old

1. Run `vitepress dev` + `vitepress build` — check every key page renders correctly with no dead links
2. Do link check with lychee or markdown-link-check on the new site
3. spot-check admonitions, code blocks, images, i18n routes
4. Once passing → remove the Docusaurus deps/config, switch the deploy workflow to the VitePress build — do `/update-references` and update docs/README
5. Do `/report-before-after` then `/ship`

## Rules

### 1. Migration Discipline

- Incremental layer by layer: config → content → assets → deploy — one commit per step so it bisects
- Never mix migration with content/feature work in one commit
- Keep the Docusaurus setup until verify passes — rollback must always be available

### 2. Content Fidelity

- admonitions/MDX components must be converted or replaced — never leave broken syntax behind
- internal links must work — a Docusaurus slug ≠ a VitePress path in general

### 3. Parity

- features VitePress lacks directly (blog, versioning, MDX plugins) → state the gap for the user to decide before starting

- Use /use-astgrep if needed
- Use link check with lychee or markdown-link-check if needed
- Use /follow-tool-vitepress if needed
- Use /update-gitignore if needed
- Use /run-docs if needed

## Expected Outcome

- The VitePress site renders content equivalent to the old Docusaurus site
- Nav/sidebar/i18n fully migrated
- `vitepress build` passes, the deploy workflow is updated, and Docusaurus is removed

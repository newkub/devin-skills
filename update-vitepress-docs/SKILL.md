---
name: update-vitepress-docs
description: Build a VitePress docs site — content from update-docs + setup from follow-tool-vitepress
argument-hint: "[scope]"
related:
  - update-docs
  - follow-tool-vitepress
  - check-should-update
  - check-monorepo
  - deep-review
  - run-docs
  - update-references
  - follow-gitignore
  - follow-lang-typescript
---

## Goal

Create/update a VitePress documentation site — markdown content from `/update-docs` (pages + templates + type detection) plus the VitePress setup from `/follow-tool-vitepress` (config, theme, plugins, scripts, deploy)

## Scope

Use when a project needs a buildable/deployable docs site — if you only want plain `docs/` markdown (read on GitHub), use `/update-docs` instead

- Composition: `/update-docs` = content and page structure, `/follow-tool-vitepress` = tooling (`vitepress`, UnoCSS, Shiki Twoslash, Group Icons, theme, CI deploy)
- This skill keeps only the nav/sidebar/homepage templates and orchestration — never duplicate the content rules of `update-docs` or the setup steps of `follow-tool-vitepress`

## Execute

### 1. Prepare

> Goal: Determine the docs type and the current state of docs/

1. Run `/check-should-update` if there are git changes
2. Run `/check-monorepo` to identify a monorepo
3. Determine the docs type (`product` / `saas-product` / `opensource-product` / `open-source` / `cli` / `library` / `sdk` / `tool` / `website` / `monorepo` / `development`) per the detection in `update-docs/references/<type>.md`
4. If `docs/` already exists → run `/deep-review` first to find gaps

### 2. Ensure Content Pages

> Goal: Have complete markdown pages before configuring the site

1. Run `/update-docs` to create/update the `docs/` structure and all content pages (index, project, getting-started, guides/examples/integrations/plugins/adapters/ecosystem for sections with real content only, development, references, roadmap, workspaces for a monorepo)
2. `docs/index.md` from `/update-docs` will be replaced by `templates/homepage.md` (`layout: home`) in Step 5

### 3. VitePress Setup

> Goal: Install vitepress and the basic scaffolding

Follow `/follow-tool-vitepress` (`follow-tool-vitepress/workflows/setup-vitepress/SKILL.md`):

1. Create the `docs/.vitepress/` config directory
2. Monorepo: `docs/package.json` is its own workspace + add `docs` to the root `workspaces`; single project: scripts in the root `package.json`
3. Run `/follow-gitignore` — `docs/.gitignore` covers `.vitepress/dist/`, `.vitepress/cache/`
4. Run `/follow-lang-typescript` — `docs/tsconfig.json` for the `.vitepress/` config
5. Install with `bun add -d vitepress` (version per `/follow-tool-vitepress` — stable 1.x, `next` for preview)

### 4. Site Config

> Goal: `docs/.vitepress/config.ts` has complete nav and sidebar per type

1. Create `config.ts` with `defineConfig` — the full structure from `references/vitepress-config.md`
2. nav from `templates/nav-config.md` — use the Base Nav + the type variation for that docs type (don't put `Project` / `Development` / `Auth` / `Review` in the nav — those sections live only in the sidebar) and include only items whose directories actually exist in `docs/`
3. sidebar from `templates/sidebar-<type>.md` — mapped from `## Page Groups` in `update-docs/references/<type>.md`; the `/development/` category shares `templates/sidebar-development.md` across all types; extensibility sections (`/guides/` `/examples/` `/integrations/` `/plugins/` `/adapters/` `/ecosystem/`) copy from `templates/sidebar-extensibility.md` for sections whose directories actually exist
4. If a monorepo → add `templates/sidebar-monorepo.md` + a dropdown nav (`items`) for workspace pages
5. Use `collapsed: true` when a category has >5 pages; use relative paths starting with `/`
6. If multi-language → `references/i18n.md`

### 5. Homepage

> Goal: `docs/index.md` is a VitePress landing page

1. Use `templates/homepage.md` — `layout: home`, hero (name/tagline from `package.json`), 3-6 real features, actions
2. A markdown TOC (from `/update-docs`) should move to the `docs/references/` index or `project/overview.md` if the site uses `layout: home` instead

### 6. Optional Enhancements

> Goal: theme, plugins, and deploy per `/follow-tool-vitepress`

1. Theme: `.vitepress/theme/index.ts` extends DefaultTheme + `style.css` CSS variables — `follow-tool-vitepress/workflows/config-theme/SKILL.md`
2. UnoCSS: `docs/uno.config.ts` + `UnoCSS()` plugin + `virtual:uno.css` — per `/follow-tool-vitepress` Step 3
3. Shiki Twoslash (`@shikijs/vitepress-twoslash`) and Group Icons (`vitepress-plugin-group-icons`) when needed
4. Vue components for interactive content (FeaturesTable, TestResults, ReleaseTimeline) — only when the project truly needs them, not by default
5. GitHub Actions deploy workflow per `/follow-tool-vitepress` Step 8

### 7. Validate

> Goal: The site builds and links aren't broken

1. Run `/run-docs` — `vitepress dev` shows the homepage, `vitepress build` passes with no dead-links error
2. Check that every sidebar/nav link has a real `.md` file
3. Run `/update-references` — internal links, README linking to the docs site

## Rules

### 1. Composition Over Duplication

- Content/frontmatter/real-data rules live in `/update-docs` — never copy them here
- install/theme/plugin/deploy steps live in `/follow-tool-vitepress` — never copy them here
- This skill keeps only the nav/sidebar/homepage/config templates and the orchestration order

### 2. Config Standards

- `config.ts` always uses `defineConfig`, `search.provider: 'local'`, `cleanUrls: true`, `lastUpdated: true`
- nav is defined only by `templates/nav-config.md`; don't redefine it in the sidebar templates
- See the official resources in `references/website.md`

### 3. Markdown First

- By default use plain markdown per `/update-docs` rules — Vue components only when necessary (interactive features)
- You may use VitePress `:::` containers when needed (site pages don't have to render on GitHub)

### 4. No Workspace Duplicates

- A monorepo has a single `docs/` at the root as the workspace — never create `docs/` in each workspace
- Workspace pages live at `docs/workspaces/<name>.md` and are linked via a dropdown nav

- Use /deep-review if needed
- Use /check-reference if needed

## Expected Outcome

- A root `docs/` with VitePress config, nav (Base Nav + type variation — no Project/Development/Auth/Review), and a sidebar complete per type (+ Commands for cli, Workspaces for a monorepo, extensibility sections per the directories that exist)
- All page content comes from `/update-docs` — complete frontmatter, real data, no placeholders
- `vitepress dev`/`build`/`preview` work, `vitepress build` has no dead-links error
- README links to the docs site

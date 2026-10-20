---
name: update-vitepress-docs
description: Build a VitePress docs site — content from update-docs + setup from follow-tool-vitepress
argument-hint: "[scope]"
related:
  - update-docs
  - follow-tool-vitepress
  - check-should-update
  - check-monorepo
  - deep-review-codebase
  - run-docs
  - update-references
  - update-gitignore
  - follow-lang-typescript
---

## Goal

Create/update a VitePress documentation site — markdown content from `/update-docs` (pages + templates + type detection) plus the VitePress setup from `/follow-tool-vitepress` (config, theme, plugins, scripts, deploy)

## Scope

Use when a project needs a buildable/deployable docs site — for plain `docs/` markdown read on GitHub, use `/update-docs` instead

- Composition: `/update-docs` = content and page structure; `/follow-tool-vitepress` = tooling (`vitepress`, UnoCSS, Shiki Twoslash, Group Icons, theme, CI deploy)
- This skill holds only the nav/sidebar/homepage/config templates (inline in `## Templates`) and the orchestration order — never duplicate `update-docs` content rules or `follow-tool-vitepress` setup steps
- Content page templates (overview, features, installation, usage, ...) live in `update-docs/templates/` (see `update-docs/templates/index.md`); per-type detection, page groups, and content focus live in `update-docs/references/<type>.md`

## Execute

### 1. Prepare

> Goal: Determine the docs type and the current state of docs/

1. Run `/check-should-update` if there are git changes; run `/check-monorepo` to detect a monorepo
2. Determine the docs type (`product` / `saas-product` / `opensource-product` / `open-source` / `cli` / `library` / `sdk` / `tool` / `website` / `monorepo` / `development`) per the detection in `update-docs/references/<type>.md`
3. If `docs/` already exists → run `/deep-review-codebase` first to find gaps

### 2. Ensure Content Pages

> Goal: Have complete markdown pages before configuring the site

1. Run `/update-docs` for the `docs/` structure and all content pages (index, project, getting-started, guides/examples/integrations/plugins/adapters/ecosystem for sections with real content only, development, references, roadmap, workspaces for a monorepo)
2. `docs/index.md` from `/update-docs` is replaced by the `layout: home` homepage (`### Template: Homepage`) in Step 5

### 3. VitePress Setup

> Goal: Install vitepress and the basic scaffolding

1. Follow `/follow-tool-vitepress` (`workflows/setup-vitepress/SKILL.md`): create `docs/.vitepress/`, then `bun add -d vitepress` (version per that skill — stable 1.x, `next` for preview)
2. Monorepo: `docs/package.json` is its own workspace + add `docs` to the root `workspaces`; single project: scripts in the root `package.json`
3. Run `/update-gitignore` — `docs/.gitignore` covers `.vitepress/dist/`, `.vitepress/cache/`
4. Run `/follow-lang-typescript` — `docs/tsconfig.json` for the `.vitepress/` config

### 4. Site Config

> Goal: docs/.vitepress/config.ts has complete nav and sidebar per type

1. Create `config.ts` with `defineConfig` per `### Template: Site Config`; nav = Base Nav (`### Template: Nav`) + the type's `Nav` cell in `### Template: Type Variations`
2. Sidebar = the shape in `### Template: Sidebar` + the type's row in `### Template: Type Variations`, with the section details from `### Template: Sidebar Sections`; only include nav/sidebar items whose directories exist in `docs/`
3. `collapsed: true` when a category has >5 pages; relative links starting with `/`; Multi-language → `### Template: I18n`

### 5. Homepage

> Goal: `docs/index.md` is a VitePress landing page

1. Use `### Template: Homepage` — `layout: home`, hero (name/tagline from `package.json`), 3-6 real features, actions
2. A markdown TOC from `/update-docs` moves to the `docs/references/` index or `project/overview.md` when the site uses `layout: home`

### 6. Optional Enhancements

> Goal: theme, plugins, and deploy per `/follow-tool-vitepress`

1. Theme: `.vitepress/theme/index.ts` extends DefaultTheme + `style.css` CSS variables (`follow-tool-vitepress/workflows/config-theme/SKILL.md`); UnoCSS: `docs/uno.config.ts` + `UnoCSS()` plugin + `virtual:uno.css` (that skill, Step 3)
2. Shiki Twoslash (`@shikijs/vitepress-twoslash`) and Group Icons (`vitepress-plugin-group-icons`) when needed
3. Vue components for interactive content (FeaturesTable, TestResults, ReleaseTimeline) only when truly needed, not by default; deploy workflow per Step 8 of `/follow-tool-vitepress`

### 7. Validate

> Goal: The site builds and links aren't broken

1. Run `/run-docs` — `vitepress dev` shows the homepage; `vitepress build` passes with no dead-links error
2. Check every nav/sidebar link has a real `.md` file, then run `/update-references` (internal links, README → docs site)

## Rules

### 1. Composition Over Duplication

- Content/frontmatter/real-data rules live in `/update-docs`; install/theme/plugin/deploy in `/follow-tool-vitepress` — never copy them here
- This skill keeps only the nav/sidebar/homepage/config templates and the orchestration order

### 2. Config Standards

- `config.ts` always uses `defineConfig`, `search.provider: 'local'` (Algolia only for large public docs), `cleanUrls: true`, `lastUpdated: true`
- `cleanUrls: true` needs host support (GitHub Pages, Cloudflare Pages, Netlify all support it); `lastUpdated: true` needs git history — off for generated-only docs
- `editLink.pattern` only when the repo is public on GitHub — skip private/local
- No Vue components or custom theme unless explicitly required (see `### 3. Markdown First`)
- Official: https://vitepress.dev , https://vitepress.dev/reference/default-theme-config , https://vitepress.dev/reference/site-config

### 3. Markdown First

- Default to plain markdown per `/update-docs`; Vue components only for genuinely interactive content
- VitePress `:::` containers are allowed — site pages don't have to render on GitHub

### 4. No Workspace Duplicates

- One root `docs/` workspace for a monorepo — never `docs/` per workspace; workspace pages live at `docs/workspaces/<name>.md` behind a dropdown nav

### 5. Nav And Sidebar Hygiene

- Include a nav/sidebar item ONLY when its page exists in `docs/` — delete the line otherwise (no dead links)
- Every directory-index link (`/xxx/`) carries `activeMatch: '/xxx/'`; max ~8 top-level nav items, extras go in a dropdown (`items`)
- Nav is defined only by `### Template: Nav` — never redefine nav inside the sidebar templates
- Each extensibility section needs `index.md` (the `Overview` link) plus ≥1 real child page, else delete it; >5 children → `collapsed: true`
- Keep sidebar sections in sync with the Base Nav via the `/update-docs` page structure; content pages follow `## Page Groups`/`## Content Focus` in `update-docs/references/<type>.md` (website → `update-docs/references/website-guide.md`; product/open-source use `update-docs/templates/content-page.md`)

### 6. Homepage And I18n

- `hero.name` is the real project name from `package.json`; `tagline` one line ≤120 chars; `features` = 3-6 real features, no placeholders
- `actions` link to real pages (installation, then features; GitHub optional and only for `open-source`/`cli` — omit for `product`)
- Default locale at `docs/` root, other languages in `docs/<lang>/` mirroring the same page tree — no divergent trees, no mixed language on one page (`/update-docs` rule), locales only when the project really ships multi-language content
- One nav source of truth (`### Template: Nav`): per locale translate `text` only and prefix links with `/<lang>/`

- Use /deep-review-codebase if needed
- Use /check-reference if needed

## Templates

### Template: Site Config

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '<Project Name>',
  description: '<one-line description>',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [], // ### Template: Nav + the type's Nav cell
    sidebar: {}, // ### Template: Sidebar + ### Template: Sidebar Sections
    search: { provider: 'local' },
    editLink: { pattern: 'https://github.com/<org>/<repo>/edit/main/docs/:path', text: 'Edit this page on GitHub' }, // public GitHub repos only
    socialLinks: [{ icon: 'github', link: 'https://github.com/<org>/<repo>' }],
    footer: { message: '<license or tagline>' },
  },
})
```

### Template: Nav

Nav excludes `Project`, `Development`, `Auth`, `Review` (sidebar-only) and covers getting-started plus the extensibility surfaces. Base Nav for every type:

```ts
nav: [
  { text: 'Getting Started', link: '/getting-started/installation' },
  { text: 'Guides', link: '/guides/', activeMatch: '/guides/' },
  { text: 'Examples', link: '/examples/', activeMatch: '/examples/' },
  { text: 'Integrations', link: '/integrations/', activeMatch: '/integrations/' },
  { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
  { text: 'Adapters', link: '/adapters/', activeMatch: '/adapters/' },
  { text: 'Ecosystem', link: '/ecosystem/', activeMatch: '/ecosystem/' },
  { text: 'Roadmap', link: '/roadmap/', activeMatch: '/roadmap/' },
]
```

### Template: Sidebar

Every type uses the same shape — one key per section, each `[{ text: '<Section>', collapsed, items: [{ text, link }] }]`; which sections exist and what they contain comes from `### Template: Type Variations` and `### Template: Sidebar Sections`.

- `/project/` (`collapsed: false`): Overview, Features, + Workspaces for a monorepo
- `/getting-started/` (`collapsed: false`) and `/references/` (`collapsed: false`): items per type
- type-only sections (`/roadmap/`, `/commands/`, `/features/`, `/operations/`, `/workspaces/`) and extensibility sections: only when the directory exists in `docs/`

### Template: Type Variations

`Nav` applies on top of the Base Nav; the other columns fill `/getting-started/`, the type-only sections, and `/references/`.

| Type | Nav add/drop | Getting Started | Other sidebar sections | `/references/` items |
|------|--------------|-----------------|------------------------|----------------------|
| `cli` | `Commands` after Getting Started | Installation, Usage | Commands, Roadmap | Overview, Contributing, License, Troubleshooting |
| `tool` | same as `cli` when it has subcommands, else plain base | Quickstart, Installation, Usage | — | Commands (CLI-shaped) *or* API (lib-shaped) — keep one; Configuration, Changelog, Glossary |
| `library` | drop `Plugins`/`Adapters` only when the package truly has none | Quickstart, Installation, Usage | — | API (required), Configuration, Comparison, Performance, Migration, Changelog, Glossary, Security |
| `sdk` | as `library` | Quickstart, Installation, Usage | — | API (required, per-method), Endpoints, Errors, Webhooks (only if the service emits), Migration, Changelog, Security |
| `open-source` | `Contributing` before Roadmap | Installation, Usage | Roadmap | Overview, Contributing, License |
| `opensource-product` | `Contributing` before Roadmap; full extensibility set | Quickstart, Installation, Usage | Roadmap | Configuration, API (if embeddable), Migration, Changelog, Security, Contributing, License, Code of Conduct |
| `product` | drop `Plugins`/`Adapters`/`Ecosystem` when not applicable, keep `Integrations` | Installation, Usage | Roadmap | Overview, Auth, Admin, Pricing |
| `website` | as `product` | Quickstart, Installation, Usage | — | Configuration, API (only if the site exposes HTTP/RPC), Changelog, FAQ, Contributing |
| `saas-product` | `API` before Roadmap (Operations stays sidebar-only) | Quickstart, Installation, Usage | Features, Operations, Roadmap | API, Auth, Billing, Security, Changelog |
| `monorepo` | nothing replaced — add `{ text: 'Workspaces', items: [...] }` | per base type | Workspaces | per base type |
| `development` | Base Nav | per base type | `/development/` is the main section | per base type |

### Template: Sidebar Sections

- `Development` (every type, sidebar-only, `collapsed: true`): Setup, Architecture, Workflows, Testing, Deployment, Troubleshooting → `/development/<page>`
- `Extensibility` (one key per `<section>` ∈ `guides`, `examples`, `integrations`, `plugins`, `adapters`, `ecosystem`; copy ONLY sections whose directory exists in `docs/`, `collapsed: false`): Overview → `/<section>/`, then one item per child page → `/<section>/<slug>`; `ecosystem` may also list Awesome List (`/ecosystem/awesome`, if a curated list exists) and Showcase (`/ecosystem/showcase`, if community examples exist)
- `Roadmap` (`collapsed: false`): Overview → `/roadmap/`
- `Commands` (`cli`, CLI-shaped `tool`; `collapsed: false`): Overview → `/commands/`, one item per command → `/commands/<name>`
- `Features` (`saas-product`): one item per product area → `/features/<area>`; `Operations` (`saas-product`, `collapsed: true`): Observability, Runbooks, Incidents, Scaling → `/operations/<page>`
- `Workspaces` (monorepo): `{ text: 'Workspaces', link: '/project/workspaces' }` appended to `/project/`, plus `/workspaces/` = Overview → `/workspaces/` and one item per workspace → `/workspaces/<name>`
- Page content: `docs/commands/<name>.md` = usage (`<cli-name> <command> [options]`), options table (flag / type / default / description), a real invocation example with expected output, exit-code table; `docs/workspaces/<name>.md` = purpose, key directories/entry points, workspace-scoped commands (e.g. `bun --filter <name> <script>`), dependencies on other workspaces or external packages

### Template: Homepage

For `docs/index.md` — VitePress `layout: home` with hero and features (3-6 entries: `- { title, details }`).

```md
---
layout: home
hero:
  name: "<Project Name>"
  text: "<Short tagline>"
  tagline: "<One-line description>"
  actions:
    - { theme: brand, text: Get Started, link: /getting-started/installation }
    - { theme: alt, text: Features, link: /project/features }
    - { theme: alt, text: GitHub, link: 'https://github.com/<owner>/<repo>' } # open-source/cli only
features:
  - { title: <Feature 1>, details: <One-line description> }
  - { title: <Feature 2>, details: <One-line description> }
  - { title: <Feature 3>, details: <One-line description> }
---
```

### Template: I18n

Only when docs need multiple languages (e.g. Thai + English); the default locale stays at `docs/` root, others under `docs/en/` (same page tree, prefixed). Add `locales` to the root config:

```ts
locales: {
  root: { label: 'Thai', lang: 'th' },
  en: { label: 'English', lang: 'en', link: '/en/', themeConfig: { nav: [
    { text: 'Getting Started', link: '/en/getting-started/installation' },
    { text: 'Guides', link: '/en/guides/', activeMatch: '/en/guides/' }, // Base Nav, /en/ prefixed
  ] } },
}
```

The root locale mirrors that nav with translated `text` and unprefixed links.

## Expected Outcome

- A root `docs/` with VitePress config, nav (Base Nav + type variation — no Project/Development/Auth/Review), and a sidebar complete per type (+ Commands for cli, Workspaces for a monorepo, extensibility sections per the directories that exist)
- All page content comes from `/update-docs` — complete frontmatter, real data, no placeholders
- `vitepress dev`/`build`/`preview` work, `vitepress build` has no dead-links error; README links to the docs site

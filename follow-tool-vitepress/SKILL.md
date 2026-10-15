---
name: follow-tool-vitepress
description: Set up VitePress with UnoCSS, Shiki Twoslash, Group Icons, and Vue components for project docs
argument-hint: "[scope]"
related:
  - follow-gitignore
  - follow-lang-typescript
  - follow-lib-unocss
  - follow-tool-vite
  - follow-create-plugins
  - update-vitepress-docs
  - run-docs
---

## Goal

Set up VitePress for a documentation site with UnoCSS, Shiki Twoslash, Group Icons, and Vue components for project docs that pull real data via Bun shell

## Scope

Use for every project that wants a VitePress documentation site — boundary: for a whole docs site (content + site) use `/update-vitepress-docs`; for plain `docs/` markdown use `/update-docs`; for slides use `/follow-create-slide-slidev`; for an app/web site use `/follow-tool-vite`

- Latest stable: `vitepress@1.6.4` (verified 2026-09-13); `vitepress@next` = `2.0.0-alpha.20` (preview for Vite 8/rolldown)

## Execute

### Workflows

| Topic | Workflow |-------|----------| Init, `config.ts` nav/sidebar, docs structure | `workflows/setup-vitepress/SKILL.md` | Theme config, `.vitepress/theme/`, i18n | `workflows/config-theme/SKILL.md` | Docusaurus → VitePress content/frontmatter migration | `workflows/migrate-from-docusaurus/SKILL.md` 
### 1. Project Initialization

> Goal: create the docs structure with workspace config

1. Create the `docs/` directory at the project root
2. For a monorepo, make `docs/` a workspace by creating `docs/package.json` with `vitepress` as a dependency and its own scripts
3. Add `docs` to `workspaces` in the root `package.json`
4. Create the `.vitepress/` config directory inside `docs/`
5. Do `/follow-gitignore` to create `docs/.gitignore` for VitePress build output and cache
6. Do `/follow-lang-typescript` to create `docs/tsconfig.json` for type checking the `.vitepress/` config

### 2. VitePress Configuration

> Goal: create `.vitepress/config.ts` with full nav/sidebar

Create `.vitepress/config.ts`:

```typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Docs',
  description: 'Documentation site',
  lang: 'en-US',
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Docs', link: '/docs/' },
      { text: 'API Reference', link: '/api/' },
    ],
    sidebar: {
      '/docs/': [{ text: 'Getting Started', link: '/docs/getting-started' }]
    }
  },
  markdown: { deadLinks: 'ignore' }
})
```

For a monorepo, add nav for workspace pages, using dropdown nav (`items`) to group workspaces by category

### 3. UnoCSS Integration

> Goal: integrate UnoCSS into the VitePress theme
1. Do `/follow-lib-unocss` for full UnoCSS configuration
2. Install `unocss` in the `docs/` workspace:
   ```bash
   bun add -d unocss
   ```
3. Create `docs/uno.config.ts` with `presetWind4`, `presetIcons`, transformers:
   ```typescript
   import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

   export default defineConfig({
     presets: [
       presetWind4(),
       presetIcons({
         collections: {
           mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
         },
       }),
     ],
     transformers: [
       transformerVariantGroup(),
       transformerDirectives(),
     ],
   })
   ```
4. Add the `UnoCSS()` plugin to `vite.plugins` in `.vitepress/config.ts`
5. Add `import 'virtual:uno.css'` in `.vitepress/theme/index.ts`
6. See an integration example at https://vp.yuy1n.io/

### 4. Theme Setup

> Goal: create `.vitepress/theme/index.ts`

```typescript
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // register global components
  }
}
```

Create `.vitepress/theme/style.css`:

```css
:root {
  --vp-c-brand: #3b82f6;
}
```

### 5. Package Scripts

> Goal: add dev/build/preview scripts

For a monorepo, put the scripts in `docs/package.json`:

```json
{
  "name": "@project/docs",
  "private": true,
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "latest"
  }
}
```

For a single project, put the scripts in the root `package.json` as `dev:docs`, `build:docs`, `preview:docs`

### 6. Shiki Twoslash Integration

> Goal: enable type-hover code blocks
1. Install `@shikijs/vitepress-twoslash`
2. Add `transformerTwoslash` to the markdown config
3. Add the plugin to the theme
4. Import the CSS for twoslash styling

### 7. VitePress Plugin Group Icons

> Goal: add group icons for code/file trees
1. Install `vitepress-plugin-group-icons`
2. Add the plugin to the VitePress config

### 8. GitHub Actions Deployment

> Goal: deploy docs via CI
1. Create `.github/workflows/deploy.yml`
2. Set up deployment to GitHub Pages
3. Set triggers for push and pull request

### 9. Project Docs With Vue Components

> Goal: create 4-section project docs with Vue components and Bun shell data

1. Set up 4 nav sections in `.vitepress/config.ts`: Project, Features, Review, Release
2. Create `.vitepress/scripts/data/` for Bun shell data scripts:
   - `project.ts` — pull project info with `Bun.$` (`package.json`, workspaces, tech stack)
   - `features.ts` — pull features from source code (route files, modules)
   - `test-results.ts` — pull test results from vitest output
   - `releases.ts` — pull git tags, GitHub releases, commit history with `Bun.$`
3. Create Vue components in `.vitepress/theme/components/`:
   - Project: `ProjectOverview.vue`, `ProjectArchitecture.vue`, `WorkspaceCards.vue`
   - Features: `FeaturesTable.vue` — interactive table with sorting, filtering, search
   - Review: `TestResults.vue`, `CodeReview.vue` with sidebar layout
   - Release: `ReleaseTimeline.vue`, `ChangelogViewer.vue`, `CommitHistory.vue`
4. Register the components in `.vitepress/theme/index.ts`
5. Use UnoCSS utilities for card layout, table styling, timeline, progress bars, badges

## Rules

### 1. Configuration Standards

- Use `defineConfig` from `vitepress` for type safety
- Set `lang: 'en-US'` or per project requirement
- Use `deadLinks: 'ignore'` in the markdown config
- Set nav and sidebar in `themeConfig`
- For a monorepo, make `docs/` a workspace with its own `docs/package.json` and add `docs` to the root `workspaces`
- For a monorepo, the nav links to workspace pages in `docs/workspaces/`
- Use dropdown nav (`items`) to group workspaces by category

### 2. Theme Customization

- extend DefaultTheme from `vitepress/theme`
- Use the `enhanceApp` hook to register components
- Set CSS variables in `:root`

### 3. Package Scripts

- scripts: monorepo uses `dev`/`build`/`preview` in `docs/package.json`; a single project uses `dev:docs`/`build:docs`/`preview:docs` in the root `package.json`

### 4. Plugin Integration

- Use `@shikijs/vitepress-twoslash` for type hover
- Use `vitepress-plugin-group-icons` for icons
- Add plugins to the config or theme as required

### 5. Content Standards

- Use frontmatter for metadata
- Use `layout: home` for the landing page
- Set up hero and features per the VitePress default
- Use Vue components (`.vue`) instead of plain markdown for interactive content
- Markdown pages (`.md`) are used only for frontmatter and importing Vue components
- Use `Bun.$` template literals to pull data from the real project — never hardcode
- Export data scripts as async functions callable from Vue components

### 6. Gitignore And TypeScript Config

- `docs/.gitignore` covers `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/`; `docs/tsconfig.json` extends root with `noEmit: true`, `types: ["vitepress"]`; monorepo → `exclude` `docs` in the root tsconfig

- Use /follow-tool-vite if needed
- Use /follow-create-plugins (vite) if needed (tool vitepress)
- Use /run-docs if needed

## References

- [CLI reference](references/cli.md)

- See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

- VitePress config ready to use
- UnoCSS (presetWind4) + custom theme ready to use
- Package scripts ready to use
- Shiki Twoslash + Group Icons integrated
- GitHub Actions deployment ready to use
- Home page with frontmatter per the VitePress default
- `.gitignore` covering build output/cache and `tsconfig.json` ready for the `.vitepress/` config
- 4-section project docs (Project, Features, Review, Release) with Vue components pulling real data via Bun shell

---
name: follow-tool-vitepress-config-theme
description: Configure the VitePress theme — `.vitepress/theme/`, CSS vars, i18n, nav/sidebar
argument-hint: "[scope]"
related:
  - follow-lang-typescript
  - follow-lib-unocss
  - run-docs
---

## Goal

Configure and edit the VitePress theme — `.vitepress/theme/index.ts`, CSS variables, custom components, i18n/locales, nav/sidebar — merging with the existing config

## Scope

Use when customizing the theme or adding i18n — init/structure is in `workflows/setup-vitepress/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: read the existing config before editing

1. Read `.vitepress/config.ts` and `.vitepress/theme/index.ts` (if present)
2. If there's no `.vitepress/` → do `workflows/setup-vitepress/SKILL.md` first

### 2. Theme Entry

> Goal: create/edit `.vitepress/theme/index.ts`

1. `import DefaultTheme from 'vitepress/theme'` then `export default { extends: DefaultTheme, enhanceApp({ app }) {} }`
2. Use `enhanceApp` to register global Vue components
3. Create `.vitepress/theme/style.css` — set CSS variables in `:root` such as `--vp-c-brand`
4. For a custom layout use the `Layout` slot, or create `.vitepress/theme/Layout.vue` if needed (see official docs)

### 3. Nav And Sidebar

> Goal: adjust the navigation structure in `themeConfig`

1. `nav` — top-level links; use `items` for dropdown groups (e.g. grouping workspaces by category in a monorepo)
2. `sidebar` — object form `{ '/path/': [sections] }` for per-section sidebars
3. Set `logo`, `siteTitle`, `socialLinks`, `editLink`, `lastUpdated` as needed
4. `search` — the `local` provider (built-in) or algolia options if available

### 4. i18n / Locales

> Goal: set up multi-language if needed

1. Add `locales` in `config.ts` — keys are path prefixes such as `'/th/'` with `lang`, `label`, `link`, and per-locale themeConfig overrides
2. Create the content mirror: `docs/th/index.md` etc. per locale paths
3. Set `themeConfig` per locale (nav, sidebar, labels) — see official docs for all overridable keys

### 5. Verify

> Goal: check the theme works

1. Run `vitepress dev` — verify nav/sidebar/theme render correctly for every locale
2. Run `vitepress build` — passes with no unintended dead links
3. If it breaks → revert the changed keys and report the diff with `/report-before-after`

## Rules

### 1. Theme

- Always extend `DefaultTheme` — never write a theme from scratch unless necessary
- `enhanceApp` for registering components; CSS vars in `:root`
- Vue components (`.vue`) for interactive content; `.md` pages use frontmatter + component imports

### 2. i18n

- locale keys are path prefixes matching the real directory structure
- every locale needs its content mirror at that path — missing = 404

### 3. Merge Discipline

- edit only the necessary keys in `config.ts` — never overwrite the whole file

- Use /follow-lib-unocss if needed (if using UnoCSS with the theme)
- Use /run-docs if needed
- Use /follow-lang-typescript if needed

## Expected Outcome

- `.vitepress/theme/` ready with the custom theme + CSS vars
- Nav/sidebar correct per the content structure
- i18n locales working for every enabled language
- `vitepress build` passes

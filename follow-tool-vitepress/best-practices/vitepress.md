# VitePress — Best Practices

Docs site — UnoCSS, Shiki Twoslash, Group Icons, Vue components

## Recommended Patterns

- `.vitepress/config.ts` = single config — nav, sidebar, theme config, vite options; typed via `defineConfig`
- Sidebar/nav are explicit config, not auto — the information architecture must be thought through; auto-generated = flat chaos
- Custom theme via `Layout` slots + `enhanceApp` — extend the default theme, don't fork the whole theme
- UnoCSS integration — utility styling in docs pages/custom components; `presetAttributify` optional
- Shiki Twoslash — code blocks with types on hover; for API docs that need type context
- Vue components in markdown — `<Component />` via markdown-it-vue; interactive demos in docs

## Common Pitfalls

- Dead links: VitePress build warns — fix every warning; link checker in CI (`/check-dead-link` or build --strict)
- Images: `public/` assets + absolute paths — relative paths break across nested pages
- Group Icons plugin — icon maps for nav/sidebar; keep a consistent icon set
- i18n/locales config — `locales` root + per-locale configs; don't mix langs in one file
- Build size: Twoslash + many components = slow builds — lazy components, split heavy pages

## Content Discipline

- Frontmatter only for what's needed — title/description/outline per page
- Markdown extensions: containers (`:::tip`), code groups, line highlights — use them specifically
- Search: built-in local search or Algolia — local suffices for small-medium docs
- Versioned docs = separate concerns — VitePress has no built-in versioning; consider per-version deploys

## Do / Don't

| Do | Don't |
|----|-------|
| explicit sidebar IA | auto-generated nav chaos |
| extend the default theme | fork the entire theme |
| fix dead-link warnings | accumulate link rot |
| Twoslash for API docs | twoslash on every code block |

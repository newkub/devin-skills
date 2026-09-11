---
title: VitePress Config Reference
description: Full docs/.vitepress/config.ts structure for update-docs
---

# VitePress Config Reference

Full `docs/.vitepress/config.ts` — combine nav from `templates/nav-config.md` and sidebar from `templates/sidebar-<type>.md`.

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '<Project Name>',
  description: '<one-line description>',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    // nav — from templates/nav-config.md
    nav: [],

    // sidebar — from templates/sidebar-<type>.md
    sidebar: {},

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/<org>/<repo>/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/<org>/<repo>' },
    ],

    footer: {
      message: '<license or tagline>',
    },
  },
})
```

## Rules

- `search.provider: 'local'` always — no Algolia unless project is large public docs
- `editLink.pattern` only when repo is on GitHub — skip for private/local
- `cleanUrls: true` requires host support (GitHub Pages, Cloudflare Pages, Netlify all support it)
- `lastUpdated: true` needs git history — keep on for repos, off for generated-only docs
- Do NOT add Vue components / custom theme unless explicitly required — markdown only per skill rules

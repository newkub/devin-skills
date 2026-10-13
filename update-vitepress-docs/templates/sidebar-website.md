---
title: Website Sidebar Template
description: VitePress sidebar config for web app/site documentation
---

# Website Sidebar Template

Use this config in `docs/.vitepress/config.ts` for deployable web apps and sites.
Nav is defined separately — copy the Base Nav (with website variation) from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: Base Nav from templates/nav-config.md (website variation)
    sidebar: {
      '/project/': [
        {
          text: 'Project',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/project/overview' },
            { text: 'Features', link: '/project/features' },
          ],
        },
      ],
      '/getting-started/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Quickstart', link: '/getting-started/quickstart' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Usage', link: '/getting-started/usage' },
          ],
        },
      ],
      // extensibility sections (guides, examples, integrations) —
      // copy only the sections whose directories exist from templates/sidebar-extensibility.md
      '/development/': [
        // items from templates/sidebar-development.md
      ],
      '/references/': [
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'Configuration', link: '/references/configuration' },
            { text: 'API', link: '/references/api' }, // only if the site exposes HTTP/RPC
            { text: 'Changelog', link: '/references/changelog' },
            { text: 'FAQ', link: '/references/faq' },
            { text: 'Contributing', link: '/references/contributing' },
          ],
        },
      ],
    },
  },
}
```

## Rules

- Delete any `/references/` item whose page does not exist in `docs/` — no dead links.
- Content pages follow `update-docs/references/website.md` (`## Page Groups`, `## Content Focus`).

---
title: Open Source Product Sidebar Template
description: VitePress sidebar config for open-source products with releases and community
---

# Open Source Product Sidebar Template

Use this config in `docs/.vitepress/config.ts` for OSS products (app/framework/platform with releases + community).
Nav is defined separately — copy the Base Nav (with opensource-product variation) from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: Base Nav from templates/nav-config.md (opensource-product variation)
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
      // extensibility sections — OSS products use the full set:
      // guides, examples, integrations, plugins, adapters, ecosystem
      // copy only the sections whose directories exist from templates/sidebar-extensibility.md
      '/roadmap/': [
        {
          text: 'Roadmap',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/roadmap/' },
          ],
        },
      ],
      '/development/': [
        // items from templates/sidebar-development.md
      ],
      '/references/': [
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'Configuration', link: '/references/configuration' },
            { text: 'API', link: '/references/api' }, // if embeddable
            { text: 'Migration', link: '/references/migration' },
            { text: 'Changelog', link: '/references/changelog' },
            { text: 'Security', link: '/references/security' },
            { text: 'Contributing', link: '/references/contributing' },
            { text: 'License', link: '/references/license' },
            { text: 'Code of Conduct', link: '/references/code-of-conduct' },
          ],
        },
      ],
    },
  },
}
```

## Rules

- Delete any item whose page does not exist in `docs/` — no dead links.
- Content pages follow `update-docs/references/opensource-product.md` (`## Page Groups`, `## Content Focus`).

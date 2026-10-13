---
title: Library Sidebar Template
description: VitePress sidebar config for library/package documentation
---

# Library Sidebar Template

Use this config in `docs/.vitepress/config.ts` for published libraries/packages.
Nav is defined separately — copy the Base Nav (with library variation) from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: Base Nav from templates/nav-config.md (library variation)
    sidebar: {
      '/project/': [
        {
          text: 'Project',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/project/overview' },
            { text: 'Features', link: '/project/features' },
            { text: 'Workspaces', link: '/project/workspaces' }, // monorepo only
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
      // extensibility sections (guides, examples, integrations, plugins, adapters, ecosystem) —
      // copy only the sections whose directories exist from templates/sidebar-extensibility.md
      '/development/': [
        // items from templates/sidebar-development.md
      ],
      '/references/': [
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'API', link: '/references/api' }, // required for library
            { text: 'Configuration', link: '/references/configuration' },
            { text: 'Comparison', link: '/references/comparison' },
            { text: 'Performance', link: '/references/performance' },
            { text: 'Migration', link: '/references/migration' },
            { text: 'Changelog', link: '/references/changelog' },
            { text: 'Glossary', link: '/references/glossary' },
            { text: 'Security', link: '/references/security' },
          ],
        },
      ],
    },
  },
}
```

## Rules

- Delete any `/references/` item whose page does not exist in `docs/` — no dead links.
- Content pages follow `update-docs/references/library.md` (`## Page Groups`, `## Content Focus`).

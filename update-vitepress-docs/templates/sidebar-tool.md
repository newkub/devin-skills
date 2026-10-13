---
title: Tool Sidebar Template
description: VitePress sidebar config for dev/internal tool documentation
---

# Tool Sidebar Template

Use this config in `docs/.vitepress/config.ts` for developer tools, generators, runners, and toolkits.
Nav is defined separately — copy the Base Nav (with tool variation) from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: Base Nav from templates/nav-config.md (tool variation)
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
      // extensibility sections (guides, examples, integrations, plugins) —
      // copy only the sections whose directories exist from templates/sidebar-extensibility.md
      '/development/': [
        // items from templates/sidebar-development.md
      ],
      '/references/': [
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'Commands', link: '/references/commands/' }, // if CLI-shaped
            { text: 'API', link: '/references/api' }, // if lib-shaped — keep only one
            { text: 'Configuration', link: '/references/configuration' },
            { text: 'Changelog', link: '/references/changelog' },
            { text: 'Glossary', link: '/references/glossary' },
          ],
        },
      ],
    },
  },
}
```

## Rules

- Delete any `/references/` item whose page does not exist in `docs/` — no dead links.
- Content pages follow `update-docs/references/tool.md` (`## Page Groups`, `## Content Focus`).

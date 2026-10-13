---
title: SaaS Product Sidebar Template
description: VitePress sidebar config for hosted SaaS documentation
---

# SaaS Product Sidebar Template

Use this config in `docs/.vitepress/config.ts` for hosted SaaS products (dashboard, billing, multi-tenant).
Nav is defined separately — copy the Base Nav (with saas-product variation) from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: Base Nav from templates/nav-config.md (saas-product variation)
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
      '/features/': [
        {
          text: 'Features',
          collapsed: false,
          items: [
            // one item per product area: { text: '<area>', link: '/features/<area>' }
          ],
        },
      ],
      // extensibility sections (guides, examples, integrations, ecosystem) —
      // copy only the sections whose directories exist from templates/sidebar-extensibility.md
      '/operations/': [
        {
          text: 'Operations',
          collapsed: true,
          items: [
            { text: 'Observability', link: '/operations/observability' },
            { text: 'Runbooks', link: '/operations/runbooks' },
            { text: 'Incidents', link: '/operations/incident' },
            { text: 'Scaling', link: '/operations/scaling' },
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
            { text: 'API', link: '/references/api' },
            { text: 'Auth', link: '/references/auth' },
            { text: 'Billing', link: '/references/billing' },
            { text: 'Security', link: '/references/security' },
            { text: 'Changelog', link: '/references/changelog' },
          ],
        },
      ],
    },
  },
}
```

## Rules

- Delete any item whose page does not exist in `docs/` — no dead links.
- Content pages follow `update-docs/references/saas-product.md` (`## Page Groups`, `## Content Focus`).

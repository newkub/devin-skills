---
title: Extensibility Sidebar Template
description: Shared guides/examples/integrations/plugins/adapters/ecosystem sidebar sections
---

# Extensibility Sidebar Template

Shared sidebar sections for every docs type. Copy ONLY the sections whose directory exists in `docs/` (created by `/update-docs` step 2) — a section without real pages must not appear in sidebar or nav.

```ts
'/guides/': [
  {
    text: 'Guides',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/guides/' },
      // one item per guide: { text: '<title>', link: '/guides/<slug>' }
    ],
  },
],
'/examples/': [
  {
    text: 'Examples',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/examples/' },
      // one item per example: { text: '<title>', link: '/examples/<slug>' }
    ],
  },
],
'/integrations/': [
  {
    text: 'Integrations',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/integrations/' },
      // one item per integration: { text: '<name>', link: '/integrations/<slug>' }
    ],
  },
],
'/plugins/': [
  {
    text: 'Plugins',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/plugins/' },
      // one item per plugin: { text: '<name>', link: '/plugins/<slug>' }
    ],
  },
],
'/adapters/': [
  {
    text: 'Adapters',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/adapters/' },
      // one item per adapter: { text: '<name>', link: '/adapters/<slug>' }
    ],
  },
],
'/ecosystem/': [
  {
    text: 'Ecosystem',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/ecosystem/' },
      { text: 'Awesome List', link: '/ecosystem/awesome' }, // only if curated list exists
      { text: 'Showcase', link: '/ecosystem/showcase' }, // only if community examples exist
    ],
  },
],
```

## Rules

- Every section needs an `index.md` (the `Overview` link) plus at least one real child page — otherwise delete the section.
- Sections with >5 children: set `collapsed: true`.
- These sections back the nav items in `templates/nav-config.md` (Base Nav) — keep both in sync via `/update-docs` page structure.

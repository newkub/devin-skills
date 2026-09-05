---
title: Open Source Sidebar Template
description: VitePress sidebar config for open-source documentation
---

# Open Source Sidebar Template

Use this config in `docs/.vitepress/config.ts` for open-source projects.
Nav is defined separately — copy the open-source array from `templates/nav-config.md`.

```ts
export default {
  themeConfig: {
    // nav: copy "Open Source Nav" from templates/nav-config.md
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
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Usage', link: '/getting-started/usage' },
          ],
        },
      ],
      '/roadmap/': [
        {
          text: 'Roadmap',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/roadmap/' },
            { text: 'Idea Features', link: '/roadmap/idea-features' },
          ],
        },
      ],
      '/development/': [
        {
          text: 'Development',
          collapsed: true,
          items: [
            { text: 'Setup', link: '/development/setup' },
            { text: 'Architecture', link: '/development/architecture' },
            { text: 'Workflows', link: '/development/workflows' },
            { text: 'Testing', link: '/development/testing' },
            { text: 'CI/CD', link: '/development/ci-cd' },
            { text: 'Scripts', link: '/development/scripts' },
            { text: 'Troubleshooting', link: '/development/troubleshooting' },
          ],
        },
      ],
      '/references/': [
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/references/' },
            { text: 'Contributing', link: '/references/contributing' },
            { text: 'License', link: '/references/license' },
          ],
        },
      ],
    },
  },
}
```

## Content Page Format

Each documentation page should follow the structure in `templates/content-page.md`.

---
title: Product Sidebar Template
description: VitePress sidebar config for product documentation
---

# Product Sidebar Template

Use this config in `docs/.vitepress/config.ts` for product projects with auth/admin features.

```ts
export default {
  themeConfig: {
    nav: [
      { text: 'Project', link: '/project/overview' },
      { text: 'Features', link: '/project/features' },
      { text: 'Auth', link: '/references/auth' },
      { text: 'Admin', link: '/references/admin' },
      { text: 'Review', link: '/review/' },
      { text: 'Release', link: '/release/' },
      { text: 'Development', link: '/development/setup' },
    ],
    sidebar: {
      '/project/': [
        {
          text: 'Project',
          items: [
            { text: 'Overview', link: '/project/overview' },
            { text: 'Features', link: '/project/features' },
            { text: 'Workspaces', link: '/project/workspaces' },
          ],
        },
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Usage', link: '/getting-started/usage' },
          ],
        },
      ],
      '/references/': [
        {
          text: 'References',
          items: [
            { text: 'Auth', link: '/references/auth' },
            { text: 'Admin', link: '/references/admin' },
            { text: 'Pricing', link: '/references/pricing' },
          ],
        },
      ],
      '/development/': [
        {
          text: 'Development',
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
    },
  },
}
```

## Content Page Format

Each documentation page should follow this structure:

```md
---
title: Page Title
description: One sentence summary ≤160 chars
outline: deep
---

# Page Title

Brief introduction (1-2 sentences).

## Overview

Explain what this section covers. Use real data from the codebase.

## Steps

1. Step one with concrete command or code
2. Step two with example
3. Step three with validation

## Examples

```ts
// Real example from the codebase or a working snippet
const result = await myFunction('value')
```

## Rules

- Rule one
- Rule two

## Expected Outcome

- Outcome one
- Outcome two
```

---
title: Development Sidebar Template
description: Shared development sidebar for all docs types
---

# Development Sidebar Template

Use this for the `development/` section in every docs type. It is sidebar-only — Development is not in nav (see `nav-config.md`).

```ts
{
  text: 'Development',
  collapsed: true,
  items: [
    { text: 'Setup', link: '/development/setup' },
    { text: 'Architecture', link: '/development/architecture' },
    { text: 'Workflows', link: '/development/workflows' },
    { text: 'Testing', link: '/development/testing' },
    { text: 'Deployment', link: '/development/deployment' },
    { text: 'Troubleshooting', link: '/development/troubleshooting' },
  ],
}
```

## Content Format For Each Page

```md
---
title: Setup
description: How to set up the development environment
---

# Setup

## Requirements

- Bun ≥ 1.0
- Node.js ≥ 18
- Git

## Installation

```bash
bun install
```

## Development Commands

```bash
bun run dev
bun run test
bun run lint
```

## Verification

- [ ] `bun run build` succeeds
- [ ] `bun run test` passes
- [ ] `bun run lint` has no errors
```

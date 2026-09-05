---
title: Monorepo Sidebar Additions
description: VitePress sidebar additions for monorepo workspaces
---

# Monorepo Sidebar Additions

Apply on top of `templates/sidebar-<type>.md` when `/check-monorepo` detects a monorepo.

## 1. Workspaces Item In Project Section

Add to the `/project/` items array:

```ts
{ text: 'Workspaces', link: '/project/workspaces' },
```

## 2. Workspaces Sidebar Section

Add a `/workspaces/` sidebar key — one item per workspace:

```ts
'/workspaces/': [
  {
    text: 'Workspaces',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/workspaces/' },
      // one item per workspace: { text: '<name>', link: '/workspaces/<name>' }
    ],
  },
],
```

## Workspace Page Format

Each `docs/workspaces/<name>.md` should include:

```md
---
title: <workspace-name>
description: What this workspace/package does
---

# <workspace-name>

## Purpose

What this workspace provides.

## Structure

Key directories and entry points.

## Commands

​```bash
# workspace-scoped commands, e.g. bun --filter <name> <script>
​```

## Dependencies

Other workspaces or external packages it depends on.
```

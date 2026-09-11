---
title: Workspace Page Template
description: Template for docs/workspaces/<name>.md in monorepos
---

# Workspace Page Template

```md
---
title: <Workspace Name>
description: Role and boundaries of the <name> workspace
---

# <Workspace Name>

## Purpose

<what this package/app does — from its package.json + real code>

## Location

`<path>/`

## Public API / Entry Points

| No. | Export | Kind | Description |
|-----|--------|------|-------------|
| 1 | `<name>` | <fn/component/cmd> | <what it does> |

## Dependencies

- Internal: <other workspaces it imports>
- External: <key deps>

## Commands

```bash
<workspace-scoped commands — e.g. bun run --filter <name> test>
```
```

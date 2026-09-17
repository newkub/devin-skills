---
title: Monorepo Documentation Reference
description: Reference for monorepo docs - workspaces table and workspace pages
---

# Monorepo Documentation Reference

Layered on top of the base type (product/open-source/cli/library) — a repo is a monorepo when `package.json` has `workspaces`, or `pnpm-workspace.yaml`/`turbo.json`/`moon.yml`/`Cargo.toml [workspace]` exists.

## Extra Pages

- `docs/project/workspaces.md` — auto-generated matrix from workspace manifests:

```md
| No. | Workspace | Path | Type | Description |
|-----|-----------|------|------|-------------|
| 1 | `<name>` | `<path>` | <lib/app/cli> | <from package.json description> |
```

- `docs/workspaces/<name>.md` — one page per workspace (template `workspace.md`): purpose, key exports/entrypoints, scripts, dependencies on other workspaces

## Rules

- One `docs/` at root only — never per-workspace `docs/`
- `workspaces.md` is generated from manifests — regenerate, don't hand-edit
- Workspace pages link to their `package.json`/`Cargo.toml` path

---
name: update-config-update-shared-config
description: Consolidate tool config and dependency versions duplicated across workspaces into a single shared config or catalog — one fact, one source — then have each workspace reference i...
related:
  - update-config
---

## Goal

Consolidate tool config and dependency versions duplicated across workspaces into a single shared config or catalog — one fact, one source — then have each workspace reference it back through `extends`/`catalog:`

## Scope

- Use when the same config (`tsconfig`, `eslint`, `prettier`, `vitest`, build config) is duplicated in 2+ workspaces
- Use when the same dependency version is spread across several package manifests
- For duplicated shared code (utils, types, components) across packages → use `/refactor shared` scope instead
- For env vars → use `workflows/config-env/SKILL.md` instead

## Execute

### 1. Find Duplicate Config

> Goal: See which config is genuinely duplicated and worth consolidating

1. Run `/deep-review` domain `review-config` — find configs duplicated or drifting across workspaces
2. Compare config per domain: `tsconfig*.json`, `eslint.config.*`, `prettier.config.*`, `vitest.config.*`, build configs
3. Compare dependency versions across package manifests — find version drift and duplicates
4. Keep only candidates genuinely duplicated in 2+ workspaces — never consolidate speculatively

### 2. Extract To Shared

> Goal: One canonical config that workspaces reference back

1. Create/update the root shared config per ecosystem:
   - `tsconfig.base.json` → workspaces `extends`
   - A root flat `eslint.config.js` → workspaces import/extend
   - A root `prettier.config.*` → referenced through `package.json#prettier`
   - test/build config → `defineConfig` from the shared one
2. Move duplicated dependency versions into a catalog per package manager (`pnpm-workspace.yaml` catalogs, `bun.catalogs`, or root `overrides`)
3. Replace versions in package manifests with a `catalog:` reference
4. If this work also involves shared code duplication → dispatch `/refactor shared` scope for the code part

### 3. Rewire And Verify

> Goal: Every workspace really uses the shared config and nothing breaks

1. Run `/update-references` — delete the duplicated child configs, keeping only workspace-specific overrides
2. Run the ecosystem validators: `tsc -b`, `eslint .`, `prettier --check .`, then reinstall to resolve the catalog
3. Run `/deep-review` domain `review-config` again — confirm only one canonical config remains per domain
4. If it fails → revert that batch and fix; up to 3 rounds → stop/report

## Rules

- Consolidate only genuinely duplicated config — workspace-specific options stay in the workspace
- Shared config must not depend on any workspace — it is only the foundation
- Behavior stays the same — the resolved config after extends must be equivalent (except drift you intentionally unified)
- The lockfile must be regenerated after moving deps into a catalog — commit the lockfile too

## Expected Outcome

- Each config domain has one canonical version at the root — workspaces merely extend/override
- Dependency versions live in the catalog — manifests use `catalog:` instead of repeated pins
- Validation passes for every workspace — no config drift left

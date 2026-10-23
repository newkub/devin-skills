---
name: follow-lib-tanstack-config
description: Use TanStack Config — shared ESLint, legacy Vite build, Changesets publish, package conventions
argument-hint: "[package-dir]"
related:
  - follow-lib-tanstack-ecosystem
  - follow-tool-tsdown
  - follow-tool-eslint
  - run-build
---

## Goal

Use TanStack Config — the maintenance contract behind TanStack packages: shared ESLint rules, the legacy dual-publish Vite build, the Changesets publish script, and the package/CI conventions

## Scope

For published library packages in a pnpm monorepo — not app configuration; apps keep their own bundler and linter (`/follow-tool-vite`, `/follow-tool-eslint`)

- part of TanStack ecosystem — selection/dispatch lives in `/follow-lib-tanstack-ecosystem`
- new packages should build with tsdown per the same docs — `/follow-tool-tsdown`
- References: [TanStack Config — Best Practices](best-practices/tanstack-config.md), [apis](references/apis.md)

## Execute

### 1. Confirm The Prerequisites

> Goal: the toolchain only supports one setup

1. Node.js 20.17+ and the Git CLI
2. GitHub CLI — present on GitHub Actions
3. pnpm 10+ — the only supported package manager

### 2. Install Only The Package You Need

> Goal: no umbrella package, no unused config

```bash
pnpm add -D @tanstack/eslint-config
pnpm add -D @tanstack/vite-config
pnpm add -D @tanstack/publish-config
pnpm add -D @tanstack/typedoc-config
```

- `@tanstack/config` is deprecated — it only re-exported the scoped packages, so install the one you use
- ESLint config needs ESLint v9+; the publish script is ESM-only

### 3. Apply The Package Structure

> Goal: the layout the monorepo and Nx cache expect

| Path | Rule |
|------|------|
| `package.json` | `"type": "module"`, explicit `exports`, plus legacy `main`/`module`/`types` |
| `tsconfig.json` | extends the root tsconfig, adds framework options and includes |
| `src/` | only code that ships — no tests |
| `tests/` | every test file and framework test setup |
| `tsdown.config.ts` | build config for new packages |
| `vitest.config.ts` | test config |

Cached scripts per package: `test:eslint`, `test:types`, `test:lib`, `build`, `test:build`.

### 4. Wire The Shared ESLint Config

> Goal: one rule set across every package

```js
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    // package-specific rules go after the shared set
  },
]
```

The config is framework-agnostic — add React, Solid, or Vue plugins in the package's own block rather than expecting them from the shared set.

### 5. Choose The Build Output

> Goal: emit what the exports map promises

1. New package → tsdown in `tsdown.config.ts` (the Vite page recommends it for future projects)
2. Legacy dual publish → merge `tanstackViteConfig` after your own config

```ts
import { defineConfig, mergeConfig } from 'vite'
import { tanstackViteConfig } from '@tanstack/vite-config'

const config = defineConfig({
  // framework plugins, vitest config, etc.
})

export default mergeConfig(
  config,
  tanstackViteConfig({ entry: './src/index.ts', srcDir: './src' }),
)
```

Set `"build": "vite build && publint --strict"` for the Vite path, and keep `moduleResolution: "bundler"` plus `vite.config.ts` in `tsconfig.json` includes.

### 6. Publish Through Changesets

> Goal: release intent reviewed in the PR, credentials borrowed at publish time

1. Add a changeset in the PR that changes a package
2. The release workflow runs `nx run-many` so every output exists
3. `publish()` from `@tanstack/publish-config` reads branch/tag/`GH_TOKEN` and publishes the changed packages
4. Enable npm trusted publishing per package — GitHub OIDC exchanges identity for short-lived access, so no long-lived npm token lives in the repo

### 7. Verify

> Goal: the tarball works for a consumer, not just for the repo

1. `/run-build` — every promised format and declaration exists
2. `pnpm test:build` or `publint --strict` — zero warnings
3. `npm pack --dry-run` — only intended files ship
4. `bunx @arethetypeswrong/cli --pack .` — no red rows
5. Install the tarball into a scratch project and import it from ESM and CJS
6. On failure → `/resolve-errors` max 3 rounds

### Use Cases

| Scenario | Use case |
|----------|----------|
| Set up a publishable package with the required structure and scripts | `usecases/setup-package-toolchain.md` |
| Share one ESLint rule set across a monorepo | `usecases/eslint-config-in-monorepo.md` |
| Pick and configure the build output for a package | `usecases/build-published-package.md` |
| Take a package from local build to publish-ready | `usecases/publish-ready-package.md` |
| Diagnose import/require/types resolution failures | `usecases/fix-exports-resolution.md` |
| Release with Changesets and npm trusted publishing | `usecases/release-with-changesets.md` |

## Rules

- Use only for packages being published — apps are out of scope
- Install `@tanstack/eslint-config` / `vite-config` / `publish-config` directly; `@tanstack/config` is deprecated
- pnpm is the only supported package manager; do not substitute bun or npm in these commands
- The exports map must resolve for `import`, `require`, and `types` alike
- Do not replace an existing tsdown build with the legacy Vite config — the docs point new packages at tsdown
- Verify the packed tarball, never the local build directory
- See best-practices/ for the pattern and pitfall checklist

## Expected Outcome

- A package with the expected layout, scripts, and lint rules
- A tarball whose exports and types resolve for ESM and CJS consumers
- A release path where intent is reviewed and publish credentials are short-lived

---
name: follow-tool-vite-migrate-to-vite8
description: Migrate Vite ≤7 or the rolldown-vite preview to vite@^8 — plugin compat, config rename, verify
argument-hint: "[project-path]"
related:
  - follow-tool-vite
  - follow-tool-rolldown
  - deep-impact
  - deep-review
  - report-before-after
---

## Goal

Move a Vite project to `vite@^8` (Rolldown + Oxc as the default) safely — dev, build, and plugins keep working, with a rollback path

## Scope

- Applies to projects still on Vite ≤7 or aliasing `vite` to `npm:rolldown-vite` (the technical preview for Vite 6/7)
- The `rolldown-vite` package is discontinued — Vite 8 uses Rolldown as the single bundler by default, no opt-in; never add new `npm:rolldown-vite` aliases/overrides
- Covers the package upgrade, plugin compatibility, config option renames, and output verification

## Execute

### 1. Plan And Baseline

> Goal: know the from→to and capture the baseline

1. Check the `vite` version in `package.json` and list all plugins in `vite.config.*`
2. Run `vite build` + the dev server on the current setup, saving build time and output size as the baseline
3. Read the official migration guide at `vite.dev` (`/learn` (web) if unsure) — if the project is very large and Rolldown issues must be isolated, consider `rolldown-vite` as a temporary intermediate step, then move up to Vite 8
4. Commit the current state first — the migration must be revertible

### 2. Upgrade Package

> Goal: `vite` goes straight to `^8`, no alias

1. If `package.json` has `"vite": "npm:rolldown-vite@..."` or `overrides`/`pnpm.overrides` pointing at `rolldown-vite` → remove the alias/override
2. Set `"vite": "^8.0.0"` in `devDependencies`, then reinstall (`bun install`)
3. Verify with `bunx vite --version` that it is Vite 8.x

### 3. Fix Plugin Compatibility

> Goal: every plugin works on Rolldown

1. Run `bunx vite build` — collect all plugin errors/warnings
2. Plugins using Rollup-only hooks or `transformWithEsbuild` may need updates — check the compatibility list in the official docs (`transformWithEsbuild` deprecated → `transformWithOxc`)
3. Consider native/Oxc-based plugin replacements per the official docs, plugin by plugin
4. If a critical plugin is incompatible → hold the migration or find an alternative before continuing

### 4. Translate Config Options

> Goal: switch the renamed/deprecated options

1. `build.rollupOptions` → `build.rolldownOptions` (the compat layer still supports it, but migrating is preferred)
2. `optimizeDeps.esbuildOptions` → `optimizeDeps.rolldownOptions`; top-level `esbuild.*` → `oxc.*` (both deprecated in Vite 8)
3. If a plugin uses `transformWithEsbuild`, install `esbuild` as a temporary devDependency — esbuild is no longer a direct Vite dependency
4. Check the remaining deprecated options with `/deep-review` — for options you're unsure about, see official docs, never guess

### 5. Verify

> Goal: dev + build equivalent to before

1. `bunx vite` → the dev server + HMR work
2. `bunx vite build` → passes; compare output size/file list with the baseline
3. Run the test suite + a smoke test on `vite preview`
4. If it breaks and can't be fixed in 3 rounds → pin `vite` back to the original version + reinstall (the rollback path), then report

## Rules

### 1. Safety

- Never mix the migration with feature work in one commit — one commit per step so it bisects
- The rollback path = switch `"vite"` back to the original version + reinstall — must always be ready

### 2. Compatibility

- Plugins that don't support Rolldown must be fixed before upgrading — never ignore bundler-related warnings
- Keep conditional config if several versions must run during the transition

- Use /follow-tool-vite if needed
- Use /follow-tool-rolldown if needed
- Use /deep-impact if needed
- Use /report-before-after if needed

## Expected Outcome

- The project runs directly on `vite@^8` — no leftover `rolldown-vite` alias/overrides — dev/build/tests pass as before
- The config uses `rolldownOptions`/`oxc` with no leftover deprecated options
- The build is faster or equal, with no output regression

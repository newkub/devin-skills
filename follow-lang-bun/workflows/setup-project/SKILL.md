---
name: follow-lang-bun-setup-project
description: Scaffold a new Bun project with the standard structure, scripts, and config
argument-hint: "[project-name]"
related:
  - follow-lang-bun
  - follow-default-config
  - setup-cicd
  - resolve-errors
  - use-scripts
  - deep-research
---

## Goal

Create a new Bun project with a standard structure, ready to run, test, and typecheck

## Scope

For a fresh Bun project (single package or monorepo member); live-check the current Bun version and flags via `/deep-research` before scaffolding — read `/follow-lang-bun` for the language rules

## Execute

### 1. Scaffold

> Goal: Scaffold.

1. `bun init` (interactive: blank | react | library) or `bun init -y` for defaults; `bun create <tpl>` (`bun c`) for community templates (vite, elysia, next)
2. `bun init` creates `package.json`, `tsconfig.json`, `index.ts`, `.gitignore`, `bunfig.toml` (per the template)

### 2. Directory Structure

> Goal: Directory Structure.

```text
my-app/
  src/
    index.ts        # entry point
    lib/            # modules
  tests/ or src/**/*.test.ts
  package.json
  bunfig.toml
  tsconfig.json
  bun.lock          # generated — always commit
  .env              # auto-loaded — gitignore
  .env.example      # commit this instead of .env
```

1. Single package: a flat `src/` is enough — don't over-engineer the structure
2. Monorepo: `packages/<name>/` + root `package.json` with `"workspaces": ["packages/*"]`

### 3. package.json Essentials

> Goal: package.json Essentials.

1. `"type": "module"`; `module`/`main` may point at `.ts` — Bun and bundlers understand it
2. Scripts: `dev: bun --watch src/index.ts`, `start: bun src/index.ts`, `test: bun test`, `typecheck: bun check`, `build: bun build src/index.ts --outdir dist`
3. Dev deps: `bun add -d typescript bun-types`; no `packageManager` field needed (`bun.lock` suffices); no `engines.bun` unless required

### 4. bunfig.toml Skeleton

> Goal: bunfig.toml Skeleton.

1. Keep only overrides of Bun defaults per `/follow-default-config`; typical sections:

```toml
[test]
coverage = true

[install]
# minimumReleaseAge = 259200

[build]
# sourcemap = "linked"
```

### 5. tsconfig

> Goal: tsconfig.

1. Use the bundler-style tsconfig from the Configure step of [../../SKILL.md](../../SKILL.md) (`moduleResolution: "bundler"`, `bun-types`, `noEmit`)

### 6. Verify

> Goal: Verify.

1. `bun run src/index.ts` runs TS directly; `bun test` passes (zero tests is a pass); `bun check` typechecks
2. On failure → run `/resolve-errors`

### 7. Git Hygiene

> Goal: Git Hygiene.

1. Minimum `.gitignore`: `node_modules`, `dist`, `.env`, `*.log`, `coverage`
2. Commit: `bun.lock`, `bunfig.toml`, `tsconfig.json`, `.env.example`

## Rules

- CI setup → run `/setup-cicd`; automation scripts → `/use-scripts` (see `/follow-lang-bun` for the full skill-call list)

## Expected Outcome

- New Bun project that runs, tests, and typechecks with a committed `bun.lock` and override-only config

---
name: follow-tool-turborepo-config-pipeline
description: Configure turbo.json tasks, dependsOn, inputs/outputs and package-level overrides
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-build
  - run-test
---

## Goal

Configure the task pipeline in `turbo.json` correctly — `tasks`, `dependsOn`, `inputs`, `outputs`, `env`, and package-level overrides without clobbering the existing config

## Scope

Use when editing the root or package-level `turbo.json` — does not cover install/layout (see `workflows/setup-turborepo/SKILL.md`) or remote cache (see `workflows/optimize-cache/SKILL.md`)

## Execute

### 1. Read Current Config

> Goal: Read the original config before editing

1. Read the root `turbo.json` and every existing package-level `turbo.json`
2. Check each workspace's `package.json` scripts — task names in `turbo.json` must map to real scripts
3. If no `turbo.json` is found → do `workflows/setup-turborepo/SKILL.md` first

### 2. Define Tasks

> Goal: Define `tasks` in `turbo.json`

1. Create one entry per task: `build`, `test`, `lint`, `typecheck`, `dev`
2. Set `dependsOn` per the task graph — `^build` for upstream dependencies, `build` for the same package
3. Set `outputs` for build artifacts such as `["dist/**", ".next/**", "!.next/cache/**"]`
4. Define `inputs` explicitly so the cache hash is correct (source files, excluding outputs)
5. Use `cache: false` for dev servers and tasks with side effects
6. Use `persistent: true` for long-running tasks such as `dev`

### 3. Configure Environment Variables

> Goal: Handle env vars so the cache is correct and safe

1. Use `env` for variables that affect build output (no `$` prefix) — they enter the cache hash
2. Use `passThroughEnv` for secrets that tasks need but that shouldn't enter the hash
3. Never hard-code secrets in `turbo.json` — use `/follow-secret-manager` if needed

### 4. Package-Level Overrides

> Goal: Override config for a specific package when necessary

1. Create a `turbo.json` in the package with `"extends": ["//"]` to inherit from the root
2. Use `$TURBO_EXTENDS$` in arrays to append instead of replace
3. Specify package-specific `outputs` and `dependsOn` — never duplicate the root config unnecessarily

### 5. Verify

> Goal: Check the task graph is correct

1. Run `bunx turbo run <task> --dry=json` to inspect the task graph before a real run
2. Run `bunx turbo run build` and verify the dependency order is correct
3. Re-run to confirm a cache hit — if it breaks → revert the changed keys and report the diff

## Rules

### 1. Config Discipline

- Always use `turbo.json` at the root with `$schema`
- Merge with the existing config — never overwrite the whole file unless necessary
- Define `inputs`/`outputs` explicitly — cache correctness depends on this

### 2. Task Graph

- Always use `^task` for upstream dependencies when a task needs its deps' output
- Don't create circular `dependsOn`
- Task names must match the workspaces' `package.json` scripts

### 3. Safety

- Secrets → `passThroughEnv` only; never in `env` (entering the cache hash = leak)
- Always verify with `--dry=json` before real runs

- Use /follow-monorepo if needed
- Use /run-build if needed
- Use /run-test all if needed

## Expected Outcome

- `turbo.json` has a correct task graph with `dependsOn`/`inputs`/`outputs`
- Env vars are split correctly between `env` and `passThroughEnv`
- Package-level overrides inherit from the root correctly
- `--dry=json` shows the expected graph

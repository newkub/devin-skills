---
name: follow-tool-vitest-setup-vitest
description: Install and set up Vitest with config, environment, and coverage provider
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - follow-tool-vite
  - update-tests
  - run-test
---

## Goal

Install and set up Vitest until ready — packages, `vitest.config.ts`, environment, and coverage — first-time or verify the existing setup

## Scope

- First-time Vitest setup in a single project (for monorepo projects see the parent skill)
- Covers: install, config file, test environment (`node`/`happy-dom`/`jsdom`), coverage provider, scripts
- Does not cover: migration from Jest (`workflows/migrate-from-jest`), performance tuning (`workflows/optimize tests`)

## Execute

### 1. Check Prerequisites

> Goal: check prerequisites and the current state before installing

1. Do `/follow-tool-vite` to confirm the project has a Vite setup
2. Check the Node version against the requirement of the Vitest version being installed — see official docs if unsure
3. Check `package.json` — if `vitest` is already present (idempotent check) → skip install, verify only
4. Determine the package manager from the lockfile (`bun.lock`, `pnpm-lock.yaml`, `package-lock.json`) and use it consistently

### 2. Install Packages

> Goal: install Vitest and the needed dependencies

1. Install `bun add -D vitest` (or `pnpm add -D` / `npm install -D` per the package manager)
2. Install the coverage provider `bun add -D @vitest/coverage-v8` (v8 is the default provider)
3. If tests need a DOM → install `happy-dom` (recommended, lighter) or `jsdom`
4. If the project uses `@effect/vitest` → pin `vitest` per its peer dep (see `/follow-lib-effect-ts`)

### 3. Create Config

> Goal: create the minimal necessary `vitest.config.ts`

1. Create `vitest.config.ts` at the root (or add a `test` key to the existing `vite.config.ts`)
2. Set `test.globals: true` to reduce imports, and add `"types": ["vitest/globals"]` to `tsconfig.json`
3. Set `test.environment` to `node` (default) or `happy-dom`/`jsdom` per the tests
4. Set `test.include`/`test.exclude` for test file patterns (`*.test.ts`, `*.spec.ts`)
5. Set the `coverage` block: `provider: 'v8'`, `reporter`, and an explicit `include` — Vitest 4+ reports only loaded files

### 4. Wire Scripts

> Goal: add scripts to `package.json`

1. Add `"test": "vitest run"` and `"test:watch": "vitest"` — use the `vitest` binary, not `bun test`
2. Add `"test:coverage": "vitest run --coverage"` for coverage runs

### 5. Verify

> Goal: smoke check that the setup works

1. Write one example test file and run `bun run test` — it must pass
2. Run `bun run test:coverage` — a coverage report must be produced
3. If verification fails → do `/resolve-errors` max 3 rounds, then stop and report

## Rules

- Use official docs as the primary source — for an uncertain option, read the docs before writing it into the config
- Never put unverified version numbers in docs/comments
- Pick the environment to match the real tests — don't add `happy-dom` if tests don't touch the DOM
- `coverage.include` must be explicit — never rely on defaults because Vitest 4+ reports only loaded files

- Use /follow-tool-vitest if needed
- Use /update-tests if needed
- Use /run-test if needed

## Expected Outcome

- Vitest installed with `vitest.config.ts`, scripts, and coverage verified
- The example test passes in both normal and coverage mode

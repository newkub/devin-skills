---
name: follow-tool-vitest-migrate-from-jest
description: Migrate a test suite from Jest to Vitest — globals, mock API, snapshots, verify green
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - use-astgrep
  - migration-with-astgrep
  - update-tests
  - run-test
---

## Goal

Migrate the test suite from Jest to Vitest safely — the suite fully green before removing Jest, with rollback available

## Scope

- Moving `jest` → `vitest` covering config, globals, mock APIs, timers, snapshots
- Use codemods/ast-grep instead of manual edits when there are many files
- Does not cover: first-time setup without an existing test framework (`workflows/setup-vitest`)

## Execute

### 1. Plan And Inventory

> Goal: map every affected point before editing

1. Do `/plan` — define from→to and write the rollback path (git branch or revert plan)
2. Do `scan-codebase` for jest usage: `jest.config.*`, `jest.*` API calls, `@jest/globals` imports, `setupFiles*`, `moduleNameMapper`, snapshot files
3. Read the official Vitest migration guide for breaking differences — see official docs
4. Backup: commit/snapshot the current state — the Jest suite must be green before starting

### 2. Install And Config

> Goal: install Vitest while Jest remains (both can run side by side)

1. Follow `workflows/setup-vitest` — vitest, coverage, environment
2. Set `test.globals: true` in `vitest.config.ts` — existing tests using `describe`/`it`/`expect` without imports keep working
3. Add `"types": ["vitest/globals"]` to `tsconfig.json`
4. Map `jest.config` keys → vitest equivalents: `testEnvironment` → `environment`, `setupFilesAfterEach`/`setupFiles` → `setupFiles`, `moduleNameMapper` → `resolve.alias`, `coverageProvider`/`collectCoverageFrom` → `coverage.*`
5. Add a separate vitest script: `"test:vitest": "vitest run"` — don't replace `test` until the suite is green

### 3. Migrate APIs

> Goal: convert Jest APIs to Vitest equivalents

1. Use `/use-astgrep` or `/migration-with-astgrep` for bulk renames — one commit per pattern
2. Map mock APIs: `jest.mock` → `vi.mock`, `jest.fn` → `vi.fn`, `jest.spyOn` → `vi.spyOn`, `jest.requireActual` → `vi.importActual` (async), `jest.doMock` → `vi.doMock`
3. Map timers: `jest.useFakeTimers` → `vi.useFakeTimers`, `jest.advanceTimersByTime` → `vi.advanceTimersByTime`
4. `@jest/globals` imports → `vitest` imports or the globals config
5. Beware hoisting: `vi.mock` must be top-level (Vitest 5 throws if it's inside a function/block)

### 4. Migrate Snapshots

> Goal: reuse snapshot files or regenerate them safely

1. Vitest uses the same format as Jest — most existing snapshots carry over
2. Run the suite first — if snapshots fail due to format diffs → regenerate with `vitest run -u` then review the diff
3. Never bulk-update snapshots without review — a snapshot diff can hide a behavior change

### 5. Verify Green And Cleanup

> Goal: the suite is fully green on Vitest, then remove Jest

1. Run `vitest run` — must be fully green; on failures fix group by group, never skip arbitrarily
2. Do `/deep-review` to check for remaining `jest.` usages
3. Once green: remove `jest`, `@types/jest`, `ts-jest`, `babel-jest`, `jest.config.*` in a separate commit
4. Switch `"test": "vitest run"` then run `/run-test` to confirm again
5. Done → `/report-before-after` then `/ship`

## Rules

- Never mix migration with feature work in one commit — one commit per step so it bisects
- The Jest suite must be green before migrating and the Vitest suite green before removing Jest
- `vi.mock`/`vi.hoisted` top-level only (Vitest 5)
- If some test files genuinely depend on Jest-specific behavior → make a clear TODO list instead of forcing them

- Use /follow-tool-vitest if needed
- Use /update-tests if needed

## Expected Outcome

- The test suite runs green on Vitest
- Jest dependencies and config removed in a separate commit
- No `jest.*` API left in the codebase

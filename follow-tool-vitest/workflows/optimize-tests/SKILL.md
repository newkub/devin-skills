---
name: follow-tool-vitest-optimize-tests
description: Tune Vitest test performance — isolation, pool options, sharding, watch excludes
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - run-test
  - run-bench
---

## Goal

Reduce Vitest test-suite run time — measure the baseline first, fix one point at a time by impact, then re-measure

## Scope

- Optimize test execution time: isolation, worker pool, sharding, watch mode, coverage cost
- Preserve behavior — optimize ≠ change test results
- Does not cover: first-time setup (`workflows/setup-vitest`)

## Execute

### 1. Baseline

> Goal: capture the original numbers and identify the real bottleneck

1. Run `vitest run` with timing — record total duration and per-file duration
2. Do `/deep-optimize` — determine whether the slowness comes from isolation, coverage, heavy setup, or the tests themselves
3. Use a `--reporter` that gives per-file timings and find the slowest files first — never guess

### 2. Tune Isolation And Pool

> Goal: reduce isolation and worker-pool overhead

1. Set `test.isolate: false` if tests don't share state across files — much faster but tests must be truly independent
2. Set `test.pool` — `forks` (default, stable) or `threads`; try `vmForks`/`vmThreads` only when needed
3. Set `maxWorkers`/`minWorkers` to match the CPU cores — Vitest 4+ uses top-level options, not `poolOptions`
4. Check tests relying on shared module state — if they break with isolation off, fix the test instead of immediately re-enabling isolate

### 3. Shard And Scope Runs

> Goal: split work across machines and limit the run scope

1. CI across multiple machines → `vitest run --shard=<index>/<total>` splits tests into shards
2. PR checks → `vitest related` or `--changed` runs only tests affected by changed files
3. Set `retry` in the CI config only — never as a permanent fix for flaky tests

### 4. Reduce Watch And Coverage Overhead

> Goal: cut unnecessary work in watch mode and coverage

1. Set `test.watchExclude` (the default already covers `node_modules`/`dist`) to skip more generated/build dirs — see official docs for the latest option
2. Disable coverage in watch/dev — run `--coverage` only in CI or when needed
3. Narrow `coverage.include` to source dirs only — less instrumentation time
4. Turn off `typecheck.enabled` in dev runs when unnecessary — run it as a separate script

### 5. Measure And Compare

> Goal: re-measure and compare with the baseline

1. Re-run `vitest run` after each change — compare durations with the baseline
2. Do `/report-before-after` reporting numbers before/after per optimization
3. If there's no improvement or tests start flaking → revert that point and report

## Rules

- Baseline always first — never optimize without the original numbers
- Change one point and measure separately — never change several points if results can't be separated
- `isolate: false` is risky — verify tests don't share state first
- All shards must run with the same args — only then is the aggregate result correct
- Optimization must not change test outcomes — the suite must stay fully green

- Use /follow-tool-vitest if needed
- Use /run-test if needed
- Use /run-bench if needed

## Expected Outcome

- The test suite is measurably faster than the baseline
- Config tuned: isolation, pool, sharding, watch excludes as appropriate
- Tests remain deterministic and all green

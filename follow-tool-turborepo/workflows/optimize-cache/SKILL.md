---
name: follow-tool-turborepo-optimize-cache
description: Tune Turborepo cache, remote cache, filtering and affected runs to be faster
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-build
---

## Goal

Raise the cache hit rate and cut `turbo run` time — local/remote cache tuning, task filtering, and `--affected`, measuring before and after

## Scope

Use when a Turborepo monorepo is slow or cache misses often — does not cover first-time setup or task definitions (see `workflows/setup-turborepo/SKILL.md` and `workflows/config-pipeline/SKILL.md`)

## Execute

### 1. Baseline

> Goal: capture the original numbers before optimizing

1. Run `bunx turbo run build` cold (`turbo run build --force` to bypass the cache) and time it
2. Repeat with a warm run — record the cache hit rate from the output (`FULL TURBO` / cache-missed tasks)
3. Run `bunx turbo run build --dry=json` to inspect the task graph and the hash inputs that affect the cache

### 2. Fix Cache Misses

> Goal: Reduce cache misses from imprecise config

1. Check `inputs` — if too broad (e.g. the default includes every package's lockfile) → narrow to the source globs that affect the output
2. Check `env` — frequently changing env vars (timestamps, CI run ids) enter the hash and always miss → move them to `passThroughEnv`
3. Check that every deterministic task has `cache: true` (the default)
4. One point at a time — fix one key, re-measure; never change several points at once

### 3. Remote Cache

> Goal: Set up the remote cache for the team/CI

1. Configure the remote cache with `bunx turbo link` (Vercel) or a self-hosted remote cache per the official docs
2. Use `TURBO_TOKEN` and `TURBO_TEAM` for authentication — store them as secrets via `/follow-secret-manager`, never commit
3. In CI, pass those env vars — verify with cache hits across machines/CI runs
4. Consider `cacheMaxSize`/`cacheMaxAge` if the local cache grows too large

### 4. Filtering And Affected

> Goal: Run only what's needed

1. Use `--filter=<package>` to run only a package plus its dependents (`...` suffix) or dependencies (`...` prefix)
2. Use `--affected` in CI to run only the packages changed versus the base ref
3. Use `--dry=json` to confirm the filter picks the right packages before running

### 5. Compare And Report

> Goal: Measure after the fixes against the baseline

1. Re-run the cold + warm runs — compare time and hit rate with step 1
2. If there's no improvement or a regression → revert that point and report
3. Passes → `/report-before-after` with the real numbers

## Rules

### 1. Evidence-Based

- Always baseline first — never optimize without the original numbers
- Fix one point at a time ordered high impact → low (inputs/env before micro-tuning)

### 2. Cache Correctness

- Preserve behavior — optimize ≠ change the build output
- Don't raise cache hits by cutting `inputs` that really affect the output (stale cache = bug)
- Disable `cache` for non-deterministic tasks

### 3. Secrets

- `TURBO_TOKEN`/`TURBO_TEAM` through the env/secrets manager only

- Use /deep-optimize if needed
- Use /follow-monorepo if needed
- Use /run-build if needed

## Expected Outcome

- A measurable cache hit rate improvement before/after
- The remote cache works across local and CI
- `--filter`/`--affected` in CI cuts unnecessary work

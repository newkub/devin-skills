---
name: follow-tool-stryker-mutator-optimize mutation
description: Speed up Stryker mutation testing — incremental, mutator filtering, concurrency, thresholds
argument-hint: "[scope]"
related:
  - follow-tool-stryker-mutator
  - run-test
  - setup-cicd
---

## Goal

Reduce the time and scope of Stryker mutation runs — incremental mode, filtered mutators, concurrency, thresholds — while keeping meaningful signal

## Scope

- Optimizing a Stryker that is already set up (setup → `workflows/setup-stryker`)
- Covers: incremental mode, `mutator`/`mutate` filtering, `concurrency`, `thresholds`, CI strategy
- Does not cover: adding tests for surviving mutants (run `/update-tests`)

## Execute

### 1. Baseline

> Goal: Capture the existing numbers before tuning

1. Run `bunx stryker run` timed — record duration, mutant count, mutation score
2. Identify the bottleneck: high mutant count, sandbox rebuilds, slow tests — run `/deep-optimize`
3. Check the report for where mutants cluster — files with many but low-value mutants

### 2. Enable Incremental Mode

> Goal: Run only the mutants relevant to changed code

1. Enable `incremental: true` in the config — Stryker reuses results from the previous run for unchanged files
2. Combine with `--since <ref>` (e.g. `--since main`) to mutate only the changed files in a PR
3. Fits PR checks — keep full runs for the main branch/scheduled job

### 3. Filter Mutants

> Goal: Cut the low-value mutant count

1. Narrow the `mutate` glob — only important source, skip DTOs, type-only files, generated code
2. Use `mutator.excludedMutations` to skip high-noise operators such as `['StringLiteral']` — choose what fits the project
3. Use `// Stryker disable <operators>` comments only at justified spots — don't disable randomly
4. Check the `timeout` mutants — if many, verify whether the tests are slow or a mutant creates an infinite loop

### 4. Tune Concurrency And Thresholds

> Goal: Use resources fully and gate the results

1. Set `concurrency` to the actual CPU cores available — the default is usually enough, bigger machines can go higher
2. Set `thresholds: { high, low, break }` — `break` fails the exit code when the score is lower → use it as a CI gate
3. Start `break` low and raise it gradually — don't set it so high it blocks every PR
4. `coverageAnalysis: 'perTest'` (should already be set) — don't downgrade to `all` unless necessary

### 5. Measure And Report

> Goal: Re-measure and summarize

1. Re-run after each change — compare duration and mutation score against the baseline
2. Run `/report-before-after` to report the before/after numbers
3. If the score dropped because filtering went too far → loosen the filters, then report the trade-off

## Rules

- Baseline always first — never tune without the original numbers
- Filtering must not make scores incomparable — state the exclusions clearly in the config
- `// Stryker disable` only where it's justifiable with a reason
- Incremental/scoped runs fit PRs — don't replace all full runs
- `thresholds.break` is a CI gate — raise it gradually, don't start high

## Expected Outcome

- Mutation runs measurably faster, especially in CI/PR
- Mutant scope focused on high-value code
- Thresholds gate the score in CI without blocking everything

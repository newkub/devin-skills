---
name: run-bench
description: Run benchmark tests to measure performance and compare implementations
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - run-install

  - deep-review-codebase
  - report
---

## Goal

Run benchmark tests to measure code performance and compare performance between implementations

## Scope

Use for measuring function performance, comparing different implementations, detecting performance regressions, and optimizing code based on benchmark results

## Execute

> Pre-Run: always run `/deep-review-codebase` first — `run-*` skills must be reviewed/assessed before the main action, never skip; if findings are blockers, fix or report them before running (bench)

### 1. Setup Environment

> Goal: Setup Environment

1. Run `/run-install` to install dependencies and benchmark libraries (e.g. `vitest bench`, `tinybench`)
2. Check that benchmark files exist in the project (e.g. `*.bench.ts`, `bench/` directory)
3. Check the benchmark script in `package.json` (e.g. `bun run bench`)
4. If baseline results exist, record them for comparison

### 2. Run Benchmarks

> Goal: Run Benchmarks

1. Run `bun run bench` or the script defined in `package.json`
2. To run only specific benchmarks, provide a pattern (e.g. `bun run bench -- --grep "pattern"`)
3. Wait for the benchmarks to finish and record all results
4. Run `/report` to format the results

### 3. Analyze Results

> Goal: Analyze Results

1. Review each benchmark's result and identify the slow and fast benchmarks
2. Run `/deep-review-codebase` per `deep-review-codebase/SKILL.md` to analyze whether empirical growth matches theoretical complexity
3. Find benchmarks with high variance or outliers
4. Identify potential optimizations for slow benchmarks
5. If variance is high, re-run to confirm the results

### 4. Compare With Baseline

> Goal: Compare With Baseline

1. Compare the results with the baseline if one exists
2. Identify regressions (slower) and improvements (faster)
3. Record results and action items for optimization
4. Run `/report` to summarize the results as a table

## Rules

### 1. Benchmark Best Practices

- Each benchmark must be isolated
- Run many times for consistency
- Use realistic data representative of real use cases
- Minimize test framework overhead

### 2. Metrics To Collect

- `ops/sec` - operations per second
- `avg time` - average execution time
- `min/max` - min/max execution time
- `samples` - number of samples

### 3. Conditional Execution

- If the project has no benchmark files, skip the running steps
- If there are no baseline results, skip the comparison steps
- If a monorepo has multiple workspaces, run benchmarks one workspace at a time

## Expected Outcome

- Benchmarks run successfully
- Metrics fully recorded (`ops/sec`, `avg time`, `min/max`, `samples`)
- Regressions and improvements identified
- Action items for optimization recorded

---
name: bench-perf
description: Run benchmarks and measure performance of code
triggers:
- user
- model
allowed-tools:
- read
- edit
- write
- grep
- exec
- ask_user_question
---

## Goal

Benchmark performance of code, APIs, or functions and report metrics

## Scope

Use before and after optimization to measure impact

## Execute

### 1. Identify target

> Goal: identify target

1. Select function, API, or module to benchmark
1. Define input sizes or scenarios
1. Choose benchmark tool

### 2. Setup benchmark

> Goal: setup benchmark

1. Write or reuse benchmark script
1. Use Bun, hyperfine, or ecosystem-specific tools
1. Set warm-up and iteration counts

### 3. Run benchmark

> Goal: run benchmark

1. Execute benchmark multiple times
1. Collect latency, throughput, memory metrics
1. Store baseline results

### 4. Compare

> Goal: compare

1. Run after changes
1. Compare before/after metrics
1. Highlight regressions or improvements

### 5. Report

> Goal: report

1. Create /report-format-table with metrics
1. Call /suggest-next-action

## Rules

- Use consistent environment for all runs
- Run multiple iterations to reduce noise
- Measure warm-up separately if needed
- Do not benchmark on shared/low-resource machines for critical results

## Expected Outcome

- Benchmark results with metrics and comparison
- Identified bottlenecks or improvements
- Actionable next steps

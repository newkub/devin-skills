---
name: run-profiler
description: Profile performance to find bottlenecks and optimize
argument-hint: "[scope]"
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - run-check
  - run-verify
  - deep-review

---

## Goal

Profile performance to find bottlenecks and optimize

## Scope

Use for profiling with Chrome DevTools, a Node.js profiler, or a Bun profiler to find hot paths and memory issues

See also: /deep-review

## Execute

> Pre-Run: Always run `/deep-optimize` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (profiler)

### 1. Setup Profiling

> Goal: Choose a profiling tool and set up the environment

1. Choose the appropriate profiling tool (Chrome DevTools, Node.js profiler, Bun profiler)
2. Set up the profiling environment
3. Define the profiling scope

### 2. Capture Profile

> Goal: Start a profiling session and record data

1. Start the profiling session
2. Perform the work to profile (user flow, API call, etc.)
3. Stop profiling and record the data

### 3. Analyze Profile

> Goal: Analyze the profile data

1. Analyze the call tree and flame graph
2. Identify long-running functions
3. Inspect memory allocations
4. Review network requests and I/O

### 4. Identify Bottlenecks

> Goal: Identify hot paths and inefficient code

1. Identify hot paths in the code
2. Check for unnecessary computations
3. Review inefficient algorithms
4. Check for memory leaks

### 5. Optimize

> Goal: Improve performance based on findings

1. Run `/deep-review` to make improvements
2. Use appropriate caching
3. Optimize algorithms and data structures
4. Remove unnecessary work

### 6. Verify Improvements

> Goal: Measure results after optimizing

1. Profile again after optimizing
2. Compare against the original profile
3. Confirm the improvements

## Rules

### 1. Profiling Scope

- Profile realistic workloads
- Profile in a production-like environment
- Profile for a sufficient duration

### 2. Analysis Focus

- Focus on high-impact bottlenecks
- Look at both CPU and memory
- Check I/O and network

### 3. Optimization Strategy

- Optimize the slowest things first
- Use measurements, not assumptions
- Optimize iteratively

- Use /follow-best-practice if needed
- Use /suggest-next-action if needed
- Use /resolve-errors if needed
- Use /run-check if needed
- Use /run-verify if needed

## Expected Outcome

- Performance bottlenecks are identified
- Hot paths are optimized
- Memory usage is improved
- Performance improvements are measured
- Code runs faster

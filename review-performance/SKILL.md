---
name: review-performance
description: Review measured bottlenecks and budgets, then fix the confirmed regressions
argument-hint: "[scope] [--diff] [then-fix] [fix all|follow-your-suggestion]"
related:
  - deep-review
  - deep-review-codebase-everything
  - deep-thinking
  - optimize
  - follow-tool-lighthouse
  - follow-tool-unlighthouse
  - follow-tool-vite-devtools
  - follow-tool-sonda
  - run-profiler
  - report-review
  - use-subagents
  - suggest-next-action
  - ask-me
  - review-tests
---

## Goal

Review a scope for measured performance problems and budget breaches, confirm each finding against a real measurement, then drive the fixes through the optimization owners until the numbers recover

## Scope

Use before a release, after a regression, or when a budget is suspected — a route, workspace, bundle, service, or whole application

- Entered through `/deep-review` with the `perf` signal or called by name; scope and flags are passed through as given
- This preset seeds exactly its labels from `deep-review-codebase-everything/references/presets.md` (`## Preset Map`): performance, web-vitals, bundle-size, http-delivery, media-optimization, caching, rendering-strategy, resource-leaks, llm-cost-latency, capacity-scaling, cold-start, concurrency. The matrix row `Check` stays the proof — this skill never restates a check
- Siblings: a slow test suite → `review-tests`; a schema/index problem found here is still fixed through `/optimize queries`; correctness of the optimized path → `/deep-review-codebase-everything`
- Measurement lives in `/follow-tool-lighthouse`, `/follow-tool-unlighthouse`, `/follow-tool-vite-devtools`, `/follow-tool-sonda`, and `/run-profiler`; the budget numbers come from the row's authority, never from a guess
- Without `then-fix` the run is report-only: measured findings, before numbers, and a fix sequence

## Execute

### 1. Think

> Goal: know what is slow, for whom, and against which budget

1. Run `/deep-thinking` on the scope — which user or system path is reported slow, on which device or load, and which budget applies (p75 LCP/INP/CLS, chunk size, p95 latency, memory, cost)
2. Read `references/presets.md` (`## Preset Map`) for this door's labels, then let the engine's `/deep-thinking` decide which rows apply; a row with no executable path is skipped only under its `N/A condition`
3. Separate measured facts from theories — a finding without a profile, trace, or budget number is a hypothesis, not a finding

### 2. Scan

> Goal: one evidence pass backed by real measurements

1. Run `/deep-review-codebase-everything` on the scope with the labels above, passing `--diff` when diff-scoped — read its report, do not rerun the analyzer
2. Run the measurement tools the rows name for their `capture` route — Lighthouse/Unlighthouse for web vitals, the bundler analyzer for bundle size, a profiler for runtime hot paths, `EXPLAIN ANALYZE` for query-bound cases
3. Record the baseline numbers with the environment (device, network, build) — a number without its environment cannot be compared later

### 3. Confirm

> Goal: keep only regressions that measurement proves

1. Every finding cites the measurement, the file or route, and the gap against the budget
2. Assign severity from the matrix `Default severity` and its upgrade/downgrade trigger only; a slow path nobody reaches is downgraded with the reason
3. Re-measure anything borderline before reporting it — noise is not a regression

### 4. Order The Fix

> Goal: highest user or cost impact first, one point at a time

1. Order: blocking render and interaction → request waterfalls and caching → bundle and asset weight → memory and leaks → capacity and cost
2. Cross-reference: one missing cache header or one eager import often explains several findings — fix it once and re-measure every budget it touched
3. Large or cross-workspace set → `/create-plan-in-dot-devin`; without `then-fix` stop here with the ordered table and the baseline numbers

### 5. Fix Through The Owners

> Goal: each finding is fixed by the optimization owner, behavior preserved

1. Confirm the fix list with `/ask-me` — per finding, `/follow-your-suggestion`, or `fix all`; `dont-ask-me`/`/ship` follows the report as-is
2. Dispatch through `/optimize` scopes (`perf`, `web-vitals`, `bundle`, `cache`, `network`, `llm`, `memory`, `startup`, `docker`, `cost`, `queries`) — one change at a time, re-measured before the next
3. Optimization never changes the output or behavior of the optimized path; a gain that needs a feature change is a product decision, not a fix
4. Independent targets → parallel workers via `/use-subagents`; an error mid-fix → `/resolve-errors`

### 6. Verify

> Goal: the same measurement confirms the gain, with no new regression

1. Re-run the exact measurement from step 2 in the same environment and compare before → after
2. No improvement → revert the change; a regression elsewhere → revert and report it
3. Re-review touched files with `--diff` through the engine and run `/deep-validate` plus the project's `/run-check`

### 7. Report

> Goal: before and after numbers are visible

1. Run `/report-review`: findings per matrix row with the measurement, budget, severity, and fix status
2. State each gain with both numbers and the environment; anything blocked or reverted is named with the reason
3. Close with `/suggest-next-action`

## Rules

- Measurement before opinion — every finding has a profile, trace, or budget number from a real run
- Severity comes from the row, never from intuition; moving off the default needs the cited trigger
- Optimize one point at a time, highest impact first; no improvement → revert
- Never trade correctness, accessibility, or security for a number — a budget breach fixed by removing a feature is not a fix
- Use `/use-subagents` if needed — independent routes or services measured in parallel with disjoint file sets
- Report-only unless `then-fix`; only the confirmed set is changed, and each change is re-measured before the next
- Never touch files outside the confirmed set; never commit or push unless asked

## Expected Outcome

- Every in-scope row is `done`/`covered-capture`/`covered-manual`/skipped-by-`N/A condition` in the engine ledger, proven by its coverage matrix
- Each confirmed finding has a baseline and an after number measured in the same environment
- No behavior change and no new regression on the optimized paths
- Without `then-fix`: a prioritized fix sequence with baseline numbers and no edits

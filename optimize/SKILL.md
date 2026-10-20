---
name: optimize
description: Find optimization opportunities — baseline, deep review, fix, re-measure
argument-hint: "[scope]"
related:
  - deep-optimize
  - deep-review
  - improve
  - run-bench
  - report-review
  - suggest-next-action
  - ask-me
  - follow-tool-sonda
  - follow-tool-vite-devtools
  - follow-tool-node-modules-inspector
  - follow-tool-unlighthouse
---

## Goal

Answer the question "what can be optimized" for the scope the user specifies — a thin entry that routes the scope through `references/scope-map.md` (SSOT: signal → review domain) into `/deep-review`, then does Measure → optimize → re-measure per the convention in this skill; it does not optimize itself

## Scope

Use when the user orders optimizing the whole scope without naming a domain — previously routed to one of the `optimize-*`; now every dimension is gathered here:

- If the scope/metric is clear (bundle, ci, cost, llm, docker, memory, network, perf, queries, startup, api-latency, cache, concurrency, images, mobile, storage, test-suite, web-vitals) → use `/optimize <scope>` directly per `references/scope-map.md`
- If the scope is broad or the bottleneck is unclear → `/deep-optimize` fans out across every dimension then merges a prioritized plan
- If you want general quality improvement, not performance/cost → `/improve` instead
- Every item must pass this skill's measure-first convention: never optimize without measuring a baseline

### Tools And Libraries

Hints per scope — the tool produces the baseline and the after-measurement; not every row is mandatory:

| Scope | Skills |
|-------|--------|
| `bundle` | `follow-tool-sonda`, `follow-tool-vite-devtools`, `follow-tool-node-modules-inspector` |
| `perf`, `web-vitals` | `follow-tool-unlighthouse` |

## References

- `references/scope-map.md` — the SSOT table: signal → `/optimize <scope>` → `/deep-review` domain (merges the single `/follow-optimize` that was folded into this skill — covers all 18 signals)

## Execute

### 1. Route And Baseline

> Goal: pick the right dimension + have evidence before fixing

1. Take `scope` from the argument — if absent → use the current project; if unclear → `/ask-me`
2. Look up the signal in the scope from `references/scope-map.md` → get the matching `/deep-review` domain
3. Record the baseline metrics for that dimension (time, size, cost, hit rate, p50/p95/p99) via `/run-bench`/profiler as available — never skip

### 2. Review

> Goal: findings are backed by a baseline

1. Run `/deep-review` on that scope in the domains from scope-map — report via `/report-review`
2. Keep only the findings that are measurable (the metric actually changes) — no evidence = no fix

### 3. Fix And Re-Measure

> Goal: the result is measurably real

1. Run `/report-review` with the `Metric before/after` column appended (the baseline delta is this scope's evidence), then proceed to fix immediately
2. Send each finding to `/deep-review <scope> then-fix fix all` per domain — `fix all` skips the per-finding confirm this skill already waived
3. re-measure against the baseline for every fix — if it does not improve → revert; run `/suggest-next-action` after everything is fixed

## Rules

- Never optimize yourself — route through scope-map into `/deep-review`, or use `/deep-optimize` when unclear — a thin entry holds no domain logic
- Always Measure → optimize → re-measure — no premature optimization
- Every plan/finding must be prioritized by impact/effort with baseline evidence — no evidence = no fix
- Metric-driven findings that escape from `/improve` are routed onward here — never fix perf in the improve path

## Expected Outcome

- A prioritized optimization list with baseline/after comparison
- All fixes routed through `/deep-review <scope> then-fix` per the scope-map domains
- A metric that does not improve is reverted — ending with `/suggest-next-action`

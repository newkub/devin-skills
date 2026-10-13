---
name: test-load
description: Run load tests with k6 or autocannon — measure throughput, latency, and breaking points
argument-hint: "[url-or-endpoints] [--vus N] [--duration Ns]"
related:
  - run-test
  - test-all
  - deep-review
  - deep-test
  - run-profiler
  - check-open-ports
  - report-before-after
---

## Goal

Run a load test against the app/API to measure throughput, latency distribution, and find the breaking point before deploy or after performance changes

## Scope

- Tools: `k6` (preferred, scriptable) or `autocannon` (quick, zero-script) based on availability
- Check the specified endpoints or the critical paths (health, hot endpoints, write paths)
- Load patterns: smoke (low), load (normal), stress (find the limit), spike
- Never hit production/external services without explicit permission
- Deep analysis → `/deep-test`; run other test domains → `/run-test <domain>` → `/test-<domain>`

## Execute

> Pre-Run: always run `/deep-review` first — `test-*` must be reviewed/assessed before the main work; never skip; if a finding is a blocker, fix or report it before running (load test)

### 1. Prepare Target

> Goal: get the app ready and choose the endpoints

1. Check that the app is running — run `/check-open-ports` to confirm the port, or `/run-dev` if it isn't running yet
2. Choose endpoints: from the argument, or auto-pick (health, main reads, main writes)
3. Prepare the required auth/data (test tokens, seed data)
4. Confirm the target: if it is shared/staging/prod → always ask the user first

### 2. Select Tool And Scenario

> Goal: pick the tool and load pattern that fit the objective

1. `k6` when complex scenarios are needed (stages, thresholds, checks) — write a temporary script in temp
2. `autocannon` when a quick benchmark is enough: `autocannon -c <conn> -d <sec> <url>`
3. Default scenario: ramp 0→N VUs → sustain → ramp down
4. Define measurable thresholds: p95 latency, error rate, minimum RPS

### 3. Run And Monitor

> Goal: collect metrics during the load

1. Run the load — collect the summary: RPS, latency p50/p95/p99, error rate, timeouts
2. Watch the server during the test: CPU/memory, error logs, queue buildup
3. If the error rate spikes → stop and record the failure point (breaking point)

### 4. Analyze And Report

> Goal: interpret the results and give recommendations

1. Use `/report-before-after` or a table: `No.`, `Endpoint`, `RPS`, `p50`, `p95`, `p99`, `Errors`, `Verdict`
2. Identify the observed bottleneck (CPU-bound, connection limits, DB saturation) — hand off to `/deep-optimize` or `/run-profiler` if a drill-down is needed
3. Compare against the previous baseline if one exists — flag regressions
4. Save the k6 script used in `.devin/` if the user wants to rerun it

## Rules

### 1. Target Consent

- Never load test production or third-party endpoints without explicit user approval
- State the target environment clearly in the report

### 2. Realistic Load

- Use realistic payloads and auth — don't hammer bare endpoints that don't represent real traffic
- Note client-side limits (local machine bandwidth, connection caps) that could bottleneck the client itself

### 3. Clean Up

- Delete test artifacts/data created by the load test (seeded records, test users) when finished
- Never leave a load generator running

## Expected Outcome

- Full metrics: RPS, latency percentiles, error rate per endpoint
- A clear breaking point and bottleneck hypothesis
- A reproducible script for rerunning after optimization

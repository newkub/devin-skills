# Deep Test — Load Domain

Run load tests with k6 or autocannon — measure throughput, latency distribution, and find the breaking point before deploy or after performance changes (merged from `/test-load`)

Signals: `k6`, `autocannon`, `loadtest` scripts, performance thresholds, `/run-deploy` and `/ship` gates

- Fast liveness gate → `/deep-test smoke`; per-request latency drill-down → `/run-profiler` / `/deep-optimize`; web vitals in the browser → `/optimize web-vitals`
- k6 install, script model, executors, thresholds, CI gate → `/follow-tool-k6`

## 1. Prepare Target

> Goal: get the app ready and choose the endpoints

1. Check the app is running — `/check-open-ports` to confirm the port, or `/run-dev` if it is not running yet
2. Choose endpoints: from the argument, or auto-pick (health, main reads, main writes)
3. Prepare the required auth/data (test tokens, seed data)
4. Confirm the target: shared/staging/prod → always ask the user first

## 2. Select Tool And Scenario

> Goal: pick the tool and load pattern that fit the objective

1. `k6` when complex scenarios are needed (stages, thresholds, checks) — install, config, and script shape live in `/follow-tool-k6`; write a temporary script in temp
2. `autocannon` when a quick benchmark is enough: `autocannon -c <conn> -d <sec> <url>`
3. Default scenario: ramp 0→N VUs → sustain → ramp down; other patterns: smoke (low), stress (find the limit), spike
4. Define measurable thresholds: p95 latency, error rate, minimum RPS

## 3. Run And Monitor

> Goal: collect metrics during the load

1. Run the load — collect RPS, latency p50/p95/p99, error rate, timeouts
2. Watch the server during the test: CPU/memory, error logs, queue buildup
3. Error rate spikes → stop and record the failure point (breaking point)

## 4. Analyze And Report

> Goal: interpret the results and give recommendations

1. Report a table: `No.`, `Endpoint`, `RPS`, `p50`, `p95`, `p99`, `Errors`, `Verdict` (format: `/report-before-after`)
2. Identify the observed bottleneck (CPU-bound, connection limits, DB saturation) — hand off to `/deep-optimize` or `/run-profiler` for a drill-down
3. Compare against the previous baseline if one exists — flag regressions
4. Save the k6 script in `.devin/` if the user wants to rerun it; persist → `.devin/temp/report/<workspace>/load-test-<time>.md`

## Rules

### 1. Target Consent

- Never load test production or third-party endpoints without explicit user approval
- State the target environment clearly in the report

### 2. Realistic Load

- Use realistic payloads and auth — never hammer bare endpoints that do not represent real traffic
- Note client-side limits (local bandwidth, connection caps) that could bottleneck the client itself

### 3. Clean Up

- Delete test artifacts/data created by the load run (seeded records, test users)
- Never leave a load generator running

## Expected Outcome

- Full metrics: RPS, latency percentiles, error rate per endpoint
- A clear breaking point and bottleneck hypothesis
- A reproducible script for rerunning after optimization

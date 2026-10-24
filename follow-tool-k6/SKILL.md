---
name: follow-tool-k6
description: Run k6 load tests with VU or arrival-rate scenarios, thresholds, and CI gates
argument-hint: "[scope]"
related:
  - deep-test
  - follow-tool-github-actions
  - follow-tool-hurl
  - optimize

---

## Goal

Run load tests with k6 to measure throughput and latency distribution, prove a threshold, and find the breaking point of an API or service

## Scope

For HTTP, gRPC, and WebSocket targets that need scripted, staged load with pass/fail thresholds — local runs, CI gates, and cloud runs

- Latest: k6 `v2.3.0` (GitHub latest, 2026-09-21); the `v1.8.x` line is still maintained (`v1.8.2`, 2026-10-12), so an existing 1.8 setup is not forced to migrate
- npm `k6` is a `0.0.0` placeholder — install it as a program via mise, brew, Docker, or the release binary; never `bun add -D k6`
- Scripts are JavaScript ES modules run by the Go binary — no Node APIs and no `fetch`; use the built-in `k6/*` modules
- Functional request checks before a load run → `/follow-tool-hurl` (or `/follow-tool-bruno` for collections); fixing a bottleneck the run reveals → `/optimize`
- The load domain itself — target consent, tool choice, reporting table — lives in `/deep-test load`; this skill is the tool reference behind it

## Execute

### 1. Installation

> Goal: get a pinned k6 binary

1. `mise use -g k6` — or `brew install k6`, the `grafana/k6` Docker image, or the release archive
2. Pin the major version per project (a `v2` binary is not interchangeable with `v1.8`); record the pinned version with the results
3. Verify with `k6 version`
4. Extensions (`k6/x/*`) need a custom build via `xk6` against Go module `go.k6.io/k6/v2` — avoid extensions unless the built-ins are missing

### 2. Script Model

> Goal: write a script whose shape matches the real traffic

1. Scaffold with `k6 new load.js`, then replace the body with the real journey
2. Structure: `import http from 'k6/http'`, `import { check, sleep } from 'k6'`, `export const options = {...}`, `export default function () {...}`
3. `setup()` returns data that is passed to the default function and to `teardown(data)` — use it for tokens and seeded ids
4. Requests: `http.get/post/put/patch/del/head/options`, `http.batch([...])` for parallel calls, per-request `{ headers, tags, timeout }`
5. `check()` records a pass/fail but never fails the run by itself — the `checks` metric is what a threshold can gate
6. `sleep()` between iterations; never loop inside one iteration to imitate concurrency — that measures one VU, not N VUs

### 3. Scenarios And Executors

> Goal: choose the load pattern that answers the question

1. Simple form: `{ vus, duration }`, or `{ stages: [{ duration, target }] }` for ramp up → sustain → ramp down
2. Named form: `scenarios: { name: { executor, exec, ... } }` — each scenario gets its own function, `startTime`, and tags
3. Executor pick: `constant-vus` for steady concurrency, `ramping-vus` for a concurrency profile, `constant-arrival-rate` for a fixed RPS independent of response time, `ramping-arrival-rate` to find the breaking point, `shared-iterations`/`per-vu-iterations` for a fixed amount of work
4. Arrival-rate executors need realistic `preAllocatedVUs` and `maxVUs` — too low and the run stalls with `dropped_iterations` instead of generating load
5. `--scenario <name>` runs one scenario alone; `--once` runs a single pass, useful to validate the script before a real run
6. v2 removed the `externally-controlled` executor — express the profile in stages instead

### 4. Thresholds And Checks

> Goal: make the run pass or fail on a measurable claim

1. `thresholds` is the gate: `http_req_duration: ['p(95)<500']`, `http_req_failed: ['rate<0.01']`, `checks: ['rate>0.99']`
2. Expressions compare a stat to a number: `avg`, `min`, `max`, `med`, `p(90)`, `p(95)`, `p(99)`, `p(99.9)`, `rate`, `count`, `value`
3. Scope a threshold to a tag or sub-metric: `'http_req_duration{name:GET /items}': ['p(99)<800']` — also the way to keep one slow endpoint from hiding in a global average
4. `{ threshold: 'p(95)<500', abortOnFail: true, delayAbortEval: '10s' }` stops the run early when the target is already missed
5. k6 exits `99` when any threshold fails — that exit code is the CI signal, not the summary text
6. Agree the numbers before the run; lowering a threshold afterwards turns a measurement into an assertion

### 5. Run And Read Results

> Goal: collect the distribution, not just a number

1. `k6 run load.js`; override with `--vus`, `--duration`, `--stage 30s:50`, `-e KEY=VALUE`, `--http-debug=full`, `--insecure-skip-tls-verify`
2. Read: `http_reqs` (count, rate), `http_req_duration` (avg, med, p90, p95, p99, max), `http_req_failed` (rate), `checks`, `iterations`, `vus`, `dropped_iterations`
3. p95/p99 describe the tail — the average hides it, and the tail is what users feel
4. Persist detail with `export function handleSummary(data) { return { 'summary.json': JSON.stringify(data) }; }`, or `--summary-export summary.json`
5. Stream for a dashboard with `--out json=run.json` or `--out experimental-prometheus-rw`
6. Watch the server during the run (CPU, memory, DB saturation, 5xx logs) — the client alone cannot name the bottleneck

### 6. CI Gate

> Goal: turn the run into a pipeline signal

1. Run in a job with the pinned image or binary; the exit code is the gate (`99` = threshold failed)
2. Read the target from pipeline config — never hard-code a production URL
3. A PR gate should be smoke-scale; the full ramp belongs to a nightly or pre-release job
4. Upload the summary JSON as an artifact — the table is the evidence for the review
5. Workflow shape and caching → `/follow-tool-github-actions`

### 7. Clean Up

> Goal: leave the target as it was found

1. Stop the generator when the run ends; never leave one attached to a shared environment
2. Delete seeded records and test users the run created
3. Keep the script, k6 version, target, and thresholds together so the run is reproducible

## Rules

### 1. Target Consent

- Never load-test production or third-party endpoints without explicit approval
- State the target environment in both the run output and the report

### 2. Realistic Load

- Use real payloads, auth, and think time — a bare endpoint is not the traffic users generate
- Note client-side limits (bandwidth, connection caps, `maxVUs`) that could bottleneck the generator itself

### 3. Honest Measurement

- Report the observed limit — dropped iterations, 429s, timeouts, connection errors — not only the passing numbers
- Do not retune thresholds or remove a failing scenario to make the run green; report the failure and the breaking point

### 4. Reproducibility

- Keep the script in the repo (or `.devin/`) and pin the k6 version with the results
- Keep seed data stable between the before and after runs, otherwise the comparison is meaningless

### 5. Shared State

- A load run against a shared or staging environment is a shared-state action — confirm the window first
- Never use an unbounded `maxVUs` or `duration` against an environment you do not own

## References

- [API, CLI, executor and v2 migration tables](references/apis.md)
- [Best practices](best-practices/k6-load-testing.md)
- Calling skills: `/deep-test load`, `/follow-tool-hurl`, `/follow-tool-bruno`, `/follow-tool-github-actions`, `/optimize`

### Use Cases

| Scenario | Use case |
|----------|----------|
| Gate an API on p95 + error rate in CI | `usecases/api-load-gate.md` |
| Ramp arrival rate until the service saturates | `usecases/find-breaking-point.md` |

## Expected Outcome

- A scripted scenario with named executors and measurable thresholds
- Per-endpoint metrics: RPS, p50/p95/p99, error rate
- An evidence-backed breaking point and bottleneck hypothesis
- A rerunnable script plus a summary artifact for the before/after comparison

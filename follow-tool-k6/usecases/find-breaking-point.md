# Use Case — Find The Breaking Point

> Ramp arrival rate in steps until the service saturates, then pin the rate where latency or errors cross the line — the output is a capacity number, not a pass/fail.
> Source: https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/ (accessed 2026-10-24)

## 1. Define The Claim

State the number you want to prove before writing the script:

- "The `/items` endpoint holds 200 req/s at p95 below 400 ms with under 1% errors on the staging box."
- A claim without a rate, a percentile, and an error budget cannot be falsified — rewrite it first.

Confirm you are allowed to load this target. Staging or a dedicated environment only, agreed window, and a known owner who can watch dashboards while it runs.

## 2. Pick Arrival Rate, Not VUs

Use `ramping-arrival-rate` when the question is "how much traffic can it take". VU-based executors measure "what a fixed set of users experiences", which changes meaning as the server slows down.

```js
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  scenarios: {
    ramp: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 400,
      stages: [
        { target: 50, duration: '1m' },
        { target: 100, duration: '1m' },
        { target: 200, duration: '1m' },
        { target: 400, duration: '1m' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{expected_response:true}': ['p(95)<400'],
  },
}

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/items`, {
    tags: { name: 'GET /items' },
  })
  check(res, { 'status 200': (r) => r.status === 200 })
}
```

`maxVUs` caps how many VUs k6 may open. When the cap is hit, k6 cannot sustain the rate and reports `dropped_iterations` — that is the first saturation signal.

## 3. Run With A Server-Side View

Run the ramp while someone reads the server's own latency, CPU, connection pool, and database metrics.

```bash
BASE_URL=https://staging.example.com k6 run breaking-point.js --summary-export bp.json
```

The client view alone is not enough — a plateau in client p95 that matches CPU saturation on the app server is capacity; the same plateau with idle CPU is usually a client or network limit in the load generator itself.

## 4. Read The Step Where It Broke

Walk the results stage by stage instead of reading one aggregate:

| Signal | Meaning |
|--------|---------|
| `dropped_iterations` nonzero | k6 could not start iterations at the requested rate — either `maxVUs` is too low or the target is saturated |
| p95 climbs while rate is flat | the target is at capacity |
| errors rise before latency | upstream or rate limiting, not raw capacity |
| latency flat but `checks` fail | the app is wrong under load, not slow |

`abortOnFail` stops the run when a threshold is already broken, which is useful when one stage is the only thing you need to prove:

```js
export const options = {
  thresholds: { http_req_failed: ['rate<0.01'] },
  abortOnFail: true,
}
```

## 5. Name The Number

Report the last stage that held the claim, not the stage that broke — "held 200 req/s at p95 320 ms, broke at 400 req/s with p95 1.4 s" is the deliverable.

Record the environment with the number: instance size, database tier, data volume, and whether caches were warm. A rate without its environment is not a capacity figure.

## 6. Verify

1. Re-run the last good stage on its own with a steady `constant-arrival-rate` for several minutes — a short stage can pass while a sustained run drifts.
2. Confirm the server-side metrics agree with the client percentile; if they disagree, the bottleneck is between them.
3. Repeat once more at the same rate to check the number is stable, not a lucky window.

## Pitfalls

| Pitfall | Result |
|---------|--------|
| Raising `maxVUs` to force the rate through | You measure the generator's ceiling, not the service's |
| Ramping straight to the suspected limit | No intermediate stage to name as the last good one |
| Running against production without approval | Real users absorb the ramp |
| Leaving the environment at the ramped state | Warm caches and open pools make the next run misleading |

## Related

- `references/apis.md` — executor and threshold tables
- `usecases/api-load-gate.md` — turning the resulting number into a CI gate
- `/deep-test load` — the domain workflow that consumes this result
- `/optimize` — fixing the bottleneck the ramp exposed

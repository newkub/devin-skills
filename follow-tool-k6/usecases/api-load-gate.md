# Use Case — Gate An API On p95 And Error Rate

> Turn a staged load run into a CI signal for a read-heavy API. Source: https://grafana.com/docs/k6/latest/ (accessed 2026-10-24)

## 1. Define The Claim

Write down what must hold before writing the script:

- `p(95) < 500ms` on the main read endpoint
- `http_req_failed rate < 0.01`
- `checks rate > 0.99`

Those three numbers become thresholds; nothing else decides pass/fail.

## 2. Write The Script

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    reads: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '20s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    'http_req_duration{name:GET /items}': ['p(95)<500'],
  },
};

export function setup() {
  const res = http.post(`${BASE}/auth/token`, JSON.stringify({ user: 'load', pass: __ENV.LOAD_PASS }));
  return { token: res.json('token') };
}

export default function (data) {
  const res = http.get(`${BASE}/items?limit=20`, {
    headers: { Authorization: `Bearer ${data.token}` },
    tags: { name: 'GET /items' },
  });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has items': (r) => Array.isArray(r.json('items')),
  });
  sleep(1);
}
```

## 3. Validate Before Load

`k6 run --once load.js` — one pass per scenario proves the token, the URL, and the assertions work before the ramp starts.

## 4. Run Against The Pipeline Target

```bash
k6 run -e BASE_URL="$STAGING_URL" -e LOAD_PASS="$LOAD_PASS" load.js
```

Read the summary: `http_reqs` rate is the achieved throughput, `http_req_duration` p95/p99 is the tail, `dropped_iterations` must be zero.

## 5. Gate On The Exit Code

k6 exits `99` when any threshold fails and `0` when all pass:

```yaml
- run: k6 run -e BASE_URL="$STAGING_URL" -e LOAD_PASS="$LOAD_PASS" --summary-export summary.json load.js
- uses: actions/upload-artifact@v4
  if: always()
  with: { name: k6-summary, path: summary.json }
```

The workflow shape and caching live in `/follow-tool-github-actions`.

## 6. Verify

- Exit code matches the threshold outcome (`echo $?` locally, job status in CI)
- `summary.json` contains the three metrics the gate claims
- `dropped_iterations` is `0`; otherwise raise `maxVUs` and rerun before trusting the result
- The target environment in the artifact matches the intended one

## Pitfalls

| Pitfall | Fix |
|---|---|
| Testing `GET /health` instead of the real endpoint | load the endpoint the users actually call |
| Untagged requests | tag with `name` so the path-param variants do not split the percentiles |
| Threshold on `avg` | gate on p95/p99 — the average hides the tail |
| Loading production because the URL was hard-coded | read the base URL from pipeline config |
| Ramp duration too short | allow at least the warm-up time of the service under test |

## Related

- `/follow-tool-k6` — script model, executors, thresholds
- `/deep-test load` — the load domain and its report table
- `/follow-tool-github-actions` — workflow integration
- `/optimize` — fix a bottleneck the gate exposes

| key | value |
|---|---|
| package | k6 — single Go binary, released as `grafana/k6` |
| install | `mise use -g k6` · `brew install k6` · `docker run --rm -i grafana/k6 run -` · release archive |
| version | `v2.3.0` (GitHub latest, 2026-09-21); `v1.8.x` still maintained (`v1.8.2`, 2026-10-12) — verified 2026-10-24 |
| npm | `k6@0.0.0` is a placeholder — install the program, not a JS dependency |
| license | AGPL-3.0 |
| docs | https://grafana.com/docs/k6/ |
| repo | https://github.com/grafana/k6 |
| exit codes | `0` success · `99` threshold failed |
| extensions | custom binary via `xk6`; Go module path `go.k6.io/k6/v2` |

| api | description | signature/example |
|---|---|---|
| `export const options` | run configuration | `vus`, `duration`, `stages`, `scenarios`, `thresholds`, `discardResponseBodies`, `gracefulStop` |
| default export | per-iteration function | `export default function (data) { ... }` |
| `setup()` / `teardown(data)` | per-test lifecycle; setup data reaches every VU | `export function setup() { return { token } }` |
| `handleSummary(data)` | custom end-of-run output | returns `{ 'summary.json': JSON.stringify(data) }`; a `stdout` key prints |
| `k6/http` | HTTP client | `http.get/post/put/patch/del/head/options`, `http.batch()`, `http.file()` |
| `k6` | assertions and utilities | `check()`, `sleep()`, `fail()`, `randomIntBetween()`; `group()` returns a Promise |
| `k6/metrics` | custom metrics | `new Trend()`, `new Gauge()`, `new Counter()`, `new Rate()` |
| thresholds | pass/fail gate | `['p(95)<500']` or `{ threshold: 'p(95)<500', abortOnFail: true, delayAbortEval: '10s' }` |
| threshold stats | left side of an expression | `avg min max med p(90) p(95) p(99) p(99.9) rate count value` |

| cli | description | key flags |
|---|---|---|
| `k6 run <script>` | run locally | `-e K=V`, `--vus`, `--duration`, `--stage 30s:50`, `--scenario`, `--summary-export`, `--out`, `--config` |
| `k6 new [file]` | scaffold a runnable script | optional output filename |
| `k6 cloud run <script>` | run on Grafana Cloud k6 | account and token required |
| `k6 version` / `k6 help` | version and command list | — |
| `--http-debug[=full]` | log requests and responses | debug only; very verbose |
| `--insecure-skip-tls-verify` | skip TLS verification | local/staging only |
| `--address <host:port>` | enable the local REST API | off by default since v2 |
| `-o/--out` | stream metrics | `json=run.json`, `experimental-prometheus-rw`, `cloud` |

| executor | use | options |
|---|---|---|
| `shared-iterations` | fixed total iterations split across VUs | `vus`, `iterations`, `maxDuration` |
| `per-vu-iterations` | fixed iterations per VU | `vus`, `iterations`, `maxDuration` |
| `constant-vus` | fixed concurrency for a duration | `vus`, `duration` |
| `ramping-vus` | concurrency ramp profile | `stages`, `startVUs`, `gracefulRampDown`, `gracefulStop` |
| `constant-arrival-rate` | fixed request rate, independent of latency | `rate`, `timeUnit`, `duration`, `preAllocatedVUs`, `maxVUs` |
| `ramping-arrival-rate` | rate ramp — breaking point search | `startRate`, `timeUnit`, `stages`, `preAllocatedVUs`, `maxVUs` |
| `externally-controlled` | removed in v2 | model the profile with stages |

| v2 change | detail |
|---|---|
| Go module path | `go.k6.io/k6/v2` — extensions must be rebuilt and bump the path |
| commands removed | `login`, `pause`, `resume`, `scale`, `status` |
| flags removed | `--no-summary`, `--upload-only` |
| executor removed | `externally-controlled` |
| cloud options | legacy `ext.loadimpact` replaced by the `cloud` option |
| redis module | removed — use the xk6 redis extension |
| local HTTP API | disabled unless `--address` is passed |
| `group()` | now async — await the returned Promise |

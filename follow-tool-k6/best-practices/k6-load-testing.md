# k6 Load Testing Best Practices

Guidelines for scripts that measure something real, fail honestly, and stay rerunnable

## Recommended Patterns

### Model The Real Journey

- One iteration = one user journey (login → read → write), not one bare `GET /health`
- Include think time (`sleep`) — without it the generator produces a tighter loop than any real client
- Use real payload sizes and real auth; a token from `setup()` beats a hard-coded one
- Seed data outside the measurement window (in `setup`), never inside the timed loop — setup cost is not traffic

### Choose The Right Executor

- "N users at once" → `constant-vus` or `ramping-vus`
- "N requests per second regardless of latency" → `constant-arrival-rate`; this is the honest throughput test
- "Where does it break?" → `ramping-arrival-rate` with staged rate targets
- Fixed work (batch job, N records) → `shared-iterations` / `per-vu-iterations`
- Arrival-rate executors measure the target, not the client: if `dropped_iterations` is non-zero the generator ran out of VUs, and the run tells you nothing

### Thresholds Before Load

- Write the threshold first, then run — the number is the requirement, not a post-hoc description
- Gate on `http_req_failed` (rate) and `http_req_duration` (p95/p99), not on `avg`
- Add a `checks: ['rate>0.99']` threshold so assertion failures also gate
- Per-endpoint thresholds via tags: `'http_req_duration{name:GET /search}': ['p(99)<800']`
- `abortOnFail: true` saves minutes when the target is missed early

### Tags Make The Report Readable

- Tag each request: `http.get(url, { tags: { name: 'GET /items' } })` — the default tag is the URL, so path params fragment the metrics
- Tag scenarios and groups consistently so a slow endpoint stays visible next to a fast aggregate

### Read The Distribution

- p95/p99 and `max` describe the experience; the average hides the tail
- Compare `http_reqs.rate` against the intended arrival rate — a lower actual rate means the target or the generator could not keep up
- Non-zero `dropped_iterations`, rising `http_req_failed`, 429s, or connection errors are the breaking-point signals, not side notes

### CI Shape

- PR: a short `smoke` scenario (a few VUs, seconds) with thresholds
- Nightly / pre-release: the ramp profile, with the summary JSON uploaded as an artifact
- Pin the k6 major version in the job and keep the script in the repo so a result can be reproduced

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Measuring `/health` | great numbers, no information | load the real read/write paths with real payloads |
| No think time | throughput higher than any real user produces | `sleep()` between requests, or use an arrival-rate executor |
| Recording inside the timed block | latency includes data setup | seed in `setup()`, read from the returned data |
| One scenario for every question | the run answers nothing precisely | separate `smoke`, `load`, `stress` scenarios |
| `preAllocatedVUs` too low | `dropped_iterations` > 0, flat RPS | size VUs from expected latency × rate, and set `maxVUs` |
| Loading production | real users affected | staging or a dedicated environment, with approval |
| Lowering a threshold after a failure | green pipeline, unchanged system | fix the system or report the failure |
| Leaving the generator running | background load on a shared env | stop on completion; time-box every run |
| Comparing runs with different seed data | before/after numbers not comparable | keep seed data and script version fixed |
| No server-side metrics | client numbers with no bottleneck hypothesis | watch CPU, memory, DB, and error logs during the run |

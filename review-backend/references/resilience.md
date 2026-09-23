# Resilience Checklist — review-backend

## Timeouts

- [ ] ทุก outbound call มี timeout — HTTP clients, DB queries, RPC, queues — ไม่มี infinite waits
- [ ] timeout budget — end-to-end deadline ต่อ request กระจายลง dependencies (ไม่ให้ child > parent)
- [ ] timeout vs retry — retry budget ≤ caller timeout, ไม่ stack retries ทะลุ deadline

## Retries And Backoff

- [ ] retry เฉพาะ transient errors — 5xx/network/timeout, ไม่ retry 4xx/validation
- [ ] exponential backoff + jitter — ไม่ thundering herd หลัง outage
- [ ] max attempts + max elapsed — bounded, ไม่ infinite retry
- [ ] idempotency — retry ปลอดภัยเฉพาะ idempotent ops หรือมี dedup key

## Circuit Breakers And Bulkheads

- [ ] circuit breaker ต่อ dependency สำคัญ — fail fast เมื่อ downstream พัง, half-open probe
- [ ] bulkheads — connection pools/threads แยกต่อ dependency, failure ไม่ลามทั้ง system
- [ ] fallback ตอน breaker open — cached/degraded response ไม่ใช่ hard error เสมอไป
- [ ] backpressure — queue bounded, load shedding เมื่อ overload

## Graceful Degradation

- [ ] non-critical dependency down → feature degrade ไม่ใช่ page down (cache, defaults, skip)
- [ ] health endpoints — `/healthz` shallow + `/readyz` dependency-aware
- [ ] graceful shutdown — SIGTERM → stop accepting, drain in-flight, close pools
- [ ] startup ordering — dependencies ready ก่อน serve (migrations, connections)

## Error Boundaries

- [ ] typed errors — domain errors vs infra errors แยก, ไม่ stringly-typed
- [ ] error mapping — internal errors → safe client responses (no stack traces/SQL leak)
- [ ] ไม่ swallow errors — catch แล้ว log+metric หรือ rethrow, ไม่ silent `catch {}`
- [ ] correlation id — error trace ตามได้ข้าม layers

## Cascading Failure Protection

- [ ] retry storms — client-side rate limit บน retries ต่อ dependency
- [ ] fail-fast config — invalid config/secrets fail ที่ startup ไม่ใช่ runtime
- [ ] partial outage testing — chaos/failure injection ทดสอบหรือมี failure mode docs

## Detection

- grep HTTP clients — `fetch`, `axios`, `got`, `reqwest` — มี timeout/retry config ไหม
- grep `setTimeout`-free retries, `while` loops รอบ network calls
- ตรวจ health endpoints + shutdown handlers

Severity: no timeout on outbound = High, retry non-idempotent = High, silent catch = Medium–High, no graceful shutdown = Medium

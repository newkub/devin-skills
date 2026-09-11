# review-backend — Full Dimension Checklist

## 1. Service Design

- [ ] service boundaries, SRP, layered structure
- [ ] request lifecycle: validate → authz → domain → persist → respond
- [ ] domain logic ไม่กระจายใน controllers/handlers

## 2. Data Layer

- [ ] query patterns, N+1, index usage (เชื่อม `/review-database`)
- [ ] transactions: boundaries, isolation level, deadlocks
- [ ] migrations strategy, seed/fixture separation
- [ ] connection pooling, timeouts

## 3. Async And Jobs

- [ ] queues: at-least-once + idempotent consumers, DLQ
- [ ] retries: exponential backoff + jitter, max attempts
- [ ] scheduled jobs: overlap protection, monitoring
- [ ] event ordering, outbox pattern ถ้า event-driven

## 4. Caching

- [ ] cache strategy: keys, TTL, invalidation
- [ ] stampede protection (lock/coalescing)
- [ ] stale-while-revalidate ที่เหมาะสม

## 5. Errors And Resilience

- [ ] error taxonomy, consistent error responses
- [ ] circuit breakers, timeouts ทุก outbound call
- [ ] graceful degradation, fallback paths
- [ ] panic/crash recovery, supervision

## 6. Security And Config

- [ ] input validation, output encoding
- [ ] secrets management, least privilege
- [ ] config per-env, no prod secrets in dev
- [ ] dependency security (เชื่อม `/run-audit`)

## 7. Observability And Scaling

- [ ] health/readiness endpoints, metrics, traces
- [ ] structured logs, correlation IDs
- [ ] statelessness, horizontal scaling readiness

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)

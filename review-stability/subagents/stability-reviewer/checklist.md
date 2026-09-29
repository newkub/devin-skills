# review-stability — Full Dimension Checklist

## 1. App Stability

- [ ] crash-free paths, unhandled exceptions eliminated
- [ ] resource exhaustion: memory, handles, connections
- [ ] graceful degradation under load

## 2. Error Handling

- [ ] error taxonomy, boundaries at right levels
- [ ] retry: backoff+jitter, idempotent retries only
- [ ] timeout everywhere, cancellation propagation
- [ ] no swallowed/empty error handlers

## 3. Debuggability

- [ ] actionable error messages, error codes
- [ ] correlation IDs, request tracing
- [ ] debug tooling, diagnostic modes

## 4. Recovery

- [ ] self-healing: restarts, reconnect, resume
- [ ] state recovery after crash, partial-failure handling
- [ ] circuit breakers, bulkheads, fallback paths
- [ ] data corruption prevention/recovery

## 5. Operational Readiness

- [ ] health checks meaningful (not always-200)
- [ ] deploy safety: rolling, canary, rollback (เชื่อม `/review-release`)
- [ ] chaos/failure testing evidence

## 6. Regression Protection

- [ ] flaky test handling, regression suites
- [ ] change detection, canary signals

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)

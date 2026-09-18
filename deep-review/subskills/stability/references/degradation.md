# Degradation Matrix Checklist — review-stability

## Graceful Degradation Matrix

- [ ] dependency inventory — every external dep mapped (DB, cache, API, auth, storage, queue, email, payment, CDN, AI/LLM)
- [ ] per-feature fallback — for each dependency failure, what does each feature do?
  - read-only mode — serve cached/stale data
  - degraded mode — reduced functionality (no personalization, no images)
  - queued mode — accept writes, process later
  - unavailable — clear error message, not crash
- [ ] matrix documented — table: Dependency × Feature → Behavior
- [ ] criticality tiers — which deps are critical (app down) vs non-critical (degrade)

## Degradation Behaviors

- [ ] cached fallbacks — stale data served when fresh unavailable
- [ ] default values — missing config/data → sensible defaults
- [ ] feature flags — disable broken features without deploy
- [ ] static content — essential pages work without backend
- [ ] offline mode — core features work without network
- [ ] reduced precision — approximate answers when exact unavailable

## Circuit Breaking

- [ ] per-dependency breakers — each external call has breaker
- [ ] half-open recovery — test with single request before full reopen
- [ ] fallback responses — breaker open → cached/default response
- [ ] manual override — ops can force-breaker or bypass
- [ ] metrics — breaker state visible (open/half-open/closed)

## Load Shedding

- [ ] overload detection — CPU/memory/queue depth thresholds
- [ ] priority queuing — critical requests served first
- [ ] graceful 503 — reject with retry-after, not hang
- [ ] request dropping — non-critical requests dropped first
- [ ] capacity planning — known limits, documented

## Failure Injection

- [ ] chaos tests — kill dependencies, measure behavior
- [ ] network partitions — simulate latency, packet loss, timeout
- [ ] resource exhaustion — memory, disk, connections, file handles
- [ ] dependency failures — DB down, cache down, API down, queue down
- [ ] partial failures — some instances down, some healthy
- [ ] cascading failures — one failure triggers others

## Recovery Procedures

- [ ] failover — automatic or manual, documented steps
- [ ] rollback — deploy rollback tested, not just planned
- [ ] data recovery — backup restore tested, RTO/RPO known
- [ ] degraded mode exit — how to return to normal after incident
- [ ] state reconciliation — data consistency after partial failure

## Monitoring And Alerting

- [ ] dependency health — each dep monitored, status page
- [ ] degradation alerts — when degraded mode activates
- [ ] user impact — how many users affected, which features
- [ ] recovery time — time to detect, time to restore tracked
- [ ] postmortem — incidents reviewed, matrix updated

## User Experience During Degradation

- [ ] clear messaging — "temporarily unavailable" not silent failure
- [ ] estimated recovery — "back in ~15 minutes" or "retrying"
- [ ] preserved state — user's work saved, not lost on refresh
- [ ] graceful retry — auto-retry with backoff, manual retry option
- [ ] partial functionality — what works vs what doesn't clear

## Detection

- grep circuit breakers — `circuit`, `breaker`, `halfOpen`, `fallback`
- grep cache fallbacks — `stale`, `cached`, `default`, `fallback`
- grep feature flags — `flag`, `toggle`, `enabled`, `disabled`
- grep chaos — `chaos`, `fault`, `inject`, `kill`, `partition`
- test — kill deps, measure behavior, verify matrix

Severity: no fallback for critical dep = Critical, cascading failure unhandled = Critical, no chaos testing = Medium, unclear degraded UX = Medium

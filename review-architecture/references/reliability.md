# Reliability Checks

## Goal

ตรวจสอบ reliability, resilience, recoverability ครอบคลุม failure points, redundancy, observability, disaster recovery, predictability, concurrency

## Checks

### Failure Points And Redundancy

1. ตรวจสอบ dependencies ภายในและภายนอก: database, cache, queue, external APIs, file system
2. ตรวจสอบ redundancy, replication, multi-zone/multi-region
3. ตรวจสอบ graceful degradation: ระบบยังทำงานบางส่วนได้เมื่อ dependency ล้ม
4. ระบุ dependencies ที่ไม่มี fallback หรือ redundancy

### Observability

1. ตรวจสอบ metrics, logs, traces, alerts, dashboards, SLOs, telemetry, auditability
2. ระบุ tools: `Prometheus`, `Grafana`, `OpenTelemetry`, `Datadog`, `Sentry`
3. ตรวจสอบ structured logging, distributed tracing
4. ตรวจสอบ alert response process

### Disaster Recovery

1. ตรวจสอบ DR plan, RPO/RTO, backup/restore, runbooks, incident response
2. ตรวจสอบ restart policies, recovery drills
3. ถ้าไม่พบ DR setup → บันทึก finding Critical

### Predictability

1. ตรวจสอบ random/seed, timestamps, UUID
2. ตรวจสอบ global/shared mutable state
3. ตรวจสอบลำดับการทำงานที่อาจเปลี่ยน: concurrency, race conditions
4. ลด non-determinism: dependency injection สำหรับ `Date`, `Math.random`

### Concurrency

1. ระบุ async patterns, primitives: `Promise.all`, `Promise.race`, `AbortController`
2. ตรวจสอบ shared state mechanisms, worker setup, locks, atomic operations
3. ตรวจสอบ file I/O ที่ไม่มี lock/atomic
4. ถ้า project ไม่มี async operations → ข้าม step นี้

### Health Checks

1. ตรวจสอบ health checks บน critical path
2. ตรวจสอบ readiness/liveness probes
3. ตรวจสอบ missing health check บน critical dependency

## Severity

- Critical: no timeout/retries บน critical external call, no fallback สำหรับ critical dependency, SPOF โดยไม่มี redundancy, no backup/restore, no health check บน critical path, data loss จาก failure ที่ไม่มี recovery, no DR plan
- High: missing retry, missing timeout, missing fallback, missing circuit breaker, missing health check, missing backup, missing idempotency, missing graceful degradation, missing observability บน critical path
- Medium: suboptimal retry/backoff, partial health check, missing runbook, minor backup gaps, missing monitoring บน non-critical path
- Low: cosmetic, documentation gap, minor naming improvement

---
name: review-events
description: Review event-driven systems — event schemas, ordering, idempotency, DLQ, replay, schema evolution
argument-hint: "[scope]"
related:
  - review-backend
  - review-api
  - review-observability
  - review-stability
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review event-driven architecture — event schemas, producer/consumer contracts, ordering, idempotency, dead-letter handling, replay/recovery, schema evolution — report-only

## Scope

ใช้เมื่อ project มี message/event systems (Kafka, SQS/SNS, NATS, RabbitMQ, webhooks, event sourcing) — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

## Execute

### 1. Inventory Event Surface

> Goal: map topics/events/consumers ทั้งหมด

1. grep producers/consumers — topics, queues, event types
2. event catalog: name → schema → producer → consumers → criticality

### 2. Check Schemas And Contracts

> Goal: contracts ชัดและ compatible

1. event schemas defined (JSON Schema/Avro/Protobuf/zod) ไม่ใช่ ad-hoc objects
2. schema registry/versioning — breaking changes มี strategy
3. contract tests producer↔consumer

### 3. Check Delivery Semantics

> Goal: at-least-once handling ถูกต้อง

1. idempotency — consumers dedupe (idempotency keys/event IDs)
2. ordering — partition keys ตรง entity, ordering assumptions documented
3. retries — backoff, max attempts, poison message → DLQ

### 4. Check Failure Modes

> Goal: event loss/replay รอด

1. DLQ monitoring + replay process มี runbook
2. consumer lag monitoring/alerting
3. replay safety — reprocessing events ไม่ side-effect ซ้ำ
4. webhook signatures/verification ถ้ามี

### 5. Check Reliability Patterns

> Goal: produce/consume รอดเมื่อ broker หรือ DB พัง — ทำตาม `subagents/events-reviewer/patterns.md`

1. outbox pattern — event ไม่หลุดเมื่อ DB commit แล้ว publish fail
2. inbox pattern — consumer dedupe persisted ไม่ใช่ in-memory
3. backpressure — consumer ช้ากว่า producer มี strategy (buffer/batch/reject)
4. schema evolution — consumer อ่าน event เวอร์ชันเก่าได้ (backward/forward compat)

### 6. Check Observability

> Goal: event flow trace ได้

1. event trace IDs ผ่าน pipeline — correlation กับ logs/traces
2. metrics: publish rate, consumer lag, DLQ depth, processing latency

### 7. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ event/topic พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: event loss (no outbox, fire-and-forget หลัง DB write), consumer ไม่ idempotent บน money/critical path, schema breaking change ไม่มี versioning, DLQ ไม่มี = poison message ค้าง
- `High`: no dedupe, no lag alerting, replay ไม่ปลอดภัย, webhook ไม่ verify signature, no contract tests
- `Medium`: missing trace propagation, partial schema docs, backpressure strategy ไม่ชัด
- `Low`: naming inconsistency, catalog ไม่ครบ, docs gaps


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| Apply event findings — schemas, idempotency, DLQ (user confirm) | `subskills/improve-events/SKILL.md` |

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence — topic/queue name, consumer/producer file, schema location
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-stability สำหรับ resilience deep-dive
- ใช้ /review-observability สำหรับ event tracing
- ใช้ /review-api สำหรับ webhook/contract conventions
- ใช้ /review-backend สำหรับ consumer code quality

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. schemas → define + version + contract tests
2. idempotency → dedupe keys/consumer-side checks
3. DLQ → routing + alerting + replay runbook
4. observability → trace propagation + lag metrics
5. verify: replay test + duplicate-delivery test ผ่าน

## References

- [Reliability patterns](subagents/events-reviewer/patterns.md)

## Expected Outcome

- event catalog ครบพร้อม contract status
- delivery/failure-mode findings พร้อม severity
- observability gaps ระบุชัด

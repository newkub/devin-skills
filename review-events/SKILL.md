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

### 5. Check Observability

> Goal: event flow trace ได้

1. event trace IDs ผ่าน pipeline — correlation กับ logs/traces
2. metrics: publish rate, consumer lag, DLQ depth, processing latency

### 6. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ event/topic พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-stability สำหรับ resilience deep-dive
- ใช้ /review-observability สำหรับ event tracing
- ใช้ /review-api สำหรับ webhook/contract conventions`n- ใช้ /review-backend สำหรับ consumer code quality

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. schemas → define + version + contract tests
2. idempotency → dedupe keys/consumer-side checks
3. DLQ → routing + alerting + replay runbook
4. observability → trace propagation + lag metrics
5. verify: replay test + duplicate-delivery test ผ่าน

## Expected Outcome

- event catalog ครบพร้อม contract status
- delivery/failure-mode findings พร้อม severity
- observability gaps ระบุชัด

---
name: review-events-improve-events
description: Apply event findings — schema versioning, idempotency, DLQ, observability
argument-hint: "[scope-or-findings]"
related:
  - review-events
  - check-idempotency
  - run-test
  - report-before-after
---

## Goal

แก้ event-driven findings จาก `/review-events` จริง — contracts ชัด, delivery เชื่อถือได้, failures recoverable

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: event schemas, idempotency, DLQ handling, ordering, observability — infra changes อยู่ parent `## Fix`

## Execute

### 1. Baseline

> Goal: รู้ event flows จริง

ทำตาม `../../references/patterns.md`

1. map topics/queues → producers/consumers จาก code
2. list findings: missing schemas, non-idempotent consumers, no-DLQ queues
3. เตรียม replay/duplicate-delivery test approach

### 2. Fix Contracts

> Goal: events มี schema + versioning

1. define schemas (zod/protobuf/jsonschema) ต่อ event type + version field
2. contract tests — producer emits valid schema, consumer handles all versions in-flight
3. event naming/payload conventions consistent

### 3. Fix Delivery Safety

> Goal: duplicates และ failures ไม่ corrupt

1. idempotency — dedupe keys + consumer-side checks (`/check-idempotency` verify)
2. DLQ — routing + alerting + replay runbook; poison messages ไม่ block queue
3. ordering — document + enforce per-key ordering เมื่อจำเป็น

### 4. Fix Observability

> Goal: event flow มองเห็น

1. trace propagation — trace context ผ่าน event metadata
2. lag/age metrics + DLQ depth alerts

### 5. Verify

> Goal: behavior พิสูจน์ได้

1. replay test — re-deliver events ไม่ corrupt state
2. duplicate-delivery test — at-least-once safe จริง
3. `/run-test` ผ่าน + `/report-before-after` — findings หายครบ

## Rules

- preserve semantics — ห้ามเปลี่ยน event meaning โดยไม่มี migration plan สำหรับ in-flight events
- schema change → version bump ไม่ใช่ breaking in-place
- fix-verify loop สูงสุด 3 รอบ → ไม่ผ่าน stop + report

## Expected Outcome

- Event contracts versioned + contract-tested
- Idempotent consumers + DLQ + lag visibility พร้อม evidence

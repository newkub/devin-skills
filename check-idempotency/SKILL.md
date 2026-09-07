---
name: check-idempotency
description: ตรวจ mutation endpoints ว่า retry-safe — idempotency keys, dedup และ side effects ซ้ำ
argument-hint: "[endpoints]"
related:
  - review-api
  - report-table
---

## Goal

ตรวจ mutation operations ว่า idempotent หรือไม่ — retry, double-click, webhook redelivery แล้วไม่เกิด side effects ซ้ำ (double charge, duplicate records, repeated emails)

## Scope

- ตรวจ POST/PUT/PATCH/DELETE endpoints และ async handlers (webhooks, queues, consumers)
- ครอบคลุม: idempotency keys, natural dedup keys, unique constraints, at-least-once delivery handlers, retry-unsafe side effects
- Read-only: รายงาน gaps — แก้ไขผ่าน `/review-api` remediation หรือ `/review-then-fix`

## Execute

### 1. Map Mutation Surface

> Goal: รวบรวม operations ที่มี side effects

1. หา mutation endpoints ทั้งหมด + webhook handlers + queue consumers
2. จัดประเภทตาม side effect ที่ซ้ำแล้วเจ็บ: payments, record creation, emails/notifications, external API calls, file writes
3. severity สูงสุด: money-moving และ irreversible operations

### 2. Detect Idempotency Mechanisms

> Goal: ตรวจว่าแต่ละ operation ปลอดภัยต่อการซ้ำไหม

1. หา `Idempotency-Key` header handling, dedup tables, `ON CONFLICT`/upsert patterns
2. ตรวจ natural keys: unique constraints ที่ทำให้ duplicate insert fail อย่างถูกต้อง
3. ตรวจ webhook handlers: event id dedup (stripe event ids, delivery ids)
4. ตรวจ queue consumers: มี idempotent processing หรือ assume exactly-once

### 3. Analyze Retry Paths

> Goal: ตามหาจุดที่ซ้ำได้จริง

1. Client retry + timeout → อาจยิงซ้ำระหว่าง server ยัง process
2. Webhook redelivery → providers ส่งซ้ำเป็นเรื่องปกติ
3. Queue at-least-once → handler เห็น message ซ้ำได้
4. UI double-submit → ไม่มี button disable + ไม่มี server dedup

### 4. Report

> Goal: สรุป non-idempotent operations พร้อม severity

1. ใช้ `/report-table` คอลัมน์: `No.`, `Operation`, `Side Effect`, `Protection`, `Retry Risk`, `Severity`, `Fix`
2. Severity: `critical` (payments/irreversible ไม่มี protection), `high` (webhook/queue ไม่ dedup), `medium` (forms ไม่มี idempotency key)
3. แนะนำ fix ต่อประเภท: idempotency keys, unique constraints, event dedup store, request fingerprinting

## Rules

### 1. Evidence-Based

- ทุก finding ต้อง trace side effect จริง — ไม่ flag read-only endpoints
- ระบุ mechanism ที่มีอยู่หรือขาดอย่างชัดเจน

### 2. Read-Only

- ไม่แก้ code — รายงานแล้วให้ remediation แยก
- ไม่ replay requests จริงเพื่อทดสอบ — วิเคราะห์จาก code

### 3. Severity By Impact

- เรียงตามความเสียหายเมื่อซ้ำ — money > notifications > convenience duplicates
- GET/HEAD/OPTIONS ไม่ตรวจ (idempotent by definition)

## Expected Outcome

- รายการ operations ที่ retry-unsafe พร้อม severity
- ช่องทางซ้ำที่เป็นไปได้ต่อ operation
- คำแนะนำ idempotency mechanism ที่เหมาะต่อตัว

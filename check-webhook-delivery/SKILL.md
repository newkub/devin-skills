---
name: check-webhook-delivery
description: ตรวจ webhook delivery reliability — retries, ordering, dead-letter และ failure handling
argument-hint: "[endpoint-or-provider]"
related:
  - check-idempotency
  - review-stability
  - check-webhook-security
  - check-error-coverage
  - improve-observability
  - report-table
---

## Goal

ตรวจ webhook delivery pipeline ว่า reliable — retries เมื่อ fail, ordering guarantees, dead-letter handling และ observability เมื่อ delivery ล่ม

## Scope

- ตรวจทั้งสองฝั่ง: outbound webhooks (เราส่ง) และ inbound handlers (เรารับ)
- ครอบคลุม: retry policies, exponential backoff, delivery ordering, dead-letter queues, timeout handling, delivery logs
- Read-only: รายงาน — แก้ผ่าน `/review-stability` remediation

## Execute

### 1. Map Delivery Paths

> Goal: รวบรวม webhook flows ทั้งสองทิศ

1. Inbound: handlers ที่รับ events — process sync หรือ queue?
2. Outbound: จุดที่ส่ง webhooks — direct HTTP หรือผ่าน queue/worker?
3. ระบุ failure modes ต่อ path: network fail, receiver down, slow processing

### 2. Check Retry And Ordering

> Goal: ตรวจ delivery guarantees

1. **Retries**: มี retry policy ไหม — count, backoff, max attempts
2. **Ordering**: events ที่ต้องเรียง (created→updated→deleted) รับ out-of-order ได้ไหม
3. **Idempotency**: handler รับ duplicate delivery ปลอดภัยไหม — ทำ `/check-idempotency` ร่วม
4. **Timeout**: processing timeout vs provider retry window — flag handlers ช้ากว่า provider timeout

### 3. Check Failure Handling

> Goal: ตรวจว่า failed deliveries ไม่หาย

1. Dead-letter queue / failed event store — events ที่ fail หมด retries ไปไหน
2. Alerting เมื่อ delivery fail — silent failures คือ finding
3. Recovery path: replay failed events ได้ไหม
4. Sync vs async processing — handlers ที่ process sync ทั้งก้อนเสี่ยง timeout

### 4. Check Observability

> Goal: delivery status มองเห็นได้ไหม

1. Delivery logs/metrics: success rate, latency, retry counts
2. Correlation: event IDs traceable ข้าม sender/receiver
3. Dashboard/alerting สำหรับ delivery health — ทำ `/improve-observability` ถ้าขาด

### 5. Report

> Goal: สรุป reliability gaps

1. ใช้ `/report-table`: `No.`, `Path`, `Issue`, `Failure Mode`, `Severity`, `Fix`
2. Severity: `critical` (events หายเงียบๆ), `high` (no retries/DLQ), `medium` (ordering unhandled), `low` (observability gaps)

## Rules

### 1. Evidence-Based

- ทุก finding อ้าง code path จริง — retry counts, timeout values, queue config
- แยก "ไม่มี mechanism" ออกจาก "มีแต่ misconfigured"

### 2. Both Directions

- ตรวจทั้งส่งและรับ — reliability มีสองฝั่ง
- provider delivery guarantees (at-least-once ส่วนใหญ่) ต้อง match handler design

### 3. Read-Only

- ไม่แก้ pipeline — รายงานแล้ว remediate แยก
- ไม่ trigger real deliveries เพื่อทดสอบบน production

## Expected Outcome

- Delivery reliability assessment ทั้ง inbound/outbound
- Failure modes พร้อม severity และ fix paths
- Observability gaps ที่ต้องปิด

---
name: review-api-check-webhooks
description: Check webhooks/realtime — signature verify, retry/idempotency, replay safety
argument-hint: "[scope]"
related:
  - review-api
  - report
---

## Goal

Run the webhooks/realtime dimension of `/review-api` แบบ focused — delivery ปลอดภัยและ consumers จัดการกับ duplicates/replay ได้

## Scope

- ใช้เมื่อ `/review-api` dispatch มาที่ `webhooks`/`realtime` หรือเรียก standalone
- ครอบคลุม: webhook signing, retry policy, idempotency, ordering, realtime channels (WS/SSE)
- Deep delivery/security probe → delegate `/review-api` แล้วรวม findings

## Execute

### 1. Webhook Checks

> Goal: webhook pipeline เชื่อถือได้และปลอดภัย

ทำตาม `../../references/webhooks-realtime.md`

1. signature verification — HMAC + timestamp tolerance, ห้าม skip verify
2. retries — backoff + max attempts, DLQ สำหรับ poison events
3. idempotency — consumer-side dedupe keys, at-least-once semantics documented
4. ordering — out-of-order/duplicate delivery ไม่ corrupt state

### 2. Realtime Checks

> Goal: WS/SSE channels ปลอดภัย

1. auth บน connect + re-check บน subscribe ต่อ channel
2. rate limits บน messages, connection limits
3. replay/resume semantics documented

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Endpoint/Channel`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี evidence: handler file + line
- missing signature verify / unbounded retries = High

## Expected Outcome

- Webhook/realtime findings พร้อม delivery-safety notes
- แยก producer vs consumer responsibilities ชัด

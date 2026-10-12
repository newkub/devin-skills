---
name: improve-events
description: หา event-driven improvements ใน scope — schemas, ordering, idempotency, DLQ — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - improve-backend
  - deep-review
  - deep-review-then-fix
  - follow-event-driven
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "events/messaging improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-events` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "events/queues ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-events` — event schemas, versioning, ordering guarantees, idempotency, at-least-once semantics, DLQ handling, consumer lag, retry policies
- service boundaries/handlers → `/improve-backend`; crash/recovery กว้าง → `/improve-stability`; architecture pattern → `/follow-event-driven`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-events` — missing idempotency keys, no DLQ, schema drift, ordering assumptions, poison messages, missing retry backoff
3. รวบรวม prioritized list พร้อม severity และ evidence — data-loss risks เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-events`)
2. Schema changes ต้อง backward compatible — version events ก่อนเปลี่ยน shape
3. Pattern guidance → `/follow-event-driven`
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-events`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม assume exactly-once — design for at-least-once + idempotent consumers เสมอ
- Event schema changes ต้องไม่ break consumers เดิม
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized events improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` — idempotency + DLQ ครบทุก consumer

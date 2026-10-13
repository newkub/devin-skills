---
name: improve-scheduled-jobs
description: หา scheduled job improvements — cron reliability, missed runs, overlap — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-queues
  - improve-events
  - improve-stability
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "scheduled jobs improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend + review-stability` (scheduler scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "cron/scheduled jobs ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` (scheduler scope) — schedule definitions (DST-safe), single-instance lock/overlap prevention, misfire policy, retry ต่อ run, observability (last-run, duration, missed-run alerts)
- `review-stability` (scheduler scope) — crash-safe resume, idempotent run bodies, dead-man switch เมื่อ job หยุดเงียบ
- background job processing/worker pools → `/improve-queues`; messaging semantics → `/improve-events`; platform cron ของ Cloudflare/Actions → skill service ที่ตรง
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend + review-stability` (scheduler scope) — job ซ้ำจาก overlap, ไม่มี alert เมื่อไม่รัน, cron time ambiguity
3. รวบรวม prioritized list พร้อม severity และ evidence — job ที่รันซ้ำแล้วเขียนข้อมูลพังเป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก job body ที่แก้ต้อง prove idempotency (รันซ้ำ 2 ครั้ง = ผลเท่ารันครั้งเดียว) ผ่าน `/test-integration`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามปิด overlap-lock เพื่อ "ให้รันทัน" — แก้ที่ duration แทน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized scheduled-jobs improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม idempotency + missed-run evidence

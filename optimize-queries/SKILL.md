---
name: optimize-queries
description: หา query optimization ใน scope — N+1, missing indexes, slow queries, over-fetching — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-database
  - optimize-perf
  - deep-review
  - deep-review-then-fix
  - follow-lib-drizzle
  - follow-tool-drizzle-kit
  - run-profiler
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "queries optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-database` เฉพาะ query performance เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "database queries ควร optimize อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-database` (query scope) — N+1 patterns, missing/unused indexes, full table scans, over-fetching (`SELECT *`), unbounded queries, transaction scope ใหญ่เกิน
- schema design/migrations → `/improve-database`; API-level latency → `/optimize-perf`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-database` scope queries — N+1 ใน loops, missing indexes บน hot filters/joins, unbounded result sets, missing pagination
3. รวบรวม prioritized list พร้อม severity และ evidence — ใช้ query plans (`EXPLAIN`) เป็น evidence เมื่อทำได้

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — query timing/EXPLAIN ของ slow queries ผ่าน `/run-profiler` หรือ DB logs
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-database`) — index additions ผ่าน migration (`/follow-tool-drizzle-kit` หรือ ORM ของ project) ห้ามแก้ DB มือ
3. วัดซ้ำแล้ว `/report-before-after` — ถ้าไม่เร็วขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-database` (query scope)
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ เปลี่ยน results — query ต้องคืนข้อมูลเดิม; verify ด้วย existing tests + EXPLAIN diff
- Index changes ผ่าน migration เท่านั้น — ห้าม manual DB edits
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized query optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after query timings

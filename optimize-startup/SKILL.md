---
name: optimize-startup
description: หา startup optimization ใน scope — cold start, boot time, init blocking, lazy loading — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - optimize-perf
  - optimize-bundle
  - improve-mobile-app
  - improve-desktop-app
  - deep-review
  - deep-review-then-fix
  - run-profiler
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "startup optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-performance` เฉพาะ startup/boot เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "startup/boot time ควร optimize อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-performance` (startup scope) — cold start latency, blocking init work, eager imports, eager connections, main-thread blocking บน boot, missing lazy loading/defer, serverless cold start
- runtime perf ทั่วไป → `/optimize-perf`; bundle weight ที่กระทบ startup → `/optimize-bundle`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-performance` scope startup — eager work ที่ควร defer, blocking I/O ใน init path, heavy imports ที่ entry, connection warmup ที่ไม่จำเป็น
3. รวบรวม prioritized list พร้อม severity และ evidence — ใช้ `/run-profiler` หรือ trace timestamps บน boot เป็น baseline

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — time-to-ready/time-to-interactive เดิม
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-performance`) — แก้ทีละจุด impact มาก→น้อย
3. วัดซ้ำแล้ว `/report-before-after` — ถ้าไม่เร็วขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-performance` (startup scope)
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ เปลี่ยน behavior — app ต้อง ready ครบเหมือนเดิม; deferred work ต้องเสร็จก่อนใช้จริง
- ห้าม lazy-load สิ่งที่ critical path ต้องการทันที — measure ก่อน defer
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized startup optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after startup timings

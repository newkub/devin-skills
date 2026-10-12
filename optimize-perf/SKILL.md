---
name: optimize-perf
description: หา performance optimization ใน scope — rendering, API, DB, memory — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - optimize-queries
  - optimize-network
  - optimize-startup
  - deep-review
  - deep-review-then-fix
  - deep-optimize
  - run-bench
  - follow-tool-unlighthouse
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
  - test-load
---

## Goal

ตอบคำถาม "performance improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-performance` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "performance ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-performance` — rendering perf, API latency, DB query perf, memory, hot paths
- scoped findings → domain เฉพาะทาง: DB queries → `/optimize-queries`; network/payloads → `/optimize-network`; cold start/boot → `/optimize-startup`

### Tools And Libraries

ใช้ตอน review และ fix findings ที่เกี่ยวข้อง:

| Skill | ใช้เมื่อ |
|-------|----------|
| `/follow-tool-unlighthouse` | วัด CWV/performance scores site-wide ทุก route เป็น baseline ก่อน fix และ evidence หลัง fix |

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-performance`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — `/run-bench` หรือ `/deep-optimize` เก็บ metrics เดิม
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง) — แก้ทีละจุด impact มาก→น้อย preserve behavior
3. วัดซ้ำแล้ว `/report-before-after` — ถ้าไม่ดีขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-performance`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ เปลี่ยน output — preserve behavior เสมอ; ไม่ดีขึ้น → revert
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง
- ใช้ /test-load วัด baseline/before-after ของ perf fixes

## Expected Outcome

- Prioritized improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after metrics

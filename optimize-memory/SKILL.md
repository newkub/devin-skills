---
name: optimize-memory
description: หา memory optimization opportunities ใน scope รวม findings แล้วแก้ผ่าน deep-review Fix ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - deep-optimize
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "memory optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-performance` (memory dimension) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "memory optimize อะไรได้" — thin entry point ที่ delegate การ review ไป `/deep-review` (domain `review-performance` scope memory) ไม่ทำ review เองและไม่แก้ไขโดยตรง

- allocation hotspots, memory leaks, large object retention, unbounded growth (cache/listeners/subscriptions), buffer/copy overhead
- ถ้าต้องการ broad optimization ทุก dimension → `/deep-optimize`; เจาะจง bottleneck จุดเดียว → `/deep-optimize`

## Execute

### 1. Review Memory

> Goal: ได้ prioritized memory findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-performance` scope `memory` — allocation patterns, leaks, retention, unbounded structures, serialization overhead
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง memory improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-performance`)
2. วัดผลก่อน/หลังเมื่อแก้ memory — baseline vs after ใน report
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-performance` scope `memory`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimization ต้องมี measurable impact — ไม่มี evidence ของ memory pressure ไม่แนะนำ micro-optimizations
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized memory optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after measurement

---
name: optimize-perf
description: หา performance optimization ใน scope — rendering, API, DB, memory — รวม findings แล้วแก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - deep-optimize
  - run-bench
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "performance improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-performance` เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "performance ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-performance` — rendering perf, API latency, DB query perf, memory, hot paths

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-performance`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหน — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. วัด baseline ก่อนแก้เสมอ — `/run-bench` หรือ `/deep-optimize` เก็บ metrics เดิม
2. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain ที่ตรง) — แก้ทีละจุด impact มาก→น้อย preserve behavior
3. วัดซ้ำแล้ว `/report-before-after` — ถ้าไม่ดีขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-performance`
- ไม่แก้ไขโดยไม่ได้ user confirm
- optimize ≠ เปลี่ยน output — preserve behavior เสมอ; ไม่ดีขึ้น → revert
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized improvement list จาก `/deep-review`
- User เลือกสิ่งที่จะแก้
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after metrics

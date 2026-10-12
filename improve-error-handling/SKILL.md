---
name: improve-error-handling
description: หา error handling improvements ใน scope — error paths, messages, retries, recovery — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - improve-code-quality
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "error handling improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-stability` (scope error handling) + `review-code-quality` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "error handling ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-stability` (error-handling scope) — missing try/catch boundaries, swallowed errors, missing retries/timeouts, unhandled rejections, crash paths
- `review-code-quality` (error-handling scope) — error types/taxonomy, error messages quality, error propagation consistency, logging on failure
- stability/reliability กว้างกว่า error handling → `/improve-stability` แทน

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-stability` + `review-code-quality` (scope error handling)
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก error-path fix ต้องมี failure-mode test — ห้ามแก้ error handling แบบไม่มี coverage ทดสอบ
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม swallow errors หรือแก้โดยการ catch-then-ignore
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized error-handling improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม failure-mode tests

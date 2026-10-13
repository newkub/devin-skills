---
name: improve-code-quality
description: หา code quality improvements — readability, consistency, smells, duplication — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-error-handling
  - improve-correctness
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - improve-typesafe
---

## Goal

ตอบคำถาม "code quality improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-code-quality` + `review-redundancy` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "code quality ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-code-quality` — readability, naming, consistency, code smells, complexity
- `review-redundancy` — duplication, dead code, redundant abstractions
- error-handling quality (error paths, messages, recovery) → `/improve-error-handling`
- correctness (bugs, logic errors, expected-vs-actual) → `/improve-correctness`
- datetime/timezone correctness → `/improve-datetime`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-code-quality` + `review-redundancy`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. Error-handling findings → ส่งต่อ `/improve-error-handling`; correctness findings → ส่งต่อ `/improve-correctness`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-code-quality` + `review-redundancy`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`

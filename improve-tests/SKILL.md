---
name: improve-tests
description: หา test improvements ใน scope — coverage, unit/e2e/integration, flaky — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - deep-test
  - run-test
  - update-tests
  - report
  - suggest-next-action
  - ask-me
  - test-coverage
  - test-mutation
  - test-property
---

## Goal

ตอบคำถาม "tests improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-test` + `review-coverage` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "tests ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-test` — test strategy, test case quality, unit/integration/e2e pyramid balance, isolation, flaky, test results
- `review-coverage` — coverage gaps, uncovered paths/branches, coverage targets
- รัน tests จริง → `/run-test all`; deep analysis ต่อ domain → `/deep-test`; เขียน/แก้ test specs → `/update-tests`
- flaky detection/quarantine → `/check-flaky-tests`; fixtures/factories/seeds → `/improve-test-data`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-test` + `review-coverage` — coverage gaps, pyramid balance (unit/integration/e2e), edge cases, isolation, flaky
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง test improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. test specs → `/update-tests`; coverage push → `review-test` workflow `improve-coverage`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-test`/`review-coverage`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง
- ใช้ /test-coverage วน gap-closing, /test-mutation วัด assertion strength, /test-property สำหรับ invariants

## Expected Outcome

- Prioritized test improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`/`/update-tests`

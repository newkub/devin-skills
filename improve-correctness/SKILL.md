---
name: improve-correctness
description: หา correctness improvements ใน scope — bugs, logic errors, edge cases, contract violations — แก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - improve-code-quality
  - improve-tests
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "correctness improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-code-quality` (correctness scope) + `review-data-validation` + `review-test` (test-correctness scope) เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "correctness ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-code-quality` (correctness scope) — bug-prone patterns, logic errors, wrong conditionals, off-by-one, null/undefined handling, incorrect algorithms
- `review-data-validation` — validation gaps ที่ทำให้ bad data หลุดเข้าระบบ, schema/contract violations, wrong type coercion
- `review-test` (test-correctness scope) — assertions ไม่ตรง spec, tests ที่ผ่านแต่ไม่ verify behavior จริง
- code quality ทั่วไป (readability, naming, smells) → `/improve-code-quality`; test coverage gaps → `/improve-tests`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-code-quality` + `review-data-validation` + `review-test` (scope correctness)
3. รวบรวม prioritized list พร้อม severity และ evidence — ทุก finding ต้องมี expected-vs-actual behavior

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง improvements: No., Finding, Expected vs Actual, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหน — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก correctness fix ต้องมี regression test ที่ fail ก่อนแก้และผ่านหลังแก้ — ห้ามแก้โดยไม่มี test พิสูจน์
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- ไม่แก้ไขโดยไม่ได้ user confirm
- ทุก fix ต้องมาพร้อม regression test ผ่าน `/update-tests` — evidence ว่า bug แก้จริง
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized correctness improvement list จาก `/deep-review` พร้อม expected-vs-actual ต่อ finding
- User เลือกสิ่งที่จะแก้
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix` พร้อม regression tests

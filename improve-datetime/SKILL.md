---
name: improve-datetime
description: หา datetime improvements — timezone, DST, UTC normalization, calendar math — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-i18n
  - improve-correctness
  - improve-data-validation
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "datetime improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-code-quality + review-data-validation` (temporal scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "date/time handling ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-code-quality` (temporal scope) — naive datetime leaks, local-time persistence, DST-boundary arithmetic, month/year rollover bugs, `Date` misuse
- `review-data-validation` (temporal scope) — ISO-8601 parsing/serialization consistency, range validation, timezone-aware column types
- locale-aware display/formatting → `/improve-i18n`; logic bug ทั่วไป → `/improve-correctness`; DB column type design → `/improve-database`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-code-quality + review-data-validation` (temporal scope) — สแกน usage ของ `Date`, timestamp columns, scheduling expressions
3. รวบรวม prioritized list พร้อม severity และ evidence — เวลาที่ผิดใน billing/schedule เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ใช้ lib ตาม project ผ่าน `/follow-lib-remedajs` (หรือ canonical ที่ `/follow-tool-formatter` เลือกไว้) — ห้าม roll datetime math เอง
3. ทุก fix ต้องมี DST-boundary test (เช่น 25 Oct/29 Mar windows)
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- เก็บ UTC ใน storage, convert ที่ presentation layer เท่านั้น
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized datetime improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม DST-boundary tests

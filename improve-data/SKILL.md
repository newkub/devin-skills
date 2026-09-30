---
name: improve-data
description: หา data improvements ใน scope — validation, integrity, contracts — รวม findings แล้วแก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - improve-database
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "data improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-data-validation` เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "ควร improve data อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-data-validation` — input/output validation, schema contracts, boundary checks, data integrity
- ORM, schema, query perf, indexes, migrations → `/improve-database`

## Execute

### 1. Review Data

> Goal: ได้ prioritized data findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-data-validation` — validation coverage, schema contracts, boundary checks, data integrity
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง data improvements: No., Finding, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหน — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain ที่ตรง)
2. migration/schema changes ต้องมี rollback path ก่อน apply
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-data-validation` (database → `/improve-database`)
- ไม่แก้ไขโดยไม่ได้ user confirm — schema/migration changes เสนอ rollback plan เสมอ
- ห้าม destructive data operations โดยไม่มี backup/rollback
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized data improvement list จาก `/deep-review`
- User เลือกสิ่งที่จะแก้
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix` พร้อม rollback path สำหรับ schema changes

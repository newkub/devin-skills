---
name: review-api-update-contract
description: Reconcile API contract drift — sync spec↔impl, regenerate, verify diff สะอาด
argument-hint: "[spec-or-scope]"
related:
  - review-api
  - review-api
  - review-api
  - review-api
  - ask-me
  - report-before-after
---

## Goal

แก้ contract findings จาก `/review-api` จริง — sync spec กับ implementation, แก้ versioning inconsistency — verify ด้วย contract diff ซ้ำ

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: spec↔impl drift, missing endpoints ใน spec, versioning scheme unify, deprecation notices
- ไม่รวม: routine validation/error fixes → parent `## Fix`

## Execute

### 1. Baseline

> Goal: รู้ drift ทั้งหมดก่อนแก้

1. ทำ `/review-api` — บันทึก drift list ทั้งหมดเป็น baseline
2. แยกแต่ละ drift: `spec-bug` (spec ผิด impl ถูก) vs `impl-bug` (impl ผิด spec ถูก) vs `undecided`
3. `undecided` → `/ask-me` — ยึด contract ที่ clients ใช้จริงเป็น source of truth

### 2. Reconcile

> Goal: spec และ impl ตรงกัน

1. spec-bug → แก้ spec (OpenAPI/proto/schema) ให้ตรง impl จริง
2. impl-bug → แก้ implementation ให้ตรง contract ที่ client พึ่งพา
3. missing endpoints → เพิ่มใน spec พร้อม schemas; dead spec entries → ลบหลัง confirm
4. versioning: unify scheme ตาม convention เดิม, breaking → version ใหม่ + `Deprecation`/`Sunset` headers + timeline

### 3. Verify

> Goal: diff สะอาด ไม่ break clients

1. `/review-api` ซ้ำ — diff เหลือเฉพาะ intended changes
2. `/review-api` — breaking changes ต้องมี version bump หรือ deprecation path
3. contract tests/`/run-test` ผ่าน + `/report-before-after` drift count

## Rules

- ยึด contract ที่ clients ใช้จริงเป็น truth — ห้ามแก้ impl ตาม spec ที่ตายแล้ว
- breaking change ต้องมี migration path — ห้าม remove/rename โดยไม่มี version/deprecation
- แยก commit: spec-sync → impl-fix → versioning

## Expected Outcome

- Contract diff สะอาด — spec ตรง impl ทุก endpoint
- Breaking changes มี version/deprecation path ครบ

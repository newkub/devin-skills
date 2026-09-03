---
name: review-app-usage
description: ตรวจสอบ usage.kdl spec และ USAGE.md ก่อน update-usage-md แก้ไข
related:
  - report-table
  - suggest-next-action
  - update-usage-md
---

## Goal

Review `usage.kdl` (KDL source spec) และ `USAGE.md` (generated markdown docs) ก่อนเรียก `update-usage-md` เพื่อยืนยันว่า syntax, metadata, flags, args, commands, effects, version และ generated docs ครบถ้วนและถูกต้อง

## Scope

ใช้ก่อนเรียก `update-usage-md` — ตรวจ `usage.kdl` structure, syntax, coverage และ `USAGE.md` freshness ทำ review เท่านั้น ไม่แก้ไข spec ระหว่าง review

## Execute

### 1. Prepare Context
> Goal: เตรียม Context
ทำตาม [references/prepare-context.md](references/prepare-context.md)

### 2. Check Syntax
> Goal: ตรวจสอบ Syntax
ทำตาม [references/syntax.md](references/syntax.md)

### 3. Check Metadata
> Goal: ตรวจสอบ Metadata
ทำตาม [references/metadata.md](references/metadata.md)

### 4. Check Flags And Args
> Goal: ตรวจสอบ Flags And Args
ทำตาม [references/flags-and-args.md](references/flags-and-args.md)

### 5. Check Commands
> Goal: ตรวจสอบ Commands
ทำตาม [references/commands.md](references/commands.md)

### 6. Check Coverage
> Goal: ตรวจสอบ Coverage
ทำตาม [references/coverage.md](references/coverage.md)

### 7. Check USAGE.md Freshness
> Goal: ตรวจสอบ USAGE md Freshness
ทำตาม [references/usage-md-freshness.md](references/usage-md-freshness.md)

### 8. Score And Report
> Goal: รายงาน Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ทำ review เท่านั้น ไม่แก้ไข `usage.kdl` ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-usage-md` หลัง review
- ทุก finding ต้องมี file path และ evidence
- ใช้ `Critical / High / Medium / Low / Info` สำหรับ severity
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- รายงาน Usage Spec Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action
- ยืนยัน syntax, metadata, flags, args, commands, effects ครบถ้วน
- ยืนยัน spec ครอบคลุม CLI จริง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

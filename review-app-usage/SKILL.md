---
name: review-app-usage
description: ตรวจสอบ usage.kdl spec และ USAGE.md ก่อน update-usage-md แก้ไข
---

## Goal

Review `usage.kdl` (KDL source spec) และ `USAGE.md` (generated markdown docs) ก่อนเรียก `update-usage-md` เพื่อยืนยันว่า syntax, metadata, flags, args, commands, effects, version และ generated docs ครบถ้วนและถูกต้อง

## Scope

ใช้ก่อนเรียก `update-usage-md` — ตรวจ `usage.kdl` structure, syntax, coverage และ `USAGE.md` freshness ทำ review เท่านั้น ไม่แก้ไข spec ระหว่าง review

## Execute

### 1. Prepare Context

> Goal: เข้าใจ CLI และ spec target

1. ตรวจว่า `usage.kdl` มีอยู่ ถ้าไม่ → flag เป็น critical
2. ระบุ CLI entry point (`src/presentation/cli.ts` หรือ equivalent)
3. อ่าน `package.json` เพื่อดู `name`, `version`, `bin`

### 2. Check Syntax

> Goal: `usage.kdl` ผ่าน KDL syntax validation

1. ดูรายละเอียดใน [references/syntax.md](references/syntax.md)
2. บันทึก findings พร้อม severity

### 3. Check Metadata

> Goal: metadata ครบถ้วนและถูกต้อง

1. ดูรายละเอียดใน [references/metadata.md](references/metadata.md)
2. บันทึก findings พร้อม evidence

### 4. Check Flags And Args

> Goal: flags และ args ครบถ้วน มี help

1. ดูรายละเอียดใน [references/flags-and-args.md](references/flags-and-args.md)
2. บันทึก missing, duplicate, type mismatch

### 5. Check Commands

> Goal: commands ครบถ้วน มี help และ effect

1. ดูรายละเอียดใน [references/commands.md](references/commands.md)
2. บันทึก command help, effect, subcommand ที่ขาด

### 6. Check Coverage

> Goal: spec ครอบคลุม CLI จริง

1. ดูรายละเอียดใน [references/coverage.md](references/coverage.md)
2. บันทึก missing/extra items

### 7. Check USAGE.md Freshness

> Goal: `USAGE.md` ตรงกับ `usage.kdl`

1. ดูรายละเอียดใน [references/usage-md-freshness.md](references/usage-md-freshness.md)
2. บันทึก stale docs เป็น Medium ถ้า diff

### 8. Score And Report

> Goal: สรุป review score และ findings

1. ดูรายละเอียดเกณฑ์คะแนนใน [references/scoring.md](references/scoring.md)
2. คำนวณ review score และ grade
3. ทำ `/report-table` พร้อม findings
4. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข `usage.kdl` ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-usage-md` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี `usage.kdl`, syntax invalid, ขาด metadata จำเป็น
- `High`: ขาด `effect`, ขาด `help`, version ไม่ตรง
- `Medium`: flag/arg ขาดใน spec, extra items ใน spec
- `Low`: type ไม่ตรง, short flag ขาด
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-usage-md` ก่อนดำเนินการ

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Usage Spec Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน syntax, metadata, flags, args, commands, effects ครบถ้วน
- ยืนยัน spec ครอบคลุม CLI จริง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

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

1. รัน `usage parse usage.kdl` เพื่อ validate syntax
2. ถ้า parse ไม่ผ่าน → flag เป็น critical พร้อม error message
3. ตรวจว่า KDL structure ถูกต้อง: nodes, attributes, values
4. บันทึก findings พร้อม evidence

### 3. Check Metadata

> Goal: metadata ครบถ้วนและถูกต้อง

1. ตรวจว่ามี `name`, `bin`, `about`, `version`, `author`, `license`
2. ตรวจว่า `name` ตรงกับ `package.json` name
3. ตรวจว่า `version` ตรงกับ `package.json` version
4. ตรวจว่า `bin` ตรงกับ `package.json` bin field
5. บันทึก findings พร้อม evidence

### 4. Check Flags And Args

> Goal: flags และ args ครบถ้วน มี help

1. ตรวจว่าทุก `flag` มี `help` และ `short` (ถ้ามี)
2. ตรวจว่าทุก `arg` มี `help` และ `required` หรือ `optional`
3. ตรวจว่า flag types ถูกต้อง (`string`, `bool`, `int`, `counter`)
4. ตรวจว่าไม่มี flag/arg ซ้ำชื่อ
5. บันทึก findings พร้อม evidence

### 5. Check Commands

> Goal: commands ครบถ้วน มี help และ effect

1. ตรวจว่าทุก `cmd` มี `help`
2. ตรวจว่าทุก `cmd` มี `effect` (`read`, `write`, `destructive`)
3. ตรวจว่า subcommands มี structure ที่ถูกต้อง
4. ตรวจว่าไม่มี command ซ้ำชื่อ
5. บันทึก findings พร้อม evidence

### 6. Check Coverage

> Goal: spec ครอบคลุม CLI จริง

1. เปรียบเทียบ flags ใน `usage.kdl` กับ CLI จริง
2. เปรียบเทียบ args ใน `usage.kdl` กับ CLI จริง
3. เปรียบเทียบ commands ใน `usage.kdl` กับ CLI จริง
4. ระบุ missing หรือ extra items
5. บันทึก findings พร้อม evidence

### 7. Check USAGE.md Freshness

> Goal: `USAGE.md` ตรงกับ `usage.kdl`

1. ตรวจว่า `USAGE.md` มีอยู่ ถ้าไม่ → flag เป็น High
2. รัน `usage generate markdown -f usage.kdl` แล้วเปรียบเทียบกับ `USAGE.md` ที่มี
3. ถ้า diff → flag เป็น Medium (stale docs)
4. ตรวจว่า `USAGE.md` ไม่เกิน 250 บรรทัด
5. บันทึก findings พร้อม evidence

### 8. Score And Report

> Goal: สรุป review score และ findings

ดู `references/scoring.md` สำหรับ severity weights และ grade mapping

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข `usage.kdl` ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-usage-md` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี `usage.kdl`, syntax invalid, ขาด metadata จำเป็น
- `High`: ขาด `effect`, ขาว `help`, version ไม่ตรง
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

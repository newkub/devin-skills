---
name: watch-browser-console-report-status
description: สร้าง console watch report — errors/warnings grouped, new vs recurring, source locations
argument-hint: "[session-or-url]"
related:
  - report
  - use-agent-browser
  - resolve-errors
---

## Goal

แปลง console watch session ของ `/watch-browser-console` เป็น report — console messages grouped, new vs recurring errors

## Scope

- ใช้เมื่อ `/watch-browser-console` dispatch มาที่ `report`/`status` หรือเรียกหลัง watch จบ
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Console Messages

> Goal: รวม messages จาก session

1. รวม console errors/warnings/logs พร้อม timestamps และ source (file:line ถ้ามี)
2. group by message signature — count recurrences
3. แยก new errors (เพิ่งเกิด) จาก recurring (มีตลอด)

### 2. Build Report

> Goal: ตอบว่า console สะอาดแค่ไหน

1. ตาราง: `No.`, `Message`, `Level`, `Count`, `Source`, `Status`
2. Status: `new` / `recurring` / `resolved`
3. Browser/extension noise แยกออก (non-app errors)

### 3. Verdict

> Goal: สรุปและชี้ action

1. Verdict: `clean` / `warnings-only` / `errors-found`
2. New errors → แนะนำ `/resolve-errors`; recurring → flag เป็น known issue ถ้า benign
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- group by message signature — ไม่ list ทุก occurrence
- แยก app errors จาก browser/extension noise เสมอ
- stack traces เก็บเป็น reference ไม่ inline ทั้งหมด

## Expected Outcome

- Console report พร้อม grouped messages + new/recurring split + verdict

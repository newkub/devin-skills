---
name: watch-browser-fix-report-status
description: สร้าง fix watch report — issues found vs fixed, before/after evidence
argument-hint: "[session-or-url]"
related:
  - report
  - create-report-in-dot-devin
  - use-agent-browser
---

## Goal

แปลง session ของ `/watch-browser-fix` เป็น report — issues ที่พบ vs ที่แก้สำเร็จ พร้อม before/after evidence

## Scope

- ใช้เมื่อ `/watch-browser-fix` dispatch มาที่ `report`/`status` หรือเรียกหลัง session จบ
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Fix Results

> Goal: รวม issues + fix outcomes

1. รวม issues ที่พบตอน watch + fixes ที่ apply
2. ต่อ issue: status (fixed/partial/failed/skipped), fix applied, verification result
3. รวม before/after screenshots หรือ evidence ต่อ fix

### 2. Build Report

> Goal: ตอบว่าแก้ได้แค่ไหน เหลืออะไร

1. ตาราง: `No.`, `Issue`, `Fix`, `Status`, `Evidence`
2. Summary counts: fixed/total, regressions introduced (ต้องเป็น 0)
3. remaining issues → list แยกพร้อมเหตุผล

### 3. Verdict

> Goal: ตัดสินความสำเร็จของ fix pass

1. Verdict: `all-fixed` / `partial` / `regressed`
2. regressions → flag เด่นสุด — อาจต้อง revert
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- fixed = verify แล้วเท่านั้น — re-check จริงใน browser ไม่ใช่แค่ apply
- regression = severity สูงสุดใน report
- evidence เป็น paths/screenshots จริง

## Expected Outcome

- Fix report พร้อม fixed/remaining split + regression check

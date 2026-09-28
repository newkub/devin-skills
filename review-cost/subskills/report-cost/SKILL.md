---
name: review-cost-report-cost
description: สร้าง cost report — per-service breakdown, waste estimate, savings ranked
argument-hint: "[service-or-resource]"
related:
  - report
  - create-report-in-dot-devin
  - run-review
---

## Goal

แปลง cost findings ของ `/review-cost` เป็น cost report — per-service breakdown + waste estimate + savings เรียงตาม impact ที่ FinOps/stakeholder ใช้ได้

## Scope

- ใช้เมื่อ `/review-cost` dispatch มาที่ `report`/`cost` หรือเรียก standalone กับ billing/usage data ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Build Cost Breakdown

> Goal: เห็นว่าเงินไปไหน

1. ตาราง: `No.`, `Service`, `Cost`, `% of Total`, `Trend`, `Notes`
2. จัดกลุ่ม: compute / storage / bandwidth / third-party / LLM token spend
3. ระบุ unit: per-month หรือตาม billing period ที่ใช้ — เขียนชัดในหัวตาราง

### 2. Waste And Savings Table

> Goal: savings เรียงตาม impact

1. ตาราง: `No.`, `Item`, `Current Cost`, `Est. Savings`, `Effort`, `Risk`, `Severity`
2. `Est. Savings` จาก usage metrics จริง — ห้ามเดา % ลอยๆ
3. `Effort`/`Risk`: Low/Medium/High — savings สูงแต่ risk สูงให้ flag ไว้

### 3. Summarize

> Goal: decision-ready verdict

1. total spend + total potential savings + top-3 actions
2. fix route → `../optimize-cost/SKILL.md` (sibling subskill ของ parent)
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- ทุกตัวเลขมาจาก billing/usage data — ห้าม estimate โดยไม่ระบุว่าเป็น estimate
- ทุก savings recommendation มี risk assessment — cost cut ที่เสี่ยงต้อง flag
- sensitive billing data → persistent artifact อยู่ใน `.devin/` เท่านั้น

## Expected Outcome

- Per-service cost breakdown + savings table เรียงตาม impact
- Top actions พร้อม effort/risk — decision-ready

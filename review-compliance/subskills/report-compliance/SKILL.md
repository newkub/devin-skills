---
name: review-compliance-report-compliance
description: สร้าง compliance matrix report — regulation × requirement status + gaps
argument-hint: "[regulation-or-scope]"
related:
  - review-compliance
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง compliance findings ของ `/review-compliance` เป็น regulation matrix — requirement ต่อข้อมี status ชัดเจน ใช้คุยกับ legal/auditor ได้

## Scope

- ใช้เมื่อ `/review-compliance` dispatch มาที่ `report`/`matrix` หรือเรียก standalone กับ findings
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Build Requirement Matrix

> Goal: regulation × requirement coverage

1. ตาราง: `No.`, `Regulation`, `Requirement`, `Status`, `Evidence`, `Gap Action`
2. `Status` = compliant/partial/missing/not-applicable — partial ต้องระบุส่วนที่ขาด
3. จัดกลุ่มตาม regulation ที่ apply จริง (ไม่ใส่ regulation ที่ scope ไม่เกี่ยว)

### 2. Gap Summary

> Goal: priorities ตาม risk

1. missing requirements ที่เป็น legal blocker — เรียง severity
2. evidence gaps — requirement ที่ทำแล้วแต่ prove ไม่ได้ (audit trail, records)
3. recommended actions + fix route → parent `## Fix`

### 3. Export

> Goal: artifact ที่ auditor/legal ใช้ได้

1. สรุป posture ต่อ regulation: counts per status
2. `/create-report-in-dot-devin` สำหรับ persistent artifact — อยู่ใน `.devin/` เท่านั้น

## Rules

- matrix derive จาก findings จริง — ห้ามเดา status
- `not-applicable` ต้องมี justification
- technical gaps only — flag ข้อที่ต้อง legal interpretation แยก

## Expected Outcome

- Requirement matrix per regulation พร้อม status + evidence
- Gap list prioritized พร้อม legal-review flags

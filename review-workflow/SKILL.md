---
name: review-workflow
description: Review workflow ให้เร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ ไม่ซ้ำซ้อน และไม่เกิน scope
argument-hint: "[workflow-or-skill]"
related:
  - review-devin-global-skills
  - update-devin-global-skills
  - simplify
  - review-redundancy
  - review-consistency
  - deep-validate
  - report-table
  - suggest-next-action
  - consider-use-subagents
  - follow-parallel
---

## Goal

Review workflow ใดๆ แล้วปรับปรุงให้ทำงานรวดเร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ ไม่ซ้ำซ้อน และไม่เกิน scope

## Scope

ใช้สำหรับ workflow, skill, process หรือ script ใดๆ ทีต้องตรวจสอบ flow ให้ดีขึ้น

## Execute

### 1. Read Flow
ทำตาม [references/read-flow.md](references/read-flow.md)

### 2. Check Speed
ทำตาม [references/check-speed.md](references/check-speed.md)

### 3. Check Safety
ทำตาม [references/check-safety.md](references/check-safety.md)

### 4. Check Usability
ทำตาม [references/check-usability.md](references/check-usability.md)

### 5. Check Efficiency
ทำตาม [references/check-efficiency.md](references/check-efficiency.md)

### 6. Remove Redundancy
ทำตาม [references/remove-redundancy.md](references/remove-redundancy.md)

### 7. Report
ทำตาม [references/report.md](references/report.md)

### 8. Validate
ทำตาม [references/validate.md](references/validate.md)

### 9. Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ไม่เพิ่ม complexity โดยไม่จำเป็น
- รักษา backward compatibility ถ้ามีผู้ใช้งานเดิม
- แยก flow ออกเป็นย่อยถ้า SRP ไม่ชัด
- ใช้ existing skills แทนการ duplicate logic
- ถ้ามี destructive change → ต้อง dry-run ก่อน
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

- ใช้ /review-devin-global-skills ถ้าจำเป็น
- ใช้ /update-devin-global-skills ถ้าจำเป็น
- ใช้ /simplify ถ้าจำเป็น
- ใช้ /review-redundancy ถ้าจำเป็น
- ใช้ /review-consistency ถ้าจำเป็น
- ใช้ /consider-use-subagents ถ้าจำเป็น
- ใช้ /follow-parallel ถ้าจำเป็น

## Expected Outcome

- Flow ทำงานเร็วขึ้น ปลอดภัยขึ้น ใช้ง่ายขึ้น
- ไม่มี redundancy หรือ duplicated steps
- มี report ชัดเจนพร้อม recommendations
- ผ่าน `/deep-validate` หลังปรับปรุง

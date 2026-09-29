---
name: review-workflow
description: Review workflow ให้เร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ ไม่ซ้ำซ้อน และไม่เกิน scope
argument-hint: "[workflow-or-skill]"
related:
  - review-devin-global-harness
  - update-devin-global-skills
  - review-code-quality
  - deep-validate
  - suggest-next-action
  - use-subagents
  - follow-parallel
  - report
  - run-deploy
  - run-review

---

## Goal

Review workflow ใดๆ แล้วปรับปรุงให้ทำงานรวดเร็ว ปลอดภัย ใช้ง่าย มีประสิทธิภาพ ไม่ซ้ำซ้อน และไม่เกิน scope

## Scope

ใช้สำหรับ workflow, skill, process หรือ script ใดๆ ทีต้องตรวจสอบ flow ให้ดีขึ้น

## Execute

### 1. Read Flow
> Goal: อ่าน flow ปัจจุบัน
ทำตาม [subagents/workflow-reviewer/read-flow.md](subagents/workflow-reviewer/read-flow.md)

### 2. Check Speed
> Goal: ตรวจ speed
ทำตาม [subagents/workflow-reviewer/check-speed.md](subagents/workflow-reviewer/check-speed.md)

### 3. Check Safety
> Goal: ตรวจ safety
ทำตาม [subagents/workflow-reviewer/check-safety.md](subagents/workflow-reviewer/check-safety.md)

### 4. Check Usability
> Goal: ตรวจ usability
ทำตาม [subagents/workflow-reviewer/check-usability.md](subagents/workflow-reviewer/check-usability.md)

### 5. Check Efficiency
> Goal: ตรวจ efficiency
ทำตาม [subagents/workflow-reviewer/check-efficiency.md](subagents/workflow-reviewer/check-efficiency.md)

### 6. Remove Redundancy
> Goal: ลบ redundancy
ทำตาม [subagents/workflow-reviewer/remove-redundancy.md](subagents/workflow-reviewer/remove-redundancy.md)

### 7. Report
> Goal: รายงานผล
ทำตาม [subagents/workflow-reviewer/report.md](subagents/workflow-reviewer/report.md)

### 8. Validate
> Goal: ยืนยัน findings
ทำตาม [subagents/workflow-reviewer/validate.md](subagents/workflow-reviewer/validate.md)

### 9. Score And Report
> Goal: รายงาน score และสรุปผล
คำนวณ score/grade ตาม [subagents/workflow-reviewer/scoring.md](subagents/workflow-reviewer/scoring.md) แล้วทำ `/report` และ `/suggest-next-action` (workflow)

## Rules

- ไม่เพิ่ม complexity โดยไม่จำเป็น
- รักษา backward compatibility ถ้ามีผู้ใช้งานเดิม
- แยก flow ออกเป็นย่อยถ้า SRP ไม่ชัด
- ใช้ existing skills แทนการ duplicate logic
- ถ้ามี destructive change → ต้อง dry-run ก่อน
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (workflow)

- ใช้ /review-devin-global-harness ถ้าจำเป็น
- ใช้ /update-devin-global-skills ถ้าจำเป็น (workflow)
- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น
- ใช้ /follow-parallel ถ้าจำเป็น

## References

- [Full-dimension checklist](subagents/workflow-reviewer/checklist.md)
- [Read flow](subagents/workflow-reviewer/read-flow.md)
- [Check speed](subagents/workflow-reviewer/check-speed.md)
- [Check safety](subagents/workflow-reviewer/check-safety.md)
- [Check usability](subagents/workflow-reviewer/check-usability.md)
- [Check efficiency](subagents/workflow-reviewer/check-efficiency.md)
- [Remove redundancy](subagents/workflow-reviewer/remove-redundancy.md)
- [Scoring](subagents/workflow-reviewer/scoring.md)
- ใช้ /run-deploy ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. แก้ workflow ตาม findings: ลดขั้นตอนซ้ำ, แก้ steps ที่ช้า/ไม่ปลอดภัย, ตัดส่วนที่เกิน scope → `/refactor` structure scope
2. capability ที่ควรเป็น skill แยก → ส่งต่อ `/new-skills` หรือ merge ตาม `/idea-merge`
3. verify: `/deep-validate` workflow หลังแก้เทียบก่อน-หลัง

## Expected Outcome

- Flow ทำงานเร็วขึ้น ปลอดภัยขึ้น ใช้ง่ายขึ้น
- ไม่มี redundancy หรือ duplicated steps
- มี report ชัดเจนพร้อม recommendations
- ผ่าน `/deep-validate` หลังปรับปรุง

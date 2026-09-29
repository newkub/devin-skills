---
name: review-plan
description: Review plan quality ก่อน execute plan
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
  - plan
  - create-plan-in-dot-devin
  - implement-to-production
  - follow-plan
  - run-review

  - use-subagents
---

## Goal

Review plan quality ก่อน execution เพื่อยืนยันว่า risk assessment, dependency mapping, alternatives analysis, timeline feasibility, scope clarity, acceptance criteria, rollback plan และ resource requirements ครบถ้วน

## Scope

ใช้ก่อนเรียก `plan`, `plan`, `create-plan-in-dot-devin`, `implement-to-production` หรือ `follow-plan` — ตรวจ plan quality แล้วสรุป plan quality score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context
> Goal: เตรียม context
ทำตาม [subagents/plan-reviewer/prepare-context.md](subagents/plan-reviewer/prepare-context.md) (plan)

### 2. Assess Risks
> Goal: ประเมิน risks
ทำตาม [subagents/plan-reviewer/risk-assessment.md](subagents/plan-reviewer/risk-assessment.md)

### 3. Map Dependencies
> Goal: จัดกลุ่ม dependencies
ทำตาม [subagents/plan-reviewer/dependency-mapping.md](subagents/plan-reviewer/dependency-mapping.md)

### 4. Analyze Alternatives
> Goal: วิเคราะห์ alternatives
ทำตาม [subagents/plan-reviewer/alternatives.md](subagents/plan-reviewer/alternatives.md)

### 5. Check Feasibility
> Goal: ตรวจสอบ feasibility
ทำตาม [subagents/plan-reviewer/feasibility.md](subagents/plan-reviewer/feasibility.md)

### 6. Validate Scope And Acceptance
> Goal: validate scope และ acceptance criteria
ทำตาม [subagents/plan-reviewer/scope-acceptance.md](subagents/plan-reviewer/scope-acceptance.md)

### 7. Score And Report
> Goal: รายงาน score และสรุปผล
คำนวณ score/grade ตาม [subagents/plan-reviewer/scoring.md](subagents/plan-reviewer/scoring.md), [subagents/plan-reviewer/plan-quality-score.md](subagents/plan-reviewer/plan-quality-score.md) แล้วทำ `/report` และ `/suggest-next-action`

## Rules

- ทำ review เท่านั้น ไม่แก้ไข plan ระหว่าง review
- ถ้าต้องแก้ plan ให้ใช้ `plan` หรือ `plan` หลัง review
- ทุก finding ต้องมี evidence และ location
- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (plan)

- ถ้า pass → implement ตาม plan ถ้า fail → แก้ plan ให้ผ่านก่อน

- ใช้ /review-architecture ถ้าจำเป็น
- ใช้ /review-risk ถ้าจำเป็น

## References

- [Full-dimension checklist](subagents/plan-reviewer/checklist.md)
- [Risk assessment](subagents/plan-reviewer/risk-assessment.md)
- [Dependency mapping](subagents/plan-reviewer/dependency-mapping.md)
- [Alternatives](subagents/plan-reviewer/alternatives.md)
- [Feasibility](subagents/plan-reviewer/feasibility.md)
- [Scope and acceptance](subagents/plan-reviewer/scope-acceptance.md)
- [Scoring](subagents/plan-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. แก้ plan ตาม findings: เพิ่ม missing steps, แก้ dependency order, เพิ่ม mitigation ของ risks, ตัดงานที่เกิน scope
2. ถ้า verdict `go` → ทำ `/follow-plan` หรือ `/implement-to-production` ต่อ
3. verify: re-score plan หลังแก้เทียบกับ baseline
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- รายงาน Plan Quality Summary พร้อม score และ grade
- รายงาน Risk Assessment พร้อม mitigation
- รายงาน Dependency Map พร้อม critical path
- Go/no-go recommendation พร้อมเหตุผล
- Plan quality score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

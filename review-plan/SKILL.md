---
name: review-plan
description: Review plan quality ก่อน execute plan
---

## Goal

Review plan quality ก่อน execution เพื่อยืนยันว่า risk assessment, dependency mapping, alternatives analysis, timeline feasibility, scope clarity, acceptance criteria, rollback plan และ resource requirements ครบถ้วน

## Scope

ใช้ก่อนเรียก `plan`, `deep-plan`, `create-plan-in-dot-devin`, `implement-plan` หรือ `follow-plan` — ตรวจ plan quality แล้วสรุป plan quality score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context
ทำตาม [references/prepare-context.md](references/prepare-context.md)

### 2. Assess Risks
ทำตาม [references/risk-assessment.md](references/risk-assessment.md)

### 3. Map Dependencies
ทำตาม [references/dependency-mapping.md](references/dependency-mapping.md)

### 4. Analyze Alternatives
ทำตาม [references/alternatives.md](references/alternatives.md)

### 5. Check Feasibility
ทำตาม [references/feasibility.md](references/feasibility.md)

### 6. Validate Scope And Acceptance
ทำตาม [references/scope-acceptance.md](references/scope-acceptance.md)

### 7. Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md), [references/plan-quality-score.md](references/plan-quality-score.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ทำ review เท่านั้น ไม่แก้ไข plan ระหว่าง review
- ถ้าต้องแก้ plan ให้ใช้ `plan` หรือ `deep-plan` หลัง review
- ทุก finding ต้องมี evidence และ location
- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- รายงาน Plan Quality Summary พร้อม score และ grade
- รายงาน Risk Assessment พร้อม mitigation
- รายงาน Dependency Map พร้อม critical path
- Go/no-go recommendation พร้อมเหตุผล
- Plan quality score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

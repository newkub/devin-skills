---
name: review-plan
description: Review plan quality ก่อน execute plan
---

## Goal

Review plan quality ก่อน execution เพื่อยืนยันว่า risk assessment, dependency mapping, alternatives analysis, timeline feasibility, scope clarity, acceptance criteria, rollback plan และ resource requirements ครบถ้วน

## Scope

ใช้ก่อนเรียก `plan`, `deep-plan`, `create-plan-in-dot-devin`, `implement-plan`, หรือ `follow-plan` — ตรวจ plan quality ครอบคลุม risk, dependencies, alternatives, timeline, scope, acceptance criteria, rollback, resource requirements แล้วสรุป plan quality score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ plan scope และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ dependencies
2. ระบุ plan source: `.devin/plan/`, `.devin/tasks/`, `AGENTS.md`, หรือ chat report
3. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
4. ถ้าไม่พบ plan → stop และ report

### 2. Assess Risks

> Goal: ตรวจ risk assessment ครบถ้วน

Assess risk identification, probability, impact, mitigation, rollback, and stress testing. See [references/risk-assessment.md](references/risk-assessment.md).

### 3. Map Dependencies

> Goal: ตรวจ dependency mapping ถูกต้อง

Map task, module, and critical-path dependencies; check circular dependencies and parallelizable tasks. See [references/dependency-mapping.md](references/dependency-mapping.md).

### 4. Analyze Alternatives

> Goal: ตรวจ alternatives analysis ครบถ้วน

Check architectural decisions, library choices, implementation approaches, and trade-off documentation. See [references/alternatives.md](references/alternatives.md).

### 5. Check Feasibility

> Goal: ตรวจ timeline และ resource feasibility

Check timeline, milestones, effort estimates, resource requirements, and buffer ratio. See [references/feasibility.md](references/feasibility.md).

### 6. Validate Scope And Acceptance

> Goal: ตรวจ scope clarity และ acceptance criteria

Validate scope clarity, testable acceptance criteria, scope creep, and rollback plans. See [references/scope-acceptance.md](references/scope-acceptance.md).

### 7. Score And Report

> Goal: สรุป plan quality score และ go/no-go recommendation

1. คำนวณ plan quality score จาก [references/plan-quality-score.md](references/plan-quality-score.md)
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Plan Quality Summary: Category, Status, Findings, Score
4. สร้างตาราง Risk Assessment: Risk, Probability, Impact, Severity, Mitigation
5. สร้างตาราง Dependency Map: Task, Dependencies, Critical Path, Parallelizable
6. แสดง go/no-go recommendation พร้อมเหตุผล
7. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข plan ระหว่าง review
- ถ้าต้องแก้ plan ให้ใช้ `plan` หรือ `deep-plan` หลัง review
- ทุก finding ต้องมี evidence และ location

### 2. Evidence-Based Findings

- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ทุก finding ระบุ plan section, task, และ evidence
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Plan quality score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → No-Go แนะนำให้ปรับ plan ก่อน

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Plan Quality Summary พร้อม score และ grade
- รายงาน Risk Assessment พร้อม mitigation
- รายงาน Dependency Map พร้อม critical path
- Go/no-go recommendation พร้อมเหตุผล
- Plan quality score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

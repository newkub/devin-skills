---
name: review-plan
description: Review plan quality ก่อน execute plan
---

## Goal

Review plan quality ก่อน execution เพื่อยืนยันว่า risk assessment, dependency mapping, alternatives analysis, timeline feasibility, scope clarity, acceptance criteria, rollback plan และ resource requirements ครบถ้วน

## Scope

ใช้ก่อนเรียก `plan`, `deep-plan`, `create-plan-md-in-dot-devin`, `implement-plan`, หรือ `follow-plan` — ตรวจ plan quality ครอบคลุม risk, dependencies, alternatives, timeline, scope, acceptance criteria, rollback, resource requirements แล้วสรุป plan quality score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ plan scope และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ dependencies
2. ระบุ plan source: `.devin/plan/`, `.devin/tasks/`, `AGENTS.md`, หรือ chat report
3. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
4. ถ้าไม่พบ plan → stop และ report

### 2. Assess Risks

> Goal: ตรวจ risk assessment ครบถ้วน

1. ตรวจทุก task มี risk assessment: probability × impact
2. ตรวจ high-risk tasks มี mitigation plan และ rollback strategy
3. ตรวจ risks จัดลำดับตาม severity: Critical, High, Medium, Low
4. ตรวจ worst-case scenario ได้รับการจำลอง
5. ดูรายละเอียดใน [references/risk-assessment.md](references/risk-assessment.md)

### 3. Map Dependencies

> Goal: ตรวจ dependency mapping ถูกต้อง

1. ตรวจ dependencies ระหว่าง tasks ไม่มี circular
2. ตรวจ critical path ชัดเจนและไม่มี bottlenecks
3. ตรวจ parallelizable tasks ระบุชัดเจน
4. ตรวจ module boundaries และ dependency directions
5. ดูรายละเอียดใน [references/dependency-mapping.md](references/dependency-mapping.md)

### 4. Analyze Alternatives

> Goal: ตรวจ alternatives analysis ครบถ้วน

1. ตรวจ architectural decisions มี trade-off analysis
2. ตรวจมี alternatives ที่ปฏิเสธพร้อมเหตุผล
3. ตรวจ library choices มีเหตุผล: modern, type safety, performance, DX, maintenance
4. ตรวจไม่มี premature decisions ที่ข้าม alternatives
5. ดูรายละเอียดใน [references/alternatives.md](references/alternatives.md)

### 5. Check Feasibility

> Goal: ตรวจ timeline และ resource feasibility

1. ตรวจ timeline มี milestones พร้อม buffer
2. ตรวจ effort estimates สมเหตุสมผล: `S`, `M`, `L`, `XL`
3. ตรวจ resource requirements ระบุชัดเจน
4. ตรวจ buffer ratio เหมาะสม: `buffer / total`
5. ดูรายละเอียดใน [references/feasibility.md](references/feasibility.md)

### 6. Validate Scope And Acceptance

> Goal: ตรวจ scope clarity และ acceptance criteria

1. ตรวจ scope ชัดเจน ไม่กว้างเกินไป ไม่แคบเกินไป
2. ตรวจแต่ละ task มี acceptance criteria ที่ testable
3. ตรวจไม่มี scope creep หรือ missing tasks
4. ตรวจ rollback plan มีสำหรับ high-risk tasks

### 7. Score And Report

> Goal: สรุป plan quality score และ go/no-go recommendation

1. คำนวณ plan quality score จาก [references/plan-quality-score.md](references/plan-quality-score.md)
2. ทำ `/report` พร้อม `/report-markdown-table`
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
- รายงานเป็นตารางด้วย `/report-markdown-table`

## Expected Outcome

- รายงาน Plan Quality Summary พร้อม score และ grade
- รายงาน Risk Assessment พร้อม mitigation
- รายงาน Dependency Map พร้อม critical path
- Go/no-go recommendation พร้อมเหตุผล
- Plan quality score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

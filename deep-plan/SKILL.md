---
name: deep-plan
description: วางแผนละเอียดหลายมิติ ครอบคลุม risk, dependencies, alternatives, timeline
argument-hint: "[topic]"
---

## Goal

วางแผนละเอียดหลายมิติ: risk assessment, dependency map, alternatives, resource estimation, timeline พร้อม stress-test

## Scope

ใช้สำหรับวางแผนงานที่ซับซ้อนสูง ต้องการ comprehensive analysis ก่อน implement

สำหรับสำรวจ libraries ใช้ `/use-lib-better`

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ (Step N ขึ้นกับ Step N-1)

### 1. Review Codebase Everything

> Goal: Deep Review codebase ครบทุกมิติก่อนเริ่มวางแผน

1. ทำ `/update-review-codebase-cli-and-run` เพื่อ deep review ครบทุกมิติอย่างลึกซึ้ง พร้อม validate issues

### 2. Deep Analysis And Thinking

> Goal: ทำ `/deep-analyze`, `/deep-thinking`, `/deep-pondering`, `/deep-validate`, และ `/deep-research` เพื่อเตรียมการวางแผน

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ปัจจุบันหลายมิติ: architecture, quality, dependencies, risks
2. ทำ `/deep-thinking` เพื่อวางแผนการวางแผนอย่างเป็นระบบ
3. ทำ `/deep-pondering` เพื่อครุ่นคิด trade-offs, uncertainties, และ goal alignment
4. ทำ `/deep-validate` เพื่อ validate assumptions และ constraints
5. ทำ `/deep-research` สำหรับ tech stack และ architecture patterns ที่เกี่ยวข้อง
6. ระบุ scope, constraints, assumptions ของงาน
7. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม

### 3. Analyze Project

> Goal: Analyze Project

ทำ `/analyze-project` เพื่อวิเคราะห์ project structure และ dependencies

- วิเคราะห์ project structure, tech stack, และ architecture
- ระบุ existing modules, shared code, และ integration points
- สำรวจ libraries: ทำ `/use-lib-better` และ `/use-lib-effective`
- บันทึก library ที่เลือกพร้อมเหตุผล: modern, type safety, performance, DX, maintenance

### 4. Define Implementation Path

> Goal: Define Implementation Path

ทำ `/prioritize` เพื่อจัดลำดับ tasks ตาม impact และ effort

- จัดลำดับ: foundation ก่อน, high risk เพื่อ fail fast
- จัดกลุ่ม tasks เป็น phases: Foundation → Core → Polish → Test
- ระบุ critical path, dependencies ระหว่าง tasks, และ parallelizable tasks
- กำหนด milestones พร้อม timeline และ buffer
- คำนวณ planning metrics: task_count, effort_estimate, impact_score, risk_score

### 5. Plan Architecture

> Goal: Plan Architecture

ทำ `/recommend-architecture` เพื่อแนะนำ architecture ที่เหมาะสม

- วางแผน file architecture โดยจัดกลุ่มตาม responsibility พร้อม tree diagram
- สร้าง file pattern table: File Pattern, Description, Naming, Import
- กำหนด module boundaries, dependencies, และ public APIs
- ระบุ shared modules, data contracts, และ integration patterns
- วางแผน error handling, caching strategy, และ data validation points

### 6. Risk Assessment

> Goal: Risk Assessment

วิเคราะห์ความเสี่ยงและ trade-offs อย่างละเอียด

Goal reminder: ทุก architectural decision ต้องมี trade-off analysis

- ระบุ risks ของทุก task: probability × impact
- วิเคราะห์ trade-offs ของ architectural decisions พร้อม alternatives ที่ปฏิเสธ
- วางแผน rollback strategy สำหรับ high-risk tasks
- ระบุ assumptions ทั้งหมดและตรวจสอบว่า assumptions มีพื้นฐานจริง
- จัดลำดับ risks ตาม severity: Critical, High, Medium, Low

### 7. Plan Test Strategy

> Goal: Plan Test Strategy

ออกแบบ test strategy ที่ครอบคลุม

- ออกแบบ test case ที่ครอบคลุม: unit, integration, e2e
- กำหนด test coverage requirements และ test data fixtures
- วางแผน regression test strategy
- ระบุ critical paths ที่ต้องมี test ก่อน
- กำหนด performance test targets ถ้าเกี่ยวข้อง

### 8. Stress-Test Plan

> Goal: Stress-Test Plan

ตรวจสอบแผนอย่างละเอียดสำหรับงานที่ซับซ้อนสูง

- จำลอง worst-case scenario และตรวจสอบว่าแผนยังทำได้
- ระบุ critical path และ bottlenecks
- ตรวจสอบ assumptions ทุกข้อในแผน
- ถ้างานซับซ้อนสูง: ทำ `/deep-thinking` และ `/deep-pondering` ก่อน step นี้
- ถ้าพบ issue ให้กลับไป Step 4-5 แก้แผน

### 9. Validate And Report

> Goal: ตรวจสอบแผนและรายงาน

1. ยืนยัน dependencies ไม่ conflict กับ existing versions
2. ตรวจสอบทุก task มี single responsibility และ test ได้
3. ตรวจสอบไม่มี missing tasks หรือ gaps
4. ระบุไฟล์ที่จะสร้างใหม่, แก้ไข, หรือลบ พร้อม risks และ mitigation
5. ทำ `/deep-validate` เพื่อ validate แผนก่อนบันทึก
6. ทำ `/create-plan` เพื่อสร้างแผนลง `.devin/plan/<title>-<date>.md`
7. ทำ `/report-table` สำหรับ tasks และ file structure
8. ทำ `/report-plan` เพื่อรายงานแผนในแชทก่อนลงมือทำ
9. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. Planning Order

- ทำ task planning ก่อน code planning เสมอ
- สำรวจ libraries ก่อน implement
- จัดลำดับ: foundation ก่อน, high risk เพื่อ fail fast
- วางโครงสร้างไฟล์ทั้งหมดก่อนเขียน code

### 2. Risk And Trade-Off

- ทุก architectural decision ต้องมี trade-off analysis พร้อม alternatives ที่ปฏิเสธ
- ทุก high-risk task ต้องมี mitigation plan และ rollback strategy
- จัดลำดับ risks ตาม probability × impact
- ถ้างานซับซ้อนสูง: ทำ `/deep-thinking`, `/deep-pondering`, และ `/deep-research` ก่อนวางแผน

### 3. Module Design

- แต่ละ module ต้องมี single responsibility
- Dependencies ไปในทิศทางเดียว (high-level → low-level)
- หลีกเลี่ยง circular dependencies
- บันทึก architectural decisions พร้อมเหตุผล

### 4. Document Handling

- ถ้า tasks > 10 สร้างใน `.devin/tasks/` และทำ `/update-dot-devin`
- ถ้า tasks <= 10 บันทึกใน chat report เท่านั้น
- ต้องทำ `/report-plan` ก่อนลงมือทำ ตอบในแชท แล้วทำต่อได้เลย
- ไม่ต้องรอยืนยันจาก user ยกเว้นกรณีเสี่ยงสูง

### 5. Stress-Test

- ตรวจสอบ assumptions ทุกข้อในแผน
- จำลอง worst-case scenario เสมอ
- ถ้าพบ issue ให้กลับไปแก้แผน ไม่ฝืนทำ
- ถ้าเกิน 3 รอบแล้วยังไม่ผ่าน ให้ stop และ report

## Expected Outcome

- Comprehensive plan พร้อม risk assessment และ trade-off analysis
- Task document ใน `.devin/tasks/` (ถ้า tasks > 10)
- Architecture document พร้อม file pattern table
- Library choices ที่มีเหตุผลพร้อม metrics
- Implementation roadmap ที่ prioritized พร้อม planning metrics
- Timeline ที่ realistic พร้อม buffer
- Test strategy ที่ครอบคลุม
- Risks และ mitigation strategies ที่ชัดเจน
- Stress-test ผ่าน worst-case scenario
- Report plan พร้อม task table และ file structure

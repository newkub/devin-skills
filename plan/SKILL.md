---
name: plan
description: วางแผนงานและ architecture อย่างเป็นระบบก่อนเริ่ม implement
argument-hint: "[prompt]"
related:
  - review-architecture
  - follow-architecture
  - deep-analyze
  - alternative
  - prioritize
  - deep-thinking
---

## Goal

วางแผนงานและ architecture อย่างเป็นระบบก่อนเริ่ม implement พร้อม metrics สำหรับวัดคุณภาพแผน

## Scope

ครอบคลุมการวางแผน tasks, libraries, implementation path, file architecture, module structure และการ validate แผนงาน ถ้า tasks เยอะมาก (>10) ให้สร้างใน `.devin/tasks/` (merged from: `plan-by-ask-me`, `report-plan`)

Boundary: งานซับซ้อนสูง/เสี่ยงสูงที่ต้อง comprehensive analysis และ research front-loading → ใช้ `/deep-plan`; ต้องการตัดสินใจร่วมกับ user → ใช้ `/ask-me` กับ `/report-deep` ใน section `Collaborative Planning`

## Execute

### 1. Analyze And Research

> Goal: Analyze And Research

1. ทำ `deep-analyze` เพื่อวิเคราะห์ project structure และ dependencies
2. ระบุ scope, constraints, และ assumptions
3. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
4. ทำ `alternative` เพื่อสำรวจและวิเคราะห์ libraries
5. บันทึก library ที่เลือกพร้อมเหตุผล (modern, type safety, performance, DX, maintenance)

### 2. Define Implementation Path

> Goal: Define Implementation Path

1. ทำ `prioritize` เพื่อจัดลำดับ tasks ตาม impact และ effort
2. จัดลำดับ: foundation ก่อน, high risk เพื่อ fail fast
3. จัดกลุ่ม tasks เป็น phases: Foundation → Core → Polish → Test
4. ระบุ critical path, dependencies ระหว่าง tasks, และ parallelizable tasks
5. กำหนด milestones พร้อม timeline และ buffer
6. คำนวณ planning metrics (ดู Metrics section)

### 3. Plan Architecture

> Goal: Plan Architecture

1. ทำ `deep-thinking` เพื่อทบทวน architectural decisions และผลกระทบระยะยาวก่อนเลือก architecture
2. ทำ `/follow-architecture` เพื่อเลือก architecture ที่เหมาะสม
3. วางแผน file architecture โดยจัดกลุ่มตาม responsibility พร้อม tree diagram
4. สร้าง file pattern table: File Pattern, Description, Naming, Import
5. กำหนด module boundaries, dependencies (high-level → low-level), และ public APIs
6. ระบุ shared modules, data contracts, และ integration patterns
7. วางแผน error handling, caching strategy, และ data validation points

### 4. Plan Test Strategy

> Goal: Plan Test Strategy

1. ออกแบบ test case ที่ครอบคลุม: unit, integration, e2e
2. กำหนด test coverage requirements และ test data fixtures
3. วางแผน regression test strategy

### 5. Create Documents

> Goal: Create Documents

1. ถ้า tasks > 10 ให้สร้าง `.devin/tasks/<name>-DD-MM-YYYY.md` พร้อม tasks ทั้งหมด
2. ถ้า tasks > 10 ให้สร้าง `.devin/tasks/<name>-arch-DD-MM-YYYY.md` พร้อม architecture
3. บันทึก: tasks, library choices, milestones, test strategy, assumptions, risks, migration plan
4. ถ้า tasks <= 10 ให้บันทึกใน chat report เท่านั้น
5. ทำ `update-dot-devin` ถ้ามีการเปลี่ยนแปลง package manifest

### 6. Stress-Test Plan

> Goal: Stress-Test Plan

ตรวจสอบแผนอย่างละเอียดสำหรับงานที่ซับซ้อนสูง

1. ตรวจสอบ assumptions ทุกข้อในแผน
2. จำลอง worst-case scenario และตรวจสอบว่าแผนยังทำได้
3. ระบุ critical path และ bottlenecks
4. วิเคราะห์ trade-offs ของ architectural decisions พร้อม alternatives ที่ปฏิเสธ
5. วางแผน rollback strategy สำหรับ high-risk tasks
6. ถ้างานซับซ้อนสูง: ทำ `deep-thinking` ก่อน step นี้

### 7. Validate And Report

> Goal: Validate And Report

1. ยืนยัน dependencies ไม่ conflict กับ existing versions
2. ตรวจสอบทุก task มี single responsibility และ test ได้
3. ตรวจสอบไม่มี missing tasks หรือ gaps
4. ระบุไฟล์ที่จะสร้างใหม่, แก้ไข, หรือลบ และ risks พร้อม mitigation
5. จัดรูปแบบตาราง tasks ตาม `/report` และ file structure ตาม `/report-file-structure`
6. รายงานแผนในแชทก่อนลงมือทำ ตาม section `Report Plan` ด้านล่าง แล้วทำงานต่อได้เลย

### 8. Report Plan

> Goal: รายงานแผนในแชทก่อนลงมือ

1. ขึ้นต้นด้วย summary 1-2 บรรทัด
2. แสดง `## TODOs` แบบ numbered list + bullets
3. แสดง `## File Changes` ตารางมี columns: `No.`, `File`, `How to`, `Risk`, `Note`
4. แสดง `## File Structure` ถ้ามีการเปลี่ยนโครงสร้าง
5. แสดง `## Next Action` ชัดเจนท้าย report

### 9. Collaborative Planning

> Goal: วางแผนร่วมกับ user เมื่อไม่แน่ใจหรืองานเสี่ยงสูง

1. ถ้า context ไม่ชัด หรือมีหลายทางเลือก → ใช้ `/ask-me`
2. ทำ `/follow-deep` และ `/report-deep` เพื่อรวบรวม evidence
3. สรุป options, risks, trade-offs แล้วให้ user ตัดสินใจ
4. บันทึกแผนทีตกลงร่วมกัน ด้วย `/create-plan-in-dot-devin` ถ้า tasks > 10

## Metrics

วัดคุณภาพแผนด้วย metrics ต่อไปนี้:

| Metric | คำอธิบาย | Scale |
|--------|----------|-------|
| `task_count` | จำนวน tasks ทั้งหมด | number |
| `effort_estimate` | ความพยายามต่อ task | `S` / `M` / `L` / `XL` |
| `impact_score` | ผลกระทบต่อ project | 1-5 |
| `risk_score` | ความเสี่ยงต่อ task | 1-5 (Low→High) |
| `dependency_depth` | ระดับ dependencies ของ task | 1-5 |
| `parallelizable_count` | จำนวน tasks ที่ทำ parallel ได้ | number |
| `critical_path_length` | ความยาว critical path | number |
| `file_impact` | ไฟล์ที่กระทบ | `C:M:D` (create:modify:delete) |
| `test_coverage_target` | เป้าหมาย test coverage | percentage |
| `buffer_ratio` | สัดส่วน buffer time | `buffer / total` |

## Rules

### 1. Planning Order

- ทำ task planning ก่อน code planning เสมอ
- สำรวจ libraries ก่อน implement
- จัดลำดับ: foundation ก่อน, high risk เพื่อ fail fast
- วางโครงสร้างไฟล์ทั้งหมดก่อนเขียน code

### 2. Module Design

- แต่ละ module ต้องมี single responsibility
- Dependencies ไปในทิศทางเดียว (high-level → low-level)
- หลีกเลี่ยง circular dependencies
- บันทึก architectural decisions พร้อมเหตุผล

### 3. Document Handling

- ถ้า tasks > 10 สร้างใน `.devin/tasks/` และทำ `update-dot-devin`
- ถ้า tasks <= 10 บันทึกใน chat report เท่านั้น
- ถ้า tasks > 10 สร้างใน `.devin/tasks/` แล้วรายงานสรุปในแชท
- ตอบในแชทด้วย sections: `## TODOs`, `## File Changes`, `## File Structure`, `## Next Action`
- ถ้างานเสี่ยงสูง/ไม่แน่ใจ → ถาม user ด้วย `/ask-me` ก่อนลงมือ

### 4. Trade-Off And Risk Analysis

- ทุก architectural decision ต้องมี trade-off analysis พร้อม alternatives ที่ปฏิเสธ
- ทุก high-risk task ต้องมี mitigation plan และ rollback strategy
- จัดลำดับ risks ตาม probability × impact
- ถ้างานซับซ้อนสูง: ทำ `deep-thinking` และ `deep-research` ก่อนวางแผน

- ใช้ /review-architecture ถ้าจำเป็น

## Expected Outcome

- Task document ใน `.devin/tasks/` (ถ้า tasks > 10)
- Architecture document ใน `.devin/tasks/` (ถ้า tasks > 10)
- Library choices ที่มีเหตุผลพร้อม metrics
- Implementation roadmap ที่ prioritized พร้อม planning metrics
- Timeline ที่ realistic พร้อม buffer
- Test strategy ที่ครอบคลุม
- Risks และ mitigation strategies ที่ชัดเจน
- Report plan พร้อม task table และ file structure

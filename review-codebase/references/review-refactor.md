---
name: review-refactor
description: Review refactor opportunities รวม SRP, duplication, complexity, coupling, smells, testability
---

## Goal

Review refactor opportunities และรายงาน findings พร้อม actionable recommendations

## Scope

รวม: SRP violations, mixed concerns, code duplication, long files, complex functions, tight coupling, dead code, naming conventions, code smells, anti-patterns, missing abstractions, testability (dependency injection, pure functions, side effect isolation, test setup complexity, module coupling, hardcoded dependencies, global state, async testability), และ refactoring recommendations

## Execute

### 1. Prepare

สแกน codebase เพื่อเข้าใจโครงสร้างและระบุ refactor candidates

> Goal: เข้าใจ project structure และระบุ refactoring tools ที่มี

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ codebase
2. ระบุ refactoring tools ที่มี: `biome`, `ast-grep`, `knip`, `jscpd`, `madge`
3. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

วิเคราะห์ refactor opportunities อย่างลึกซึ้งด้วย scripts

> Goal: ครอบคลุมทุก refactor dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ SRP violations: mixed concerns, God modules, multiple reasons to change
6. Analyzer ตรวจสอบ code duplication ด้วย `jscpd` และระบุ duplicate blocks
7. Analyzer ตรวจสอบ file complexity: files เกิน 250 บรรทัด, functions ที่ซับซ้อนเกินไป
8. Analyzer ตรวจสอบ coupling: tight coupling, circular dependencies ด้วย `madge`
9. Analyzer ตรวจสอบ dead code และ unused exports ด้วย `knip`
10. Analyzer ตรวจสอบ code smells: `any` type, `console.log`, ignore comments, magic numbers
11. Analyzer ตรวจสอบ naming conventions และ anti-patterns ด้วย `ast-grep`
12. Analyzer ตรวจสอบ missing abstractions และ inline logic ที่ควร extract
13. Analyzer ตรวจสอบ testability: dependency injection (functions ที่ new dependencies ภายในแทนรับผ่าน parameters), pure functions (side effects ใน logic path), side effect isolation (side effects ผสมกับ business logic), test setup complexity (test files ที่มี setup เกิน 50 บรรทัด), module coupling, hardcoded dependencies (`new` keyword ใน logic path), global mutable state, async testability (floating promises, missing await, timer dependencies)
14. Review CLI คำนวณ refactor review score จาก review report
15. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อน report

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 4. Report

รายงานผลการ review ในแชท

> Goal: รายงาน refactor findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Refactor Metrics Summary: SRP violations, duplication %, long files, complex functions, coupling issues, dead code, code smells
3. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Refactors: Priority, Refactor Action, Impact, Effort, Workflow
5. แสดง refactor review score พร้อม progress bar และ grade
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 5. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: circular dependency, God module เกิน 500 บรรทัด, core feature ในไฟล์ผิด layer, hardcoded dependency ใน critical path ที่ mock ไม่ได้, global mutable state ที่ทำให้ test ไม่ isolated, business logic ที่ผสมกับ I/O โดยไม่แยก
- High: SRP violation ใน critical path, duplication เกิน 50 lines, tight coupling ระหว่าง modules, missing dependency injection ใน service layer, side effects ใน pure function path, test setup เกิน 50 บรรทัด
- Medium: code smell, long file 250+ บรรทัด, missing abstraction, moderate coupling, module coupling ที่ทำให้ test ต้อง import เยอะ, async pattern ที่ test ยาก, missing interface สำหรับ mocking
- Low: naming convention, minor code smell, cosmetic improvement, minor coupling improvement, missing test helper

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`jscpd`, `madge`, `knip`, `ast-grep`)

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ใช้ `/review-codebase` สำหรับระบุ issues ใน code
- แยก review process จาก refactor process
- ถ้าต้อง refactor ให้ทำ `/refactor` หลัง review
- ถ้าพบ naming issues ให้ใช้ `/rename` หลัง review

### 4. Health Score Formula

- 8 metrics หลัก: SRP violations, duplication, long files, complex functions, coupling, dead code, code smells, testability
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / 8) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Refactor Metrics Summary พร้อม status indicators
- รายงาน Findings by Category พร้อม severity และ location
- รายงาน Recommended Refactors พร้อม priority และ workflow
- Refactor review score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- ใช้ `/rename` สำหรับ fix naming convention issues ที่พบ

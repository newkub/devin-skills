---
name: deep-refactor
description: Deep refactor ครบวงจร — baseline, impact, plan, SRP, restructure, validation
argument-hint: "[scope]"
related:
  - review-refactor
  - deep-analyze
  - deep-impact
  - refactor
  - refactor-to-single-responsibility
  - restructure
  - deep-validate
  - run-verify
  - run-test-all
  - update-references
  - report-before-after
---

## Goal

Deep refactor หนึ่ง workspace ด้วย baseline, multi-dimensional analysis, impact assessment, risk-aware plan, incremental execution, และ comprehensive validation เพื่อลด regression

## Scope

ใช้กับ project หรือ workspace หนึ่งตัวที่ต้องการ refactor ลึก
ไม่ใช่สำหรับทุก workspace ใน monorepo — ใช้ `/refactor-all-workspace` สำหรับกรณีนั้น
ครอบคลุม SRP, architecture, file/folder structure, boundaries, references, และ validation
ไม่ใช่สำหรับแก้ bug เฉพาะหน้า หรือเปลี่ยนชื่อ identifier อย่างเดียว

## Execute

### 1. Baseline And Context

> Goal: สร้าง baseline และเข้าใจ codebase ก่อน refactor

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack, และ conventions
2. อ่าน `AGENTS.md` เพื่อทราบ rules และ workflows ของ project
3. ทำ `/review-refactor` เพื่อสร้าง baseline metrics และระบุ refactor targets
4. บันทึก baseline: files, symbols, dependencies, test status, lint/typecheck status

### 2. Deep Analysis

> Goal: วิเคราะห์หลายมิติก่อน refactor

1. ทำ `/deep-analyze` สำหรับ architecture, code quality, dependencies, performance, security
2. ทำ `/check-code-structure` เพื่อดู top-level symbols, cohesion, coupling
3. ทำ `/check-long-files` เพื่อหาไฟล์ที่ยาวเกิน 250 บรรทัด
4. ทำ `/review-quality` เพื่อหา code smells, duplication, dead code
5. รวม findings เป็น prioritized list ตาม severity และ impact

### 3. Impact Analysis

> Goal: ประเมินผลกระทบของการเปลี่ยนแปลง

1. ทำ `/deep-impact` สำหรับแต่ละ refactor target ที่สำคัญ
2. ระบุ consumers, call sites, public API ที่จะกระทบ
3. ประเมิน blast radius, risk, และ migration effort
4. ออกแบบ rollback plan สำหรับ changes ที่มีผลกระทบสูง

### 4. Strategic Planning

> Goal: วางแผน refactor อย่างปลอดภัยและเป็นระบบ

1. ทำ `/plan` หรือ `/create-plan-in-dot-devin` สำหรับงานขนาดใหญ่
2. จัดลำดับตาม high impact + low effort ก่อน
3. เลือก strategy: in-place, extract, relocate, rename, split
4. กำหนด success criteria และ checkpoint สำหรับแต่ละ phase

### 5. Execute Refactor

> Goal: ทำการ refactor ตามแผน

1. ทำ `/refactor-to-single-responsibility` สำหรับ SRP violations
2. ทำ `/refactor` สำหรับ code style, boundaries, consistency
3. ทำ `/restructure` สำหรับ file/folder structure ที่ผิด domain
4. ทำ `/rename` สำหรับ identifier ที่ต้องเปลี่ยนชื่อ
5. ทำทีละ batch ตามลำดับในแผน พร้อม verify หลังแต่ละ batch

### 6. Update References

> Goal: อัปเดต references ทั้งหมดหลังการเปลี่ยนแปลง

1. ทำ `/edit-relative` เพื่ออัปเดต relative paths และ imports
2. ทำ `/update-references` เพื่ออัปเดต references ใน skills, AGENTS.md, .devin/rules, และ codebase
3. ค้นหา references เก่าอีกครั้งเพื่อยืนยันว่าไม่เหลือ
4. ถ้ามี broken references → ทำ `/resolve-errors`

### 7. Validate

> Goal: ตรวจสอบว่า refactor สำเร็จและไม่มี regression

1. ทำ `/run-verify` สำหรับ lint, typecheck, unit test, build
2. ทำ `/run-test-all` ถ้ามี test suites ทั้งหมด
3. ทำ `/deep-validate` เพื่อตรวจ references, structure, public API
4. ทำ `/check-code-structure` เปรียบเทียบกับ baseline
5. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 5-6 สูงสุด 3 ครั้ง

### 8. Report

> Goal: รายงานผล before/after และสิ่งที่ทำ

1. ทำ `/report-before-after` สรุป metrics ก่อนและหลัง refactor
2. ทำ `/report-table` สร้างตาราง: target, action, status, risk, verification
3. ระบุข้อควรระวังหรือสิ่งที่ต้องติดตามถ้ามี
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Safety First

- ต้องมี baseline ก่อนเริ่ม refactor
- ต้องทำ `/deep-impact` ก่อน changes ที่มีผลกระทบสูง
- ต้องมี rollback plan สำหรับ breaking changes
- destructive actions ต้องมี dry run และ user confirmation

### 2. Minimal Change

- ทำ `/dont-over-engineer` เสมอ
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- หลีกเลี่ยง abstraction ที่ไม่จำเป็น

### 3. Incremental Execution

- ทำทีละ batch ไม่ทำทั้งหมดพร้อมกัน
- verify หลังแต่ละ batch
- สร้าง commit checkpoint หลังแต่ละ phase ที่สำคัญ

### 4. Reference Safety

- ทำ `/edit-relative` และ `/update-references` หลังย้าย, แยก, หรือเปลี่ยนชื่อไฟล์
- ตรวจสอบ imports, barrel exports, path aliases ให้ถูกต้อง

### 5. Verification

- ต้องผ่าน `/run-verify` และ `/deep-validate` ก่อนถือว่าเสร็จ
- ไฟล์ไม่เกิน 250 บรรทัด
- ไม่มี broken references

## Expected Outcome

- Codebase มี SRP, boundaries, และ structure ที่ดีขึ้น
- Baseline metrics ก่อน/หลังชัดเจน
- ไม่มี broken references หรือ regression
- ผ่าน lint, typecheck, test, build
- มีรายงาน before/after, risk, และ next actions

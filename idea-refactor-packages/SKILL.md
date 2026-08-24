---
name: idea-refactor-packages
description: สร้างไอเดียการสร้างหรือ refactor packages ใหม่พร้อม continuous numbering
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - refactor
---

## Goal

สร้างไอเดียการสร้างหรือ refactor packages ใหม่ให้เหมาะสมกับ project structure พร้อม continuous numbering

## Scope

ใช้เมื่อต้องการวิเคราะห์ว่าควรแยก package ใหม่อะไร รวม package ไหน หรือ refactor packages เดิมอย่างไรเพื่อรองรับ packages ใหม่ — ไม่รวมการ execute refactor ให้ทำตาม `refactor-packages` ต่อ

## Execute

### 1. Analyze Project And Packages

> Goal: รวบรวม context ก่อนสร้างไอเดีย
> Goal: เข้าใจ project structure, packages, และ dependencies

1. ทำ `scan-codebase` เพื่อดู file structure และ package boundaries
2. ทำ `analyze-project` เพื่อระบุ project type, tech stack, และ dependencies
3. ทำ `deep-analyze` เพื่อวิเคราะห์ cognitive complexity, coupling, และ cohesion
4. ทำ `analyze-code-structure` เพื่อดู exports, consumers, และ module boundaries
5. ทำ `check-duplication` เพื่อระบุ code ซ้ำซ้อนระหว่าง packages
6. ทำ `check-circular-dependencies` เพื่อตรวจสอบ circular dependencies

### 2. Identify New Package Opportunities

> Goal: ระบุโอกาสสำหรับ packages ใหม่
> Goal: รู้ว่าควรสร้าง package ใหม่อะไรบ้าง

1. ระบุ code ที่ถูกใช้ซ้ำหลายที่แต่ยังไม่มี package ของตัวเอง
2. ระบุ modules ที่มี single responsibility แต่กระจายอยู่หลายไฟล์
3. ระบุ concerns ที่เปลี่ยนแปลงบ่อย ทดสอบยาก เพราะรวมอยู่ใน package ใหญ่
4. ระบุ dependencies ที่ควรแยกออกจาก application packages
5. ระบุ packages ที่ผูกกับ framework/library เฉพาะ ควร isolate

### 3. Evaluate Refactor Options

> Goal: ประเมินวิธีรองรับ packages ใหม่
> Goal: ตัดสินใจว่าจะ create, split, merge, relocate หรือ keep

1. ประเมินแต่ละ opportunity ตามเงื่อนไข:
   - `create` — ถ้า code มี single responsibility และถูกใช้โดยหลาย consumers
   - `split` — ถ้า package เดิมมีหลาย reasons to change
   - `merge` — ถ้า packages ซ้ำซ้อนหรือ changes together
   - `relocate` — ถ้าอยู่ผิด package แต่ไม่ต้องแยกใหม่
   - `keep` — ถ้า cohesion สูงและไม่มี benefit ชัดเจน
2. ทำ `dont-over-engineer` เพื่อกรองไอเดียที่ซับซ้อนเกินไป
3. พิจารณา dependency direction และ deployment boundaries

### 4. Plan New Package Boundaries

> Goal: วางโครงสร้าง packages ใหม่
> Goal: แผน new packages ชัดเจน ไม่ทำลาย stability

1. ทำ `follow-architecture` หรือ `follow-monorepo` เพื่อออกแบบ package structure
2. กำหนด responsibilities, public API, และ consumers ของแต่ละ new package
3. ระบุ entry points, barrel exports และ naming conventions
4. วางแผน versioning และ semantic boundaries
5. ทำ `report-plan` ถ้า new packages มีผลกระทบกว้าง

### 5. Generate Ideas

> Goal: สร้างไอเดีย new packages/refactor แบบ actionable
> Goal: ไอเดีย track ได้และพร้อม execute

1. สร้างไอเดียสำหรับแต่ละ opportunity
2. ใช้ continuous numbering ต่อจากไอเดียเดิมถ้ามี
3. ระบุ scope: `quick win`, `short-term`, `long-term`
4. ระบุ impact, effort, และ action: `create`, `split`, `merge`, `relocate`, `keep`
5. ระบุ package name, responsibilities, consumers, และ integration path

### 6. Report

> Goal: รายงานไอเดียและ next action
> Goal: ผู้ใช้เห็นภาพรวมและลำดับถัดไป

1. ทำ `report-table`
2. คอลัมน์: number, package(s), issue, idea, action, scope, impact, effort
3. จัดลำดับตาม impact/effort ratio
4. ทำ `suggest-next-action`
5. ถ้าพร้อม execute → แนะนำให้ทำ `refactor-packages`

## Rules

### 1. Focus On New Packages

- เน้นการสร้าง packages ใหม่หรือ refactor packages เดิมเพื่อรองรับ packages ใหม่
- ไม่ลงมือ execute การย้ายหรือแก้ไข code ด้วยตรง
- ใช้ `refactor-packages` สำหรับ execution

### 2. Evidence-Based

- ทุกไอเดียต้องมาจาก analysis จริง
- ระบุ file path, module, package, หรือ symbol ที่เกี่ยวข้อง
- อ้างอิง consumers, dependencies, และ coupling

### 3. Actionable And Numbered

- ใช้ continuous numbering
- ระบุ action ชัดเจน: `create`, `split`, `merge`, `relocate`, `keep`
- ระบุ package name, responsibilities, consumers, integration path

### 4. No Over-Engineering

- ไม่เสนอ packages ใหม่ที่ไม่มี benefit ชัดเจน
- ไม่แยก package เพื่อ conceptual purity อย่างเดียว
- ทำ `dont-over-engineer`

### 5. Alignment With Existing

- ตรวจสอบ packages ที่มีอยู่ใน workspace ก่อน
- แนะนำให้ใช้ existing package ถ้าเหมาะสม
- หลีกเลี่ยงชื่อซ้ำกับ existing packages

## Expected Outcome

- รายการไอเดีย new packages/refactor แบบ continuous numbering
- ทุกไอเดียมี package name, action, scope, impact, effort
- ตาราง `report-table` พร้อม next action
- ไอเดียพร้อม execute ด้วย `refactor-packages`

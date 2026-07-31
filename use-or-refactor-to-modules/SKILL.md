---
name: use-or-refactor-to-modules
description: ประเมินและ refactor modules ให้มี SRP หรือแนะนำ modules จาก workspace ที่ควรนำมาใช้
---

## Goal

ประเมินและ refactor modules ให้มี single responsibility ตาม SRP และแนะนำ modules จาก workspace ที่ควรนำมาใช้

## Scope

ครอบคลุมการตัดสินใจว่าควร refactor modules หรือไม่, ประเมิน cohesion, change frequency, coupling, และแนะนำ modules จาก workspace ที่ควรนำมาใช้ — ถ้า code ยังไม่ modularize จะแปลงเป็น modules, ถ้ามี modules อยู่แล้วจะ refactor, ถ้า modules ดีอยู่แล้วจะแนะนำใช้ต่อ

## Execute

### 1. Analyze Project And Modules

วิเคราะห์โปรเจกต์และ modules ปัจจุบัน

> Goal: เข้าใจ current structure, responsibilities, coupling และ duplication ของ modules

1. อ่าน `package.json`, `Cargo.toml`, หรือไฟล์จัดการ dependencies ที่เกี่ยวข้อง
2. ทำ `/analyze-project` เพื่องดูภาพรวม project type และ module structure
3. ทำ `/deep-analyze` เพื่องวิเคราะห์ cognitive complexity, reasons to change, coupling และ cohesion
4. ทำ `/scan-codebase` ∥ `/analyze-code-structure` เพื่องค้นหา consumers, call sites, exports, และ cohesion ของไฟล์
5. ทำ `/check-duplication` เพื่องระบุ code ซ้ำซ้อนระหว่าง modules
6. ทำ `/check-circular-dependencies` เพื่องตรวจสอบ circular dependencies เบื่องต้น
7. ถ้าเป็น monorepo → ทำ `/follow-monorepo`; ถ้า analyze ไม่ได้ → stop และ report

### 2. Evaluate Refactor Necessity

ประเมินว่าควร refactor, สร้าง modules, หรือใช้ existing modules

> Goal: ตัดสินใจชัดเจนว่าจะ use / create / refactor modules

1. วิเคราะห์ current state:
   - ถ้า code ยังไม่ modularize → ไป Step 3 (Plan Create)
   - ถ้า modules มี multiple responsibilities → ไป Step 3 (Plan Refactor)
   - ถ้า modules ดีอยู่แล้ว → ไป Step 4 (Recommend Use)
2. วิเคราะห์ change patterns: เปลี่ยนพร้อมกัน, maintain โดยทีมเดียวกัน, release lifecycle
3. ประเมิน signals:
   - Create / Refactor: หลาย reasons to change, coupling สูง, duplication ข้าม files, non-modular
   - ใช้ต่อ: single responsibility ชัดเจน, cohesive สูง, changes together, deploys together
4. ทำ `/dont-over-engineer` เพื่องกำหนดขอบเขต minimal

### 3. Plan Module Strategy

วางแผนการสร้างหรือ refactor modules

> Goal: แผนชัดเจน ไม่ทำลาย stability

1. ถ้าต้องสร้าง modules ใหม่: ทำ `/follow-architecture` ∥ `/follow-clean-architecture` เพื่องอกแบบ structure
2. ถ้าต้อง refactor modules เดิม: ทำ `/refactor` เพื่องอกแบงก์ split/merge/restructure
3. ระบุ module boundaries ตาม domain, reason to change และ cohesion
4. ระบุ modules ที่จะ create, split, merge, หรือ relocate
5. จัดลำดับตาม dependency direction (foundation modules ก่อน)
6. ทำ `/report-plan` ก่อนลงมือ execute

### 4. Scan And Recommend Modules

สำรวจ modules ใน workspace และแนะนำว่าควรใช้หรือสร้างใหม่

> Goal: รายงาน modules ที่ควรใช้หรือสร้าง แบ่งตาม priority พร้อม integration path

1. สำรวจโครงสร้าง workspace และหา modules ที่มีอยู่แล้ว
2. จัดกลุ่ม modules ตามประเภท: UI, Utilities, Frameworks, Libraries, Tools, Integrations
3. ประเมินแต่ละ module: compatibility, benefit, stability, maintenance, docs
4. สร้างรายงานแนะนำแบ่งตาม priority:
   - High — แก้ปัญหาที่มี, ลด duplication, ใช้แทนการสร้างใหม่
   - Medium — ปรับปรุง DX, เพิ่ม features, มี trade-offs
   - Low — ไม่จำเป็น, over-engineering
5. ถ้ามี modules ที่เหมาะสม → แนะนำใช้; ถ้าไม่มี → ไป Step 5 สร้างใหม่

### 5. Execute Module Refactor Or Creation

ดำเนินการ refactor หรือสร้าง modules ตามแผน

> Goal: ดำเนินการตามแผน ผ่าน tests ไม่ทำลาย consumers

1. สร้าง directory structure สำหรับแต่ละ module — `src/modules/<module-name>/` หรือตาม convention
2. ย้าย code ไปยัง module ที่เกี่ยวข้องตาม dependency direction — ใช้ `/restructure` สำหรับ file operations
3. ทำ `/relocation` เพื่อย้าย files ไปยัง modules ที่เหมาะสม
4. ทำ `/merge` เพื่องรวม modules ที่ซ้ำซ้อน
5. ทำ `/follow-import-export` เพื่องร้าง barrel exports และ import aliases
6. ทำ `/update-reference` หลังย้าย code ทุกครั้ง — ถ้ามี broken references → `/resolve-errors`
7. ถ้า file operations > 10 ไฟล์ → ใช้ `/use-scripts`

### 6. Verify Impact

ตรวจสอบผลกระทบ

> Goal: Modules ดีขึ้น ไม่มี regression ไม่มี circular dependencies

1. ทำ `/run-test` ∥ `/run-lint` ∥ `/run-typecheck`
2. ทำ `/check-circular-dependencies` เพื่องตรวจสอบและแก้ไข
3. ทำ `/analyze-code-structure` เพื่องเปรียบเทียบ structure กับ baseline
4. ประเมินว่าไม่เกิด fragmentation และ consumers ยังใช้งานได้
5. เปรียบเทียบ module quality กับก่อน refactor — ถ้าไม่ดีขึ้น → rollback และ report

## Rules

### 1. Cohesion First

- รวม code ที่ changes together, deploys together, tests together
- หลีกเลี่ยง fragmentation ที่เพิ่ม cognitive load
- พิจารณา dependency graph complexity

### 2. When To Refactor, Create, Or Use

- Create / Refactor: หลาย reasons to change, test ยุ่ง, coupling สูง, ไม่ reusable, non-modular, duplication ข้าม modules
- ใช้ต่อ: single responsibility ชัดเจน, cohesive สูง, changes together, deploys together
- ถ้า refactor จะทำลาย stability หรือเพิ่ม fragmentation → อย่า refactor

### 3. Dependency Direction

- Foundation modules ไม่มี dependency กับ modules อื่น
- High-level modules พึ่งพา low-level modules เท่านั้น
- ไม่มี circular dependencies ระหว่าง modules
- จัดลำดับการสร้างตาม dependency direction (leaf modules ก่อน)

### 4. Public API And Boundaries

- แต่ละ module มี `index.ts` หรือ barrel เป็น public API
- เก็บ internal code private — ไม่ export ทุกอย่าง
- ห้าม import ลึกเข้าไปใน module ที่ไม่ใช่ public API
- ใช้ barrel exports กำหนด public surface

### 5. Safety And Minimal Changes

- ทำ `/dont-over-engineer` — ไม่สร้าง micro-modules หรือ abstractions ที่ไม่จำเป็น
- ไม่สร้าง abstraction ที่ไม่จำเป็น — modules ต้องมี code มากพอที่จะ justify การแยก
- ทำ `/update-reference` หลังทุกการย้าย code
- ถ้า broken references → ทำ `/resolve-errors`

## Expected Outcome

- Modules ที่มี single responsibility, high cohesion, low coupling, dependency graph ที่จัดการได้
- ไม่ over-refactor หรือ fragmentation
- รายงาน modules ที่ควรใช้หรือสร้าง แบ่งตาม priority พร้อม integration path
- Code ผ่าน tests, lint, typecheck — ไม่มี circular dependencies และ regression
- ตาราง Module Name, Responsibility, Public API, Dependencies, Status

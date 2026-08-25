---
name: refactor-packages
description: Refactor modules/packages ให้มี SRP, แนะนำ packages/modules จาก workspace, และอัปเดท references
---

## Goal

Refactor modules/packages ให้มี single responsibility, high cohesion, low coupling และแนะนำ packages/modules จาก workspace ที่ควรนำมาใช้

## Scope

ใช้กับ project หรือ monorepo ที่ต้อง split/merge/relocate modules หรือ packages หรือแนะนำ packages/modules จาก workspace

## Execute

### 1. Analyze Project And Structure

> Goal: วิเคราะห์โปรเจกต์และโครงสร้าง modules/packages

1. อ่าน `package.json`, `Cargo.toml`, `bun.lock` หรือ manifest ที่เกี่ยวข้อง
2. ทำ `/analyze-project` เพื่อดูภาพรวม project type และ structure
3. ทำ `/deep-analyze` เพื่อวิเคราะห์ cognitive complexity, reasons to change, coupling, cohesion
4. ทำ `/scan-codebase` ∥ `/check-code-structure` เพื่อค้นหา consumers, call sites, exports, cohesion
5. ทำ `/review-quality` และ `/check-circular-dependencies`
6. ถ้าเป็น monorepo → ทำ `/follow-monorepo`

### 2. Evaluate Refactor Necessity

> Goal: ประเมินว่าควร refactor หรือไม่

1. วิเคราะห์ change patterns: เปลี่ยนพร้อมกัน, maintain โดยทีมเดียวกัน, release lifecycle
2. ประเมิน signals:
   - Refactor: หลาย reasons to change, test ยาก, coupling สูง, ไม่ reusable, dependencies ไม่จำเป็น, duplication ข้าม modules/packages
   - ไม่ refactor: single responsibility ชัด, cohesive สูง, เปลี่ยนด้วยกัน, deploy ด้วยกัน
3. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขต minimal

### 3. Plan Refactor

> Goal: วางแผนการ split/merge/relocate modules/packages

1. ทำ `/plan` เพื่อสร้างแผน split, extract, merge, หรือ relocate
2. ระบุ module/package boundaries ตาม domain, reason to change, cohesion
3. ระบุ consumers, public API, และ dependencies ที่จะกระทบ
4. จัดลำดับตาม dependency direction (foundation ก่อน)
5. ทำ `/report-plan` ก่อนลงมือ execute

### 4. Scan And Recommend Workspace Modules/Packages

> Goal: สำรวจ workspace และแนะนำ modules/packages

1. สำรวจโครงสร้าง workspace และอ่าน manifest ของแต่ละ module/package
2. จัดกลุ่ม: UI, Utilities, Frameworks, Libraries, Tools, Integrations
3. ประเมิน: compatibility, benefit, stability, maintenance, docs
4. สร้างรายงานแบ่งตาม priority:
   - High — แก้ปัญหา, ลด duplication
   - Medium — ปรับปรุง DX, trade-offs
   - Low — ไม่จำเป็น, over-engineering

### 5. Execute Refactor

> Goal: ดำเนินการ refactor ตามแผน

1. สร้าง/ย้าย/รวม directory structure ตาม plan
2. ใช้ `/restructure` หรือ `/relocation` สำหรับ file operations
3. ใช้ `/follow-import-export` เพื่อจัดการ barrel exports และ import aliases
4. ทำ `/update-reference` หลังทุกการย้าย — ถ้า broken → `/resolve-errors`
5. ลบ dependencies ที่ไม่จำเป็น

### 6. Verify Impact And Update References

> Goal: ตรวจสอบผลกระทบและอัปเดท references

1. ทำ `/run-verify`
   - ทำ `/run-test`
   - ทำ `/run-typecheck`
2. ทำ `/check-circular-dependencies` และ `/review-quality`
3. ทำ `/check-code-structure` เพื่อเปรียบเทียบกับ baseline
4. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 3-5 (สูงสุด 3 ครั้ง → stop/report)
5. ทำ `/update-reference` และ `/edit-relative` สำหรับทุก references ที่เปลี่ยน

## Rules

### 1. Cohesion First

- รวม code ที่ changes together, deploys together, tests together
- หลีกเลี่ยง fragmentation ที่เพิ่ม cognitive load
- พิจารณา dependency graph complexity

### 2. When To Refactor Vs Not

- Refactor: หลาย reasons to change, test ยาก, coupling สูง, ไม่ reusable, dependencies ไม่จำเป็น, duplication ข้าม modules/packages
- ไม่ refactor: single responsibility ชัด, cohesive สูง, เปลี่ยนด้วยกัน, deploy ด้วยกัน
- ถ้า refactor ทำลาย stability หรือเพิ่ม fragmentation → อย่า refactor

### 3. Dependency Direction

- Foundation modules/packages ไม่มี dependency กับอื่น
- High-level modules/packages พึ่งพา low-level modules/packages เท่านั้น
- ไม่มี circular dependencies
- จัดลำดับการทำงานตาม dependency direction

### 4. Public API And Boundaries

- แต่ละ module/package มี barrel file (`index.ts`) เป็น public API
- เก็บ internal code private
- ห้าม import ลึกเข้าไปใน module/package
- ใช้ barrel exports กำหนด public surface

### 5. Safety And Minimal Changes

- ทำ `/dont-over-engineer` — ไม่สร้าง micro-modules/packages
- ไม่สร้าง abstraction ที่ไม่จำเป็น
- ทำ `/update-reference` หลังทุกการย้าย code
- ถ้า broken references → ทำ `/resolve-errors`

## Expected Outcome

- Modules/packages มี single responsibility, high cohesion, low coupling
- ไม่ over-refactor หรือ fragmentation
- รายงาน modules/packages ที่ควรใช้แบ่งตาม priority
- Code ผ่าน tests, lint, typecheck
- ไม่มี circular dependencies, broken references, regression

## Guide

- `references/use-packages.md` — วิธีวิเคราะห์และแนะนำ packages จาก workspace

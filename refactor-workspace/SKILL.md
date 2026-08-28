---
name: refactor-workspace
description: Refactor workspace members ให้มี SRP, แนะนำ workspace layout
related:
  - follow-single-responsibility
  - restructure
  - relocation
  - review-architecture
  - update-references
  - run-verify-fast
---

## Goal

Refactor workspace members (packages, crates, modules) ให้มี single responsibility, high cohesion, low coupling และแนะนำ workspace members จาก workspace ที่ควรนำมาใช้

## Scope

ใช้กับ project หรือ monorepo ที่ต้อง split/merge/relocate workspace members หรือแนะนำ workspace members จาก workspace

## Execute

### 1. Analyze Project And Structure

> Goal: วิเคราะห์โปรเจกต์และโครงสร้าง workspace members

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
   - Refactor: หลาย reasons to change, test ยาก, coupling สูง, ไม่ reusable, dependencies ไม่จำเป็น, duplication ข้าม workspace members
   - ไม่ refactor: single responsibility ชัด, cohesive สูง, เปลี่ยนด้วยกัน, deploy ด้วยกัน
3. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขต minimal

### 3. Plan Refactor

> Goal: วางแผนการ split/merge/relocate workspace members

1. ทำ `/plan` เพื่อสร้างแผน split, extract, merge, หรือ relocate
2. ทำ `/follow-single-responsibility` เพื่อแยกแผน refactor ออกเป็นรายการ numbered list ทีแต่ละข้อทำงานเดียว
3. ระบุ workspace member boundaries ตาม domain, reason to change, cohesion
4. ระบุ consumers, public API, และ dependencies ที่จะกระทบ
5. จัดลำดับตาม dependency direction (foundation ก่อน)
6. ทำ `/report-plan` ก่อนลงมือ execute

### 4. Scan And Recommend Workspace Members

> Goal: สำรวจ workspace และแนะนำ workspace members

1. สำรวจโครงสร้าง workspace และอ่าน manifest ของแต่ละ workspace member
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
3. ใช้ `/review-architecture` เพื่อจัดการ barrel exports และ import aliases
4. ทำ `/update-references` หลังทุกการย้าย — ถ้า broken → `/resolve-errors`
5. ลบ dependencies ที่ไม่จำเป็น

### 6. Verify Impact And Update References

> Goal: ตรวจสอบผลกระทบและอัปเดท references

1. ทำ `/run-verify-fast`
   - ทำ `/run-test`
   - ทำ `/run-typecheck`
2. ทำ `/check-circular-dependencies` และ `/review-quality`
3. ทำ `/check-code-structure` เพื่อเปรียบเทียบกับ baseline
4. ถ้าไม่ผ่าน → กลับไปแก้ที่ Step 3-5 (สูงสุด 3 ครั้ง → stop/report)
5. ทำ `/update-references` และ `/edit-relative` สำหรับทุก references ที่เปลี่ยน

## Rules

### 1. Cohesion First

- รวม code ที่ changes together, deploys together, tests together
- หลีกเลี่ยง fragmentation ที่เพิ่ม cognitive load
- พิจารณา dependency graph complexity

### 2. When To Refactor Vs Not

- Refactor: หลาย reasons to change, test ยาก, coupling สูง, ไม่ reusable, dependencies ไม่จำเป็น, duplication ข้าม workspace members
- ไม่ refactor: single responsibility ชัด, cohesive สูง, เปลี่ยนด้วยกัน, deploy ด้วยกัน
- ถ้า refactor ทำลาย stability หรือเพิ่ม fragmentation → อย่า refactor

### 3. Dependency Direction

- Foundation workspace members ไม่มี dependency กับอื่น
- High-level workspace members พึ่งพา low-level workspace members เท่านั้น
- ไม่มี circular dependencies
- จัดลำดับการทำงานตาม dependency direction

### 4. Public API And Boundaries

- แต่ละ workspace member มี barrel file (`index.ts`) เป็น public API
- เก็บ internal code private
- ห้าม import ลึกเข้าไปใน workspace member
- ใช้ barrel exports กำหนด public surface

### 5. Safety And Minimal Changes

- ทำ `/dont-over-engineer` — ไม่สร้าง micro-workspace members
- ไม่สร้าง abstraction ที่ไม่จำเป็น
- ทำ `/update-references` หลังทุกการย้าย code
- ถ้า broken references → ทำ `/resolve-errors`

## Expected Outcome

- Workspace members มี single responsibility, high cohesion, low coupling
- ไม่ over-refactor หรือ fragmentation
- รายงาน workspace members ที่ควรใช้แบ่งตาม priority
- Code ผ่าน tests, lint, typecheck
- ไม่มี circular dependencies, broken references, regression

## Guide

- `references/use-workspace-members.md` — วิธีวิเคราะห์และแนะนำ workspace members จาก workspace
- `lib`/`shared` เป็นชื่อหรือ category ทั่วไป ไม่บังคับ ขึ้นกับ convention ของแต่ละ project

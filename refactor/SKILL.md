---
name: refactor
description: Refactor codebase ครบวงจร — SRP/SoC violations, boundaries, content, workflows
---

## Goal

Refactor codebase ครบวงจรเพื่อปรับปรุงคุณภาพโค้ดและ maintainability — ครอบคลุม SRP/SoC violations, boundaries, content, workflows — โดยใช้ minimal changes ไม่ over-engineer

## Scope

ใช้สำหรับ refactor ทั้ง monorepo และ individual workspaces — ครอบคลุม code, content (docs, markdown), และ workflows ที่พบ mixed concerns, SRP violations, ไฟล์ที่รวมหลาย responsibility, หรือ boundary ไม่ชัดเจน

## Execute

### 1. Review Codebase Everything

Deep Review codebase ครบทุกมิติก่อนเริ่ม refactor

> Goal: เข้าใจสถานะปัจจุบันของ codebase ครบทุกมิติก่อนลงมือ refactor

1. ทำ `/review-codebase-everything` เพื่อ deep review ครบทุกมิติอย่างลึกซึ้ง พร้อม validate issues

### 2. Analyze And Baseline

วิเคราะห์โปรเจกต์แบบลึกซึ้ง ระบุ SRP/SoC violations วางแผน refactor และบันทึก baseline

> Goal: เข้าใจโครงสร้าง ระบุปัญหา และมี baseline ก่อน refactor

1. ทำ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์โปรเจกต์ครบทุกมิติ
2. ทำ `/follow-architecture`, `/deep-review`, `/review-refactor`, `/follow-principles-engineering` — architecture, SRP/SoC, code smells, coupling, engineering principles
3. ทำ `/analyze-code-structure`, `/check-duplication`, `/check-long-files`, `/use-lib-effective` — structure, duplication, long files, dependencies
4. ระบุ violation type ตาม category:
   - Code: God modules, multi-responsibility functions/classes, mixed concerns
   - Content: docs ที่ครอบคลุมหลาย topics, markdown ที่ผสมหลาย sections ไม่เกี่ยวข้องกัน
   - Workflows: workflow ที่มีหลาย responsibilities, เกิน 250 บรรทัด, มี steps เกิน 10
5. ถ้าเป็น monorepo → ทำ `/follow-monorepo`
6. ทำ `/run-test` รัน tests บันทึก baseline — ถ้ามี failing tests ให้ทำ `/resolve-errors` ก่อน — ถ้าแก้ไม่ได้ stop และ report
7. บันทึก findings ทั้งหมดเป็น baseline: file path, category, violation type, current/target responsibilities

### 3. Plan And Separate Concerns

วางแผน refactor และแยก concerns ตาม responsibility

> Goal: แผน refactor ชัดเจน แยก concerns ตาม domain, layer, หรือ reason to change

1. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขต refactor ให้ minimal
2. ทำ `/pondering` เพื่อทบทวนผลกระทบของการ split และ restructure ก่อนดำเนินการ
3. จัดกลุ่ม violations ตาม category และ type — กำหนด action: split, extract, relocate — จัดลำดับตาม dependency direction (leaf units ก่อน)
4. ระบุ consumers, call sites และ public API ที่จะกระทบ — ถ้าเปลี่ยนต้องอัปเดท consumers
5. ทำ `/follow-functional-core-imperative-shell`, `/follow-clean-architecture`, `/improve-typesafe` — แยก pure/impure, layers, type safety
6. แยก business logic, UI, data access, utilities, และ types ออกจากกัน — กำหนด public API ของแต่ละ module
7. ใช้ `sg outline --items exports` ยืนยันว่า split ไม่ทำลาย exported API

### 4. Refactor Units

Refactor code, content, และ workflow units ที่มีหลาย responsibilities

> Goal: ทุก unit มี single responsibility ชัดเจน — code, content, workflows

1. ถ้า code ยังไม่มี module structure → ทำ `/refactor-packages` ก่อนเพื่อแปลงเป็น modules/packages
2. แยก God modules — ระบุ responsibilities ที่ปนกัน, แยกแต่ละ responsibility ออกเป็น module ใหม่
3. Extract multi-responsibility functions — ระบุ operations ที่ปนกัน, extract แต่ละ operation เป็น function ใหม่, สร้าง orchestrator
4. Split multi-responsibility classes — ระบุ member groups ตาม responsibility, extract แต่ละ group เป็น class/type ใหม่, ใช้ composition
5. ทำ `/refactor-long-files`, `/refactor-packages` — long files and mixed module/package responsibilities
6. แยก content ที่ผสมหลาย topics ออกเป็นไฟล์ใหม่ — ตั้งชื่อไฟล์ให้สะท้อน topic, สร้าง index
7. ทำ `/review-naming`, `/simplify` — rename identifiers และ simplify functions ที่ซับซ้อน
8. ทำ `/check-circular-dependencies` หลัง split/move และ `/update-reference` หลัง split ทุกระดับ — ถ้ามี broken references → ทำ `/resolve-errors`

### 5. Refactor Workspaces

ทำ refactor ระดับ workspace หรือ monorepo — เริ่มจาก shared packages ก่อน

> Goal: refactor ครบทุก workspace เริ่มจาก shared packages

1. ถ้าเป็น monorepo → ย้าย code ไป shared packages (ถ้าจำเป็น) แล้วทำ `/all-workspaces` สำหรับทุก workspace (เริ่มจาก shared packages) — ถ้าเป็น single workspace → ทำ `/all-workspaces` สำหรับ workspace เดียว
2. ทำ `/refactor-packages` สำหรับแต่ละ workspace — ถ้า fail ให้ทำ `/resolve-errors`
3. ตรวจสอบ dependencies ระหว่าง workspaces ถ้ามี conflict ให้ทำ `/resolve-errors`

> Reminder: code units refactor เป็น foundation ก่อน workspace refactor

### 6. Enforce Boundaries And Restructure

Enforce module boundaries, อัปเดท references, restructure files และ setup import alias

> Goal: boundaries ชัดเจน references ถูกต้อง structure เป็นระเบียบ

1. ทำ `/follow-import-export` เพื่อจัดการ barrel exports และ import aliases — ซ่อน internal symbols ที่ไม่ต้อง public
2. ใช้ path aliases / import rules ป้องกันการ import เข้าไปข้างใน module — อัปเดท `ast-grep` rules หรือ `biome.jsonc` ถ้าจำเป็น
3. ทำ `/update-reference` เพื่ออัปเดท references หลัง refactor — ถ้ามี broken references ให้ทำ `/resolve-errors`
4. ทำ `/restructure`, `/review-config` — physical structure, config optimization
5. ตรวจสอบว่า import alias ทำงานได้ถูกต้อง ถ้า fail ให้ทำ `/resolve-errors`

### 7. Final Verify

ตรวจสอบผลลัพธ์หลัง refactor เสร็จ

> Goal: ไม่มี regression duplication ลดลง ไม่มี unused code ทุก unit มี single responsibility

1. ทำ `/analyze-code-structure`, `/run-test`, `/run-check` — structure vs baseline, regression, lint/typecheck
2. ทำ `/check-duplication`, `/check-unused-deps`, `/check-unused-files` — duplication vs baseline, unused code
3. ตรวจ workflows: ไม่เกิน 250 บรรทัด, steps ไม่เกิน 10, single responsibility
4. ตรวจ content: แต่ละไฟล์ครอบคลุม topic เดียว
5. ใช้ `sg outline --items exports` ตรวจสอบ public API ไม่เปลี่ยนโดยไม่ตั้งใจ
6. รัน build เพื่อยืนยันไม่มี build errors ถ้า fail ให้ทำ `/resolve-errors`
7. ถ้า SRP/SoC violations ยังมี → กลับไปแก้ที่ Steps 2-3 (max 3 ครั้ง → stop/report)

### 8. Report

รายงานผล refactor พร้อมเปรียบเทียบ before/after

> Goal: รายงานผล refactor พร้อมเปรียบเทียบ before/after

1. ทำ `/report` พร้อม `/report-format-table`
2. สร้างตาราง Violations Before/After: File, Category, Violation Type, Before Status, After Status
3. สร้างตาราง Refactored Units: File, Category, Action, New Units, Responsibility
4. สรุป files refactored, concerns separated, boundaries created, test/lint status
5. ทำ `/suggest-next-action`

## Rules

### 1. SRP And Concern Separation

- ทุก unit ต้องมีหนึ่ง responsibility และหนึ่ง reason to change — ครอบคลุม code, content, workflows
- ถ้าไม่แน่ใจว่า violate SRP หรือไม่ → ระบุ responsibilities ของ unit นั้น ถ้ามีมากกว่าหนึ่ง → violate
- แยก pure functions, side effects, UI, data access ออกจากกัน — ไม่ mix business logic กับ presentation
- แยกตาม reason to change ไม่ใช่ตามขนาดไฟล์

### 2. Boundary Enforcement

- ซ่อน internal symbols จาก public API — ใช้ barrel exports กำหนด public surface
- ห้าม import ลึกเข้าไปใน module ที่ไม่ใช่ public API
- แยก layers ตาม dependency rule: outer layer ไม่ import inner layer

### 3. Baseline And Regression

- ต้องมี baseline tests ก่อน refactor เสมอ — coverage หลัง refactor ต้องไม่ลดลง
- ถ้า tests fail หลัง refactor ให้ rollback และทำ `/resolve-errors`
- Refactor shared packages ก่อน workspaces — shared packages ต้อง generic และ reusable

### 4. Minimal Changes And Safety

- ใช้ `/dont-over-engineer` เป็นหลัก — ใช้ `single-line change` เมื่อเป็นไปได้ — ใช้ `YAGNI` principle
- ไม่สร้าง abstraction ที่ไม่จำเป็น — ไฟล์ไม่จำเป็นต้อง 1 symbol เสมอ ขอให้ symbols เกี่ยวข้องกับ responsibility เดียว
- Destructive refactor actions (split, move, delete) ต้องมี user confirmation
- ทำ `/simplify` หลัง refactor ทุกครั้ง — ลดความซับซ้อนโดยไม่สูญเสีย context
- ทำ `/update-reference` หลังทุกการ split, extract, หรือ rename — ถ้ามี broken references → ทำ `/resolve-errors`

### 5. Incremental Commits

- Commit หลังแต่ละ step ที่สำคัญ (หลัง step 2, 4, 5)
- ใช้ conventional commits: `refactor: <scope> <description>`
- แต่ละ commit ต้องผ่าน `bun run check` ก่อน — ถ้า step ไหน fail ให้ rollback ได้ง่ายโดยไม่กระทบ step อื่น

## Expected Outcome

- Code units มี single responsibility, type safety สูง, ไม่มี code smells
- God modules ถูก split, multi-responsibility functions/classes ถูก extract/split ด้วย composition
- Content แต่ละไฟล์ครอบคลุม topic เดียว — workflows แต่ละไฟล์มี single responsibility, ไม่เกิน 250 บรรทัด
- Boundaries ระหว่าง modules และ layers ชัดเจน — import alias ทำงานได้
- Workspaces refactor ครบ — shared packages generic และ reusable (ถ้าเป็น monorepo)
- Code ผ่าน lint, typecheck, test และ build — coverage ไม่ลดลงจาก baseline
- Duplication ลดลง ไม่มี circular dependencies ไม่มี unused code
- รายงานตาราง Violations Before/After พร้อม action ถัดไป

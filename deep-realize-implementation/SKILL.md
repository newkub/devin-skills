---
name: deep-realize-implementation
description: Realize implementation ครบวงจร — deep review, plan, schema, API, UX, validation
argument-hint: "[scope]"
related:
  - realize-implementation
  - implement-mock
  - implement-todo-md
  - implement-features-to-mvp
  - deep-analyze
  - deep-analyze-by-use-scripts
  - deep-review
  - deep-plan
  - deep-refactor
  - deep-validate
  - review-codebase-everything
  - use-lib-effective
  - alternative
  - resolve-errors
  - refactor
  - restructure
  - update-references
  - run-verify
  - rethink
---

## Goal

Realize implementation ครบวงจร — แปลง TODO, MOCK, FAKE, STUB, placeholder เป็น production code จริง พร้อม deep analysis, planning, และ multi-dimensional validation

## Scope

ใช้เมื่องาน implement มีความซับซ้อนสูง ต้อง integrate หลาย layer หรือต้องแทนที่ mock/placeholder หลายจุด — ไม่ใช่สำหรับแก้ไขเฉพาะหน้า

ดูเพิ่มเติม: /review-codebase-everything

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ

### 1. Deep Review And Inventory

> Goal: เข้าใจสภาพปัจจุบันและสิ่งที่ต้อง realize ทั้งหมด

1. ทำ `/deep-thinking` เพื่อวิเคราะห์เป้าหมายและ assumptions
2. ทำ `/deep-analyze` และ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ codebase
3. ทำ `/deep-review` เพื่อ review ครบทุกมิติ
4. ทำ `/report-scan-todo` เพื่อรวบรวม TODO/FIXME/HACK/placeholder
5. ระบุ MOCK, FAKE, STUB, hard-coded values, in-memory stores, simulated delays
6. บันทึก inventory เป็น prioritized list ตาม critical path

### 2. Plan Realization

> Goal: วางแผนการ implement อย่างปลอดภัย

1. ทำ `/deep-plan` เพื่อวางแผนรายละเอียด
2. ทำ `/deep-impact` สำหรับ changes ที่มีผลกระทบสูง
3. จัดลำดับตาม critical path: schema → data → API → UX/UI
4. กำหนด rollback plan สำหรับ breaking changes
5. สร้าง `.devin/plan/<title>-<date>.md` ถ้างานซับซ้อน

### 3. Implement Schema And Data Layer

> Goal: สร้าง foundation ทีแข็งแรรง

1. ทำ `/follow-orm` หรือ `/follow-lib-drizzle` ถ้าใช้ database
2. สร้าง/อัปเดต schema, migrations, validation schemas, types
3. Implement repository/queries layer สำหรับทุก data models
4. รัน migrations และ seed data สำหรับ test
5. ตรวจสอบ type flow: schema → validation → API → UI
6. ถ้า fail → ทำ `/resolve-errors` ก่อนดำเนินต่อ

### 4. Implement Real API And Services

> Goal: เชื่อมต่อ API กับ data layer จริง

1. ทำ `/use-lib-effective` เพื่อเลือก libraries ที่มีอยู่
2. Implement API handlers ด้วย real data queries
3. เพิ่ม auth middleware, rate limiting, validation
4. Implement external service integrations ด้วย real credentials
5. ใช้ `/follow-service-*` ตาม service ที่ใช้
6. ใช้ `/resolve-errors` ถ้า integration fail

### 5. Connect UX/UI To Real Data

> Goal: แทนที่ mock UI data ด้วย real API calls

1. ทำ `/implement-features-to-mvp` เพื่อ implement UI features ที่ขาด
2. แทนที่ hard-coded data ใน components ด้วย real API calls
3. Implement loading, error, empty states สำหรับทุก data-driven component
4. เชื่อม form validation กับ validation schemas
5. เชื่อม auth UI กับ auth service จริง
6. ทำ `/follow-tool-react-scan` ถ้าเป็น React และมี performance issues

### 6. Convert TODOs And Stubs

> Goal: แปลงทุก TODO/STUB เป็น production code

1. ทำ `/implement-todo-md` ถ้ามี `TODO.md`
2. ทำ `/implement-mock` ถ้ามี MOCK/FAKE/STUB
3. ค้นหา placeholder functions และแทนที่ real implementation
4. ใช้ `/alternative` ถ้าต้องเลือก library ใหม่
5. ตรวจสอบว่าไม่มี TODO/MOCK/placeholder เหลือ

### 7. Deep Refactor And Restructure

> Goal: ปรับปรุง quality และ structure

1. ทำ `/deep-refactor` เพื่อ refactor ครบวงจร
2. ทำ `/restructure` เพื่อจัดโครงสร้างไฟล์ตาม domain
3. ทำ `/update-references` เพื่อ sync references
4. ทำ `/refactor` เพื่อปรับ style และ boundaries
5. ตรวจไฟล์ไม่เกิน 250 บรรทัด

### 8. Comprehensive Validation

> Goal: ตรวจสอบว่า everything ทำงานได้จริง

1. ทำ `/deep-validate` สำหรับ cross-reference, type, security, compliance
2. ทำ `/run-verify` เพื่อ lint, typecheck, test, build
3. ทำ `/run-test-coverage` เพื่อ verify 100% coverage
4. ทำ `/run-test-e2e` เพื่อ verify end-to-end
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 9. Report And Suggest

> Goal: รายงานผลและ next action

1. ทำ `/report-before-after` สรุปสิ่งที่เปลี่ยน
2. ทำ `/report-table` สรุป TODO/MOCK ที่ถูก realize, validation status
3. ทำ `/suggest-next-action` เพื่อแนะนำ next action

## Rules

### 1. No Mock In Production

- ไม่มี mock data หรือ in-memory stores ใน production code
- ไม่มี simulated delays หรือ hard-coded values
- UX/UI ใช้ real API calls เท่านั้น

### 2. Type And Validation Flow

- รักษา type flow ครบ: schema → validation → API → UI
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ
- หลีกเลี่ยง `any` ใช้ `unknown` แทน
- validation ทุก boundary

### 3. Security And Resilience

- validate/sanitize ทุก user input
- ไม่ expose secrets หรือ API keys ใน client
- throw error ถ้า required env vars ขาด
- retry, circuit breaker, fallback สำหรับ external calls
- structured logging และ metrics

### 4. Incremental Realization

- ทำทีละ batch ตาม critical path
- verify หลังแต่ละ batch
- มี rollback plan สำหรับ breaking changes
- ใช้ `/dont-over-engineer`

### 5. UX/UI Completeness

- ทุก data-driven component มี loading, error, empty states
- form validation ตรงกับ API validation
- user-friendly error messages
- optimistic updates เฉพาะเมื่อเหมาะสม

- ใช้ /realize-implementation ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /rethink ถ้าจำเป็น

## Expected Outcome

- ไม่มี TODO/MOCK/FAKE/STUB/placeholder ใน production code
- schema, validation, types, API, UX/UI เชื่อมต่อกัน
- ผ่าน `/deep-validate` และ `/run-verify`
- ผ่าน test coverage และ e2e
- รายงาน before/after, risks, next actions


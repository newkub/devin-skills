---
name: update-specs
description: สร้างหรืออัปเดต `<workspace>/specs/` สำหรับ test specs ตาม project type
related:
  - update-test-everything
  - update-project
  - update-project-rules
  - deep-test
  - review-update
  - run-test-coverage
  - review-writing
  - deep-validate
  - check-reference
---

## Goal

สร้างหรืออัปเดต `<workspace>/specs/` ให้เป็นที่เก็บ test specs ของ workspace ครอบคลุม test plan, overview, และ per-feature spec files

## Scope

ใช้ใน workspace ใดๆ หรือถูกเรียกจาก `/update-test-everything`, `/update-project`, `/update-project-rules` เพื่อ sync test specs ให้สอดคล้องกับ code

## Execute

### 1. Detect Test Context

> Goal: รวบรวม context ที่จำเป็นก่อนเขียน spec

1. อ่าน package manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) เพื่อหา test framework
2. ตรวจ test config files (`vitest.config.*`, `jest.config.*`, `pytest.ini`, `nextest.toml`)
3. สแกน `tests/` หรือ test directories ที่มีอยู่
4. ระบุ coverage target, test types (unit, integration, e2e, etc.) จาก config หรือ context

### 2. Initialize Specs Directory

> Goal: เตรียม `<workspace>/specs/`

1. สร้าง `<workspace>/specs/` ถ้ายังไม่มี
2. ตรวจสอบว่าไม่มี `spec/` directory ซ้ำ ถ้ามี → ย้ายหรือแจ้ง user ก่อนเปลี่ยน
3. เตรียม structure: `specs/overview.md`, `specs/SPEC.md`, และ `specs/<feature>.md` ตาม modules

### 3. Write Spec Files

> Goal: เขียน spec files ใน `<workspace>/specs/`

1. สร้าง/อัปเดต `specs/overview.md` ระบุ framework, coverage threshold, structure, และ test strategy
2. แยก spec เป็นไฟล์ย่อยๆ ตาม modules/features ใน `specs/<module>.md`
3. บันทึก test cases ทั้งหมดแบบกระชับ พร้อม status tracking (pending/written/covered)
4. แต่ละ spec file ไม่เกิน 250 บรรทัด — ถ้าเกินให้ refactor แยกไฟล์

### 4. Sync Specs With Tests

> Goal: sync `specs/SPEC.md` กับ test cases ที่มีอยู่

1. อ่าน test files ทั้งหมดใน `tests/`
2. อัปเดต `specs/SPEC.md` หรือเอกสาร test plan ด้วย test cases ที่มี
3. ระบุ gaps: test cases ที่มีใน spec แต่ยังไม่มี test, หรือ test ใหม่ที่ไม่อยู่ใน spec
4. ถ้า fail → retry (max 3 → stop/report)

### 5. Validate And Report

> Goal: ตรวจสอบความสมบูรณ์ของ specs

1. ทำ `/deep-validate` เพื่อตรวจ `specs/` ครบถ้วน
2. ตรวจว่า `specs/overview.md` และ `specs/SPEC.md` มีอยู่
3. ตรวจว่า spec files ไม่เกิน 250 บรรทัด
4. ทำ `/report-table` สรุป spec files ที่สร้าง/อัปเดต, gaps, และ next actions

## Rules

### 1. Location

- specs ต้องอยู่ที่ `<workspace>/specs/` (root ของ workspace)
- ไม่สร้าง `spec/` ซ้ำใน workspace ถ้ามี ให้เปลี่ยนเป็น `specs/` หรือถาม user ก่อนย้าย
- ไม่สร้าง specs ภายใน `.devin/` หรือ `tests/`

### 2. Idempotency

- รัน `/update-specs` ซ้ำได้โดยไม่ทำลาย spec ที่มีอยู่
- อัปเดตเท่าที่จำเป็น ไม่ overwrite เนื้อหาทั้งหมด

### 3. Single Responsibility

- แต่ละ spec file ครอบคลุม module/feature เดียว
- ไม่รวม implementation details หรือ test code ลงใน spec

### 4. Quality

- ใช้ `/review-writing` เพื่อตรวจคุณภาพเนื้อหา
- ใช้ backticks สำหรับ `commands`, `paths`, `skill names`
- ภาษา: ไทย/อังกฤษ ตาม project convention

### 5. Conditionality

- ถ้า workspace ไม่มี test framework → สร้าง `specs/overview.md` ระบุ recommended test strategy
- ถ้างานเช็ค/verify → focus ที่ sync `specs/SPEC.md`

- ใช้ /deep-test ถ้าจำเป็น
- ใช้ /review-update ถ้าจำเป็น
- ใช้ /run-test-coverage ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome

- `<workspace>/specs/` ถูกสร้าง/อัปเดต
- `specs/overview.md` ครอบคลุม framework, coverage threshold, structure
- `specs/SPEC.md` หรือ test plan sync กับ test files
- spec files ตาม module/feature ไม่เกิน 250 บรรทัด
- ผ่าน `/deep-validate`
- รายงาน spec files ที่สร้าง/อัปเดต, gaps, next actions

## Common Mistakes

- สร้าง spec ใน `spec/` แทน `specs/`
- รวมหลาย module ในไฟล์เดียวจนเกิน 250 บรรทัด
- ลืม sync `specs/SPEC.md` กับ test files จริง

## Anti-Patterns

- สร้าง spec ไว้ใน `.devin/`
- copy test code ลง spec
- ไม่ตรวจสอบว่ามี `spec/` directory อยู่ก่อน

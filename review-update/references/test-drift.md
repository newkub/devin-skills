# Test Suite Drift Checks

## Checks

### Coverage Drift

- ตรวจสอบ test coverage เทียบกับ source code
- ระบุ source files ที่ไม่มี test files
- ระบุ test files ที่อ้างถึง source files ที่ไม่มีแล้ว

### Spec Drift

- เปรียบเทียบ `specs/SPEC.md` กับ actual test files
- ระบุ test cases ใน spec ที่ไม่มีใน tests จริง
- ระบุ test cases ใน tests ที่ไม่มีใน spec

### Test Framework Drift

- ตรวจสอบ test framework version เทียบกับ latest
- ระบุ deprecated test APIs ที่ใช้
- ตรวจสอบ test config (`vitest.config.ts`, `jest.config.js`) ครอบคลุม settings ที่จำเป็น

### Test Organization Drift

- ตรวจสอบ test file locations ตาม conventions
- ระบุ test files ที่อยู่ผิดที่ (colocated vs separate ไม่ consistent)
- ตรวจสอบ test naming conventions

### Test Quality Drift

- ตรวจสอบว่า tests ครอบคลุม categories ครบ (happy path, error path, edge cases, etc.)
- ระบุ source files ที่มี tests แต่ขาด critical categories
- ตรวจสอบ test data strategy (factories, fixtures, builders)

## Drift Severity

- Critical: source files สำคัญไม่มี tests เลย, spec ผิดพื้นฐาน
- High: coverage ต่ำ, ขาด critical test categories, test framework ล้าหลังมาก
- Medium: coverage ล้าหลังเล็กน้อย, ขาดบาง categories, test organization ไม่ consistent
- Low: minor naming inconsistency, cosmetic spec drift

## Recommended Update Skills

- `update-specs` สำหรับ `specs/SPEC.md`
- `update-test-and-fix` สำหรับ update test suite

# Prepare Context

## Goal

เข้าใจ test structure และ project context ก่อน review tests

## Checks

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ test setup
2. ตรวจ test framework จาก `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`
3. ตรวจ test config files: `vitest.config.ts`, `jest.config.js`, `pytest.ini`
4. ตรวจ test directory structure: `tests/unit/`, `tests/integration/`, `tests/e2e/`, `tests/fixtures/`
5. ถ้าไม่พบ test setup → flag เป็น critical gap

## Severity

- Critical: ไม่พบ test framework หรือ test setup ทั้งหมด
- High: test config ขาดหรือผิด ecosystem
- Medium: test directory structure ไม่สอดคล้อง convention
- Low: fixture folder หรือ naming ไม่สม่ำเสมอ

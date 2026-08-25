# Coverage Gap Detection Criteria

## Goal

ระบุ coverage gaps ก่อน `run-test-coverage`

## Checks

### Source-To-Test Mapping

1. ตรวจ source files ที่ไม่มี corresponding test files
2. ตรวจ test files ใช้ naming conventions: `.test`, `.spec`, `_test`
3. ตรวจ test files อยู่ใน location ที่ถูกต้อง: `tests/unit/`, `tests/integration/`, `tests/e2e/`
4. ตรวจไม่มี colocated และ separate tests ผสมกัน

### Function And Branch Coverage

1. ตรวจทุก public function มี test
2. ตรวจทุก branch ใน `if/else`, `try/catch`, `switch`, ternary มี test
3. ตรวจ async patterns: promises, streams, generators, event emitters มี test
4. ตรวจ error paths มี test ไม่ใช่แค่ทดสอบว่าไม่ throw

### Coverage Categories

1. ตรวจ `lines` coverage ถึง target
2. ตรวจ `branches` coverage ถึง target
3. ตรวจ `functions` coverage ถึง target
4. ตรวจ `statements` coverage ถึง target

### Coverage Targets

- Minimal: unit 70%, overall 70%
- Standard: unit 85%, integration 60%, overall 80%
- Complete: unit 95%, integration 80%, e2e 50%, overall 90%

## Severity

- Critical: source file ไม่มี test, public function ไม่มี test, coverage < 50%
- High: branch ไม่มี test, error path ไม่มี test, coverage < target
- Medium: coverage ใกล้ target แต่ไม่ถึง, missing edge case test
- Low: test file ผิด convention, missing documentation test

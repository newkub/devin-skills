# Test Isolation And Fixture Checks

## Goal

ตรวจ test isolation และ fixture quality ใน test suite

## Checks

### Test Isolation

1. ตรวจ tests ไม่แชร์ state ระหว่างกัน
2. ตรวจ cleanup หลังแต่ละ test: `afterEach`, `teardown`
3. ตรวจ tests รันได้อิสระ ไม่ขึ้นกับลำดับ
4. ตรวจไม่มี test interdependence

### Fixtures And Factories

1. ตรวจ fixtures ใช้สำหรับ static data
2. ตรวจ factories ใช้สำหรับ dynamic data
3. ตรวจ builders ใช้สำหรับ complex objects
4. ตรวจ test data ไม่ hardcode sensitive data (passwords, API keys, tokens)

### Mock Strategy

1. ตรวจ mock external dependencies เฉพาะที่จำเป็น (DB, API, email)
2. ตรวจใช้ real implementations สำหรับ internal pure functions
3. ตรวจ restore/cleanup mocks หลังแต่ละ test
4. ตรวจไม่ hardcode credentials ใน test files
5. ตรวจใช้ environment variables สำหรับ secrets
6. ตรวจใช้ test databases แยกจาก production

### Flakiness

1. ตรวจไม่มี flaky tests (pass/fail ไม่ consistent)
2. ตรวจไม่ assert ค่าที่ non-deterministic
3. ตรวจใช้ `expect.any(Date)` หรือ `expect.any(String)` สำหรับ dynamic values
4. ตรวจไม่มี timing-dependent assertions

## Severity

- Critical: tests แชร์ state, ไม่มี cleanup, hardcode credentials
- High: flaky tests, mock strategy ผิด, test interdependence
- Medium: fixtures ไม่ใช้, factories ขาด, non-deterministic assertions
- Low: cleanup ไม่สม่ำเสมอ, mock cleanup ขาด

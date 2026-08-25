# Edge Case And Boundary Condition Checks

## Goal

ตรวจ edge cases และ boundary conditions ครบถ้วนใน test suite

## Required Categories

ตรวจทุก handler/function มี categories ต่อไปนี้:

1. Happy path: input ที่ถูกต้อง → expected output
2. Error path: dependency throw → error response ที่ถูกต้อง
3. Edge cases: empty input, null/undefined, boundary values
4. Unauthorized: auth missing หรือ invalid → reject
5. Input validation: invalid input ที่ผิด schema → validation error

## Conditional Categories

ตรวจ categories ต่อไปนี้เมื่อมี logic ที่เกี่ยวข้อง:

1. Permission/RBAC: user ไม่มี permission → deny
2. IDOR/Ownership: user เข้าถึง resource ของ user อื่น → deny
3. Sanitization: malicious input → sanitized output
4. userId injection: userId มาจาก auth ไม่ใช่ input
5. Empty results: query return empty → handle ถูกต้อง
6. Boundary values: min/max ของ numeric input
7. Optional fields: ส่งและไม่ส่ง → ทำงานถูกต้องทั้งคู่
8. Concurrency: race conditions, parallel calls
9. Regression: bug fix ต้องมี test ป้องกัน recurrence

## Parameterized Tests

ตรวจใช้ `parameterized tests` (`it.each`, `table-driven`) สำหรับ:

- Boundary values หลายค่า
- Input validation หลายกรณี
- Permission matrix (role × action)

## Severity

- Critical: happy path ขาด, error path ขาด, security test ขาดใน critical path
- High: edge case ขาด, boundary value ขาด, input validation ขาด
- Medium: conditional category ขาด, parameterized test ไม่ใช้
- Low: regression test ขาดสำหรับ bug fix เก่า

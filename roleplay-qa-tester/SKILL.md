---
name: roleplay-qa-tester
description: รับบทเป็น QA engineer คิด edge cases boundary conditions และ test scenarios จาก code
---

## Goal

รับบทเป็น QA engineer อ่าน source code แล้วคิด edge cases, boundary conditions, และ test scenarios ที่ dev อาจมองข้าม เพื่อหาจุดที่ระบบอาจทำงานผิดพลาด

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง QA ครอบคลุม functional, non-functional, edge cases, และ risk-based testing โดย AI รับบทเป็น QA คิดเหมือนการทดสอบจริง

## Execute

### 1. Read Code Context

> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อหา testable code
2. อ่าน business logic, state machines, form validations, data transformations
3. อ่าน existing tests เพื่อเข้าใจ coverage ปัจจุบัน
4. อ่าน error handling, edge case handling, fallback behavior
5. ถ้าหา testable code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify QA Profile

> Goal: Identify QA Profile

1. ระบุ QA level (junior, mid, senior, lead)
2. ระบุ testing focus (functional, regression, exploratory, risk-based, accessibility)
3. ระบุ testing context (pre-release, hotfix, regression, new feature, integration)
4. ระบุ risk tolerance (life-critical, financial, consumer, internal tool)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Test Planning

> Goal: Simulate Test Planning

Goal reminder: คิดเหมือน QA จริงที่หา bug ไม่ใช่ dev ที่เชื่อว่า code ทำงานถูก

1. เลือก 3-5 features/flows ที่ risk สูงสุดจาก code
2. จำลอง test planning: จะทดสอบอะไร, อย่างไร, ทำไม
3. ระบุ test scenarios ที่ existing tests ไม่ครอบ
4. ระบุ edge cases ที่ dev อาจมองข้าม
5. ประเมิน risk ของแต่ละ area: High, Medium, Low

### 4. Analyze Every Testing Dimension

> Goal: Analyze Every Testing Dimension

Functional Edge Cases:

1. Boundary values: min, max, just below, just above, zero, negative, empty, null, undefined
2. Data variations: unicode, emoji, very long, very short, special chars, SQL-like, HTML-like, JSON-like
3. State transitions: valid, invalid, skipped, reversed, repeated, concurrent
4. Multi-step flows: interrupt, retry, cancel, timeout, resume, back, forward
5. Conditional logic: all branches, nested conditions, short-circuit, fallback, default cases
6. Data combinations: valid+valid, valid+invalid, invalid+invalid, empty+valid, conflicting

Input and Output:

7. Input validation: missing fields, extra fields, wrong types, malformed, oversized, empty body
8. File uploads: empty file, huge file, wrong type, malicious content, zip bomb, polyglot
9. Output format: empty result, single result, huge result, pagination, sorting, filtering
10. Error responses: error codes, error messages, error format, partial errors, cascading errors

Concurrency and Timing:

11. Race conditions: simultaneous create, update, delete, double submit, concurrent state change
12. Timing issues: timeout, slow response, fast consecutive, delayed retry, expired session
13. Order dependencies: out-of-order events, reordered operations, delayed events
14. Idempotency: duplicate requests, retry after timeout, replay, webhook redelivery

Data and State:

15. Data consistency: partial update, rollback failure, transaction timeout, stale cache
16. Empty states: no data, first user, deleted data, archived data, expired data
17. Data migration: old format, missing fields, extra fields, corrupted data
18. Cache behavior: cache hit, cache miss, cache expiry, cache invalidation, stale cache
19. Session and auth: expired session, concurrent sessions, role change mid-session, token refresh

Non-Functional:

20. Performance: large dataset, many concurrent users, slow network, resource exhaustion
21. Accessibility: keyboard-only, screen reader, high contrast, zoom, reduced motion
22. Compatibility: different browsers, different OS, different screen sizes, different locales
23. Security from QA angle: unauthorized access, permission bypass, data leak in UI, error message leak

### 5. Map Findings To Code

> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ testing dimension ที่เกี่ยวข้อง (functional, input, concurrency, data, non-functional)
4. ระบุ risk level และ test priority
5. ระบุว่า existing test ครอบอยู่ไหม
6. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate QA Report

> Goal: Generate QA Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Risk Scenario, Existing Coverage, Test Priority, Recommendation
3. สร้าง test scenario list: Scenario, Steps, Expected, Risk Level
4. สรุป top 3-5 high-risk areas ที่ต้อง test ก่อน
5. สรุป gaps ใน existing test coverage
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/run-test` หรือ `/write-test`

### 2. Think Like A QA Tester

- คิดเหมือน QA จริงที่หา bug ไม่ใช่ dev ที่เชื่อว่า code ทำงานถูก
- ถามตัวเอง "ถ้าเราเป็น QA จะทดสอบอะไร?" ทุก dimension
- ไม่เชื่อว่า happy path พอ — ต้องหา unhappy paths
- พิจารณา QA หลายระดับ (junior, mid, senior)
- คิดถึง user ที่ทำผิดพลาด ทำแปลก ทำไม่ตามขั้นตอน

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ระบุว่า existing test ครอบอยู่ไหม
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (functional, input, concurrency, data, non-functional)
- ตรวจจากหลาย QA perspective
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- เน้น high-risk areas ที่กระทบ user มากที่สุด

### 5. Severity

- Critical: ทำงานผิด, ข้อมูลเสียหาย, เงินผิด, security hole ที่ QA หาได้
- High: ทำงานได้แต่ผิดใน edge case สำคัญ, ขาด error handling, ขาด validation
- Medium: ทำงานได้ปกติ แต่ edge case แปลกๆ อาจผิด, UX แย่ในบางสถานการณ์
- Low: ไม่กระทบ functionality, แค่ quality ไม่ดี

### 6. Integration

- ถ้า test planning ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ scan test coverage จริง ให้ใช้ `/update-review-codebase-cli-and-run`
- ถ้าต้องการเขียน test จริง ให้ใช้ `/write-test`
- ถ้าต้องการรัน test จริง ให้ใช้ `/run-test`

### 7. Output

- รายงานตาราง risk scenarios ชัดเจน จัดกลุ่มตาม dimension
- test scenario list ที่ใช้ได้จริง
- สรุป high-risk areas และ coverage gaps
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน QA analysis จากมุมมอง QA tester ที่จำลองจาก source code
- ตาราง risk scenarios มี Severity, Dimension, Location, Risk Scenario, Existing Coverage, Test Priority, Recommendation
- test scenario list: Scenario, Steps, Expected, Risk Level
- ครอบคลุม 23 dimensions ครบ 5 หมวด (functional, input, concurrency, data, non-functional)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
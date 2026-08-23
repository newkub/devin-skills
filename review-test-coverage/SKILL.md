---
name: review-test-coverage
description: Review test-coverage
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review test coverage ของ project ครอบคลุม critical paths, error paths, edge cases, และ test quality พร้อม findings, severity, และ review score

## Scope

ใช้สำหรับ review test coverage ของ unit tests, integration tests, E2E tests — เน้นรายงาน gaps และ test quality ไม่แก้ไข code ระหว่าง review — ถ้าต้องการเพิ่ม tests ให้ทำ `/improve-test-coverage` หลัง report

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา test setup

> Goal: เข้าใจ test framework, structure, และ coverage tools

1. ทำ `/scan-codebase` เพื่อหา test files, config coverage, และ test runner
2. ระบุ test framework: `vitest`, `jest`, `mocha`, `playwright`, `cypress`, หรืออื่น
3. ตรวจสอบ coverage config: provider, thresholds, reporters
4. ทำ `/run-test-coverage` เพื่อดึง coverage report ล่าสุด
5. ถ้าไม่มี tests → stop และ report

### 2. Review Critical Path Coverage

ตรวจสอบ coverage ของ business logic สำคัญ

> Goal: ทุก critical path มี test ครอบคลุงหรือระบุ gaps

1. ระบุ business logic functions/classes ทีสำคัญ
2. ตรวจสอบว่า critical paths มี unit tests หรือ integration tests ครอบคลุม
3. ตรวจสอบ API endpoints ทีไม่มี integration test
4. ตรวจสอบ user flows สำคัญทีไม่มี E2E test
5. บันทึก gaps พร้อม file path, function name, และ rationale

### 3. Review Error Path Coverage

ตรวจสอบ error handling และ failure scenarios

> Goal: error paths ได้รับการ test ครบถ้วน

1. ตรวจสอบ test สำหรับ try/catch, error boundaries, fallback behavior
2. ตรวจสอบ test สำหรับ failure scenarios: network errors, timeout, invalid input, permission denied
3. ตรวจสอบ test สำหรับ validation errors: schema validation, type errors, constraint violations
4. ตรวจสอบว่า assertions ตรวจ error output, message, และ side effects อย่างถูกต้อง

### 4. Review Edge Case And Boundary Coverage

ตรวจสอบ edge cases และ boundary conditions

> Goal: ระบุขอบเขตทีขาด test

1. ตรวจสอบ boundary conditions: empty array, single item, max capacity, zero, null, undefined
2. ตรวจสอบ type coercion, unexpected input types, malformed data
3. ตรวจสอบ concurrent operations, race conditions, async timing
4. ตรวจสอบ locale, timezone, environment-specific edge cases ถ้าเกี่ยวข้อง

### 5. Review Test Quality

ตรวจสอบคุณภาพของ tests

> Goal: tests มีคุณค่าจริง ไม่เพิ่ม coverage โดยไร้ประโยชน์

1. ตรวจสอบว่าแต่ละ test มี assertion ทีชัดเจน
2. ตรวจสอบว่า tests isolated ไม่ depend บนลำดับการรัน
3. ตรวจสอบชื่อ test ในรูปแบบ `should <expected behavior> when <condition>`
4. ตรวจสอบว่าไม่มี tests ทีเพิ่ม coverage โดยไม่ verify behavior จริง
5. ตรวจสอบว่าไม่มี `skip`, `todo`, `only` โดยไม่จำเป็น

### 6. Validate Findings

ตรวจสอบความถูกต้องของ findings

> Goal: findings ถูกต้อง ลด false positives

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จาก coverage tools
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives พร้อมเหตุผล

### 7. Rate And Report

ให้คะแนนและรายงาน

> Goal: สรุป coverage gaps และ test quality

1. ให้ severity: Critical, High, Medium, Low, Info
2. คำนวณ review score จาก coverage percentage และ test quality
3. สร้างตาราง: category | before | after | status
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`


### 8. Fix

> Goal: ปรับปรุงตามประเด็นที review พบ

1. เรียงลำดับตาม severity Critical → High → Medium → Low
2. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา pattern ทีเหมาะสม
3. แก้ไขทีละประเด็น ใช้ minimal changes
4. ทำ `/validate` และ `/run-check` หลังแก้
5. ถ้าไม่ผ่าน → `/resolve-errors` แล้ว retry สูงสุด 3 รอบ
6. ทำ `/suggest-next-action` หลังผ่าน
## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี tests → stop และ report
- ถ้าไม่มี coverage config → ข้าม Step 1 item 4 และใช้ manual check

### 2. Severity Classification

- Critical: untested critical paths ที่มี risk สูง, missing error handling tests ใน critical paths
- High: untested API endpoints, untested critical user flows, tests ที่มี assertions ไม่ชัดเจน
- Medium: missing edge cases, partial coverage ใน non-critical paths, test names ไม่ชัดเจน
- Low: cosmetic, missing test descriptions, minor coverage gaps

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path, function name, และ line number ถ้าเป็นไปได้
- ใช้ coverage report เป็น evidence
- ระบุ threshold coverage percentage ที่ project กำหนด

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ tests ระหว่าง review
- ถ้าต้องการเพิ่ม tests → แนะนำ `/improve-test-coverage` หลัง report

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`


### Fix Rules
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`
## Expected Outcome

- รายงาน coverage gaps ตาม category พร้อม severity
- ตาราง test quality findings
- Review score สำหรับ test coverage
- Recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

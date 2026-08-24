---
name: review-service
description: Review service layer organization, boundaries, business logic, transactions, testability, DI
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

Review service layer ครอบคลุม organization, boundaries, business logic, transactions, testability พร้อม review score

## Scope

service review สำหรับ: service layer organization, single responsibility, boundary clarity, business logic patterns, data transformation, transaction boundaries, error propagation, testability, dependency injection, service-to-service communication, service naming, service file organization

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ service layer structure และ patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ service structure
2. ระบุ service patterns, DI approach, transaction strategy, service organization ที่ใช้
3. ถ้า project ไม่มี service layer → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก service dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ service patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Organization And Boundary Review

> Goal: ครอบคลุม organization, boundaries, single responsibility

1. ตรวจสอบ service organization: service file structure, service naming conventions, service grouping (domain-based, feature-based), service file size, service complexity
2. ตรวจสอบ single responsibility: one service per domain, service method cohesion, service method count, service responsibility clarity, mixed responsibility detection
3. ตรวจสอบ boundary clarity: service-to-API boundary, service-to-database boundary, service-to-service boundary, service-to-external boundary, boundary violations, leaking concerns
4. ตรวจสอบ service naming: service class naming, service method naming, service file naming, consistent naming across services, naming reflects domain
5. Critical: business logic in wrong layer (API handler, database), service boundary violation ที่ก่อให้เกิด coupling, circular service dependency
6. High: mixed responsibility, unclear boundary, inconsistent service naming, service ที่ทำหน้าที่หลาย domain, missing service layer (logic ใน API handler)

### 4. Business Logic, Transactions And Testability Review

> Goal: ครอบคลุม business logic, transactions, error propagation, testability, DI

1. ตรวจสอบ business logic patterns: domain logic in service, business rule validation, business rule enforcement, data transformation in service, calculation logic, decision logic
2. ตรวจสอบ transaction boundaries: transaction scope, transaction correctness, nested transactions, transaction error handling, transaction rollback, distributed transactions, saga pattern
3. ตรวจสอบ error propagation: service error handling, error wrapping, error mapping (domain error to API error), error context preservation, error propagation to caller
4. ตรวจสอบ testability: dependency injection, mockable dependencies, pure function isolation, side effect isolation, test setup complexity, service test coverage
5. ตรวจสอบ dependency injection: DI approach (constructor, factory, container), DI correctness, DI testability, hardcoded dependencies, DI scope (singleton, scoped, transient)
6. ตรวจสอบ service-to-service communication: service composition, service calling service, circular dependency, service coupling, service communication patterns
7. Critical: missing transaction boundary ที่ก่อให้เกิด data corruption, business logic in wrong layer ที่ก่อให้เกิด bug, circular service dependency, hardcoded dependency ที่ไม่ testable
8. High: missing error propagation, untestable service, missing DI, transaction scope too broad/narrow, service coupling, missing test coverage

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี service layer → ข้ามทั้งหมด
- ถ้า project ไม่มี transactions → ข้าม Step 4 item 2
- ถ้า project ไม่มี DI → ข้าม Step 4 item 5

### 2. Severity Classification

- Critical: business logic in wrong layer, service boundary violation ที่ก่อให้เกิด coupling, circular service dependency, missing transaction boundary ที่ก่อให้เกิด data corruption, hardcoded dependency ที่ไม่ testable
- High: mixed responsibility, unclear boundary, missing error propagation, untestable service, missing DI, transaction scope issue, service coupling, missing test coverage
- Medium: inconsistent service naming, suboptimal organization, minor boundary issue, suboptimal DI, missing service documentation
- Low: cosmetic, minor naming, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ service, method, หรือ boundary ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก service section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`


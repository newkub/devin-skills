---
name: follow-software-engineering
description: ออกแบบและเขียน software ที่ test ง่าย, scale ง่าย, debug ง่าย, และใช้งานง่าย
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ออกแบบและเขียน software ที่ test ง่าย, scale ง่าย, debug ง่าย, และใช้งานง่าย

## Scope

ใช้สำหรับออกแบบ architecture, เขียน code, และออกแบบ UX/UI ของโปรเจกต์ทุกประเภท

## Execute

### 1. Design Testable & Scalable Architecture

ออกแบบ architecture ที่ test ง่ายและ scale ง่าย

1. ทำ `/follow-clean-architecture` สำหรับโครงสร้างพื้นฐาน
2. แยก business logic จาก infrastructure
3. ใช้ dependency injection สำหรับ external dependencies
4. สร้าง interfaces สำหรับ external services
5. ออกแบบ modules ที่ independent และ loosely coupled
6. ใช้ stateless design สำหรับ scalability
7. ออกแบบ cache strategy
8. ใช้ async patterns สำหรับ I/O operations

### 2. Write Debuggable & Testable Code

เขียน code ที่ debug ง่ายและ test ง่าย

1. ทำ `/follow-functional-programming` เพื่อแยก pure logic จาก side effects
2. เขียน business logic เป็น pure functions
3. ใช้ naming ที่ชัดเจนและ meaningful
4. เขียน functions ที่ small และ focused (max 20-30 lines)
5. เพิ่ม logging ที่ meaningful และ structured
6. จัดการ errors อย่าง explicit ด้วย typed errors
7. เขียน code แบบ defensive ด้วย input validation
8. เพิ่ม observability (metrics, traces, health checks)

### 3. Design for Usability

ออกแบบให้ใช้งานง่าย

1. ทำ `/follow-web-design` สำหรับ design system principles
2. ออกแบบ API ที่ intuitive และ consistent
3. ใช้ sensible defaults
4. เพิ่ม auto-completion และ discoverability
5. ออกแบบ error messages ที่ helpful
6. ให้ examples และ documentation ที่ชัดเจน
7. ออกแบบ onboarding ที่ smooth
8. เพิ่ม feedback ที่ immediate และ clear

### 4. Create Clear Boundaries

สร้าง boundaries ที่ชัดเจนระหว่าง layers

1. ทำ `/follow-layered-architecture` สำหรับแยก layers
2. กำหนด interfaces ระหว่าง layers
3. ใช้ ports และ adapters pattern
4. แยก domain logic จาก application logic
5. แยก presentation logic จาก business logic

### 5. Implement Testing Strategy

จัดการ testing อย่าง systematic

1. ทำ `/write-test` สำหรับ testing strategy
2. เขียน unit tests สำหรับ pure functions
3. เขียน integration tests สำหรับ adapters
4. เขียน E2E tests สำหรับ critical flows
5. สร้าง test fixtures ที่ reusable
6. ใช้ test doubles สำหรับ external dependencies
7. ตั้งเป้าหมาย coverage ที่สูง

### 6. Add Documentation

เพิ่ม documentation อย่างสมบูรณ์

1. เขียน JSDoc สำหรับ public functions
2. อธิบาย parameters และ return values
3. ระบุ side effects
4. ให้ examples ที่ชัดเจน
5. เขียน README ที่ครบถ้วน
6. อัปเดต documentation อย่างต่อเนื่อง

## Rules

### 1. Architecture Rules

กฎสำหรับ architecture

- Separation of Concerns: แยก business logic, infrastructure, presentation
- Dependency Injection: Inject dependencies ผ่าน constructors
- Pure Functions: Business logic เป็น pure functions
- Clear Boundaries: กำหนด interfaces ระหว่าง layers
- Scalability: Stateless design, cache strategy, async patterns
- Testability: Dependency injection, test doubles, pure functions

### 2. Code Quality Rules

กฎสำหรับ code quality

- Clear Naming: ชื่อบอก purpose, verbs สำหรับ functions, nouns สำหรับ variables
- Small Functions: Single responsibility, max 20-30 lines, composition over nesting
- Meaningful Logging: Log critical points, structured logging, contextual information
- Explicit Error Handling: Typed errors, propagate clearly, meaningful messages
- Self-Documenting: Clear naming, no magic numbers, use constants
- Defensive Programming: Input validation, edge case handling, type guards
- Observability: Key metrics, distributed tracing, health checks

### 3. Usability Rules

กฎสำหรับ usability

- Intuitive API: Consistent naming, predictable behavior
- Sensible Defaults: Values ที่ work สำหรับ most cases
- Auto-Completion: DX first, discoverable APIs
- Helpful Errors: Error messages ที่บอกวิธีแก้
- Clear Documentation: Examples, tutorials, guides
- Smooth Onboarding: Quick start, progressive disclosure
- Immediate Feedback: Fast response, clear status

### 4. Testing Rules

กฎสำหรับ testing

- Unit Tests: Test pure functions ด้วย AAA pattern
- Integration Tests: Test adapters ด้วย mock ports
- E2E Tests: Test critical flows บน real environment
- Test Fixtures: Shared test data ที่ reusable
- Test Helpers: Test utilities สำหรับ setup/teardown
- High Coverage: ตั้งเป้าหมาย coverage สูง
- Fast Execution: Tests ควร run ได้เร็ว

### 5. Documentation Rules

กฎสำหรับ documentation

- JSDoc: สำหรับ public functions
- Purpose/Parameters/Return: อธิบายชัดเจน
- @throws: ระบุ errors ที่อาจ throw
- @example: ให้ examples ที่ใช้งานได้
- README: ครบถ้วนสำหรับ project
- Up-to-date: อัปเดตอย่างต่อเนื่อง

## Expected Outcome

- Architecture ที่ test ง่ายและ scale ง่าย
- Code ที่ debug ง่ายและ test ง่าย
- Design ที่ใช้งานง่ายและ intuitive
- Business logic ที่ pure และ testable
- Clear boundaries ระหว่าง layers
- Dependency injection ที่ดี
- High observability และ debuggability
- High test coverage
- Complete documentation
- Excellent developer experience

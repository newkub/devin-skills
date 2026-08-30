---
name: roleplay-staff-engineer
description: รับบทเป็น staff engineer ตรวจ architecture, tech debt, scalability trade-offs จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น staff engineer อ่าน source code เพื่อประเมิน architecture, technical strategy, tech debt, trade-offs, scalability, maintainability, และ engineering excellence

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง technical leadership ครอบคลุม architecture, boundaries, debt, performance, security, testing, และ long-term maintainability

## Execute

### 1. Read Code Context

> Goal: เข้าใจ architecture

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน package.json, moon.yml, Cargo.toml, workspace structure
3. อ่าน architecture docs, ADRs, design docs
4. อ่าน critical paths, core modules, boundaries
5. ถ้าไม่มี architecture context ให้ถามผู้ใช้

### 2. Identify Staff Engineer Profile

> Goal: ระบุ technical context

1. ระบุ tech stack และ maturity
2. ระบุ scale (users, data, traffic)
3. ระบุ team size และ velocity
4. ระบุ SLOs / non-functional requirements
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Architecture Review

> Goal: คิดเหมือน staff engineer review

1. เลือก 3-5 architecture concerns (scalability, maintainability, security, cost, velocity)
2. จำลอง: ถ้าต้องสอนทีมหรือ approve design จะถามอะไร
3. ระบุ tech debt ที่จะกลายเป็น bottleneck
4. ระบุ trade-offs ที่ทำไปแล้วและยังไม่ได้ทำ
5. ประเมิน long-term impact

### 4. Analyze Every Staff Engineer Dimension

> Goal: ตรวจ architecture quality

Structure and Boundaries:
1. Module boundaries ชัดเจนไหม
2. Single responsibility ของแต่ละ module
3. Dependency direction ถูกต้องไหม
4. Circular dependencies
5. Public API contracts

Tech Debt:
6. Legacy / deprecated code
7. TODO, HACK, STUB
8. Inconsistent patterns
9. Over-engineering หรือ under-engineering
10. Refactor candidates

Scalability and Reliability:
11. Bottlenecks ใน critical path
12. State management, concurrency
13. Caching strategy
14. Error handling, retries, circuit breakers
15. Data consistency

Security and Observability:
16. Security design, trust boundaries
17. Logging, metrics, tracing
18. Testing strategy, coverage
19. CI/CD, deployment safety
20. Documentation, runbooks

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ architecture dimension
4. ระบุ concern ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Staff Engineer Report

> Goal: สร้างรายงาน architecture review

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Engineering Impact, Recommendation
3. สร้าง architecture maturity scorecard
4. สรุป top 3-5 tech debt ที่ต้องแก้ก่อน
5. สรุป trade-offs ที่ต้อง revisit
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Staff Engineer
- คิดเหมือนคนต้องรับผิดชอบ technical direction
- ถามตัวเอง "ถ้าต้อง scale 10x จะเกิดอะไรขึ้น?"
- พิจารณา trade-offs และ long-term
- เน้น engineering excellence

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย architecture concern
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: สร้าง wrong abstraction, scale ไม่ได้, security design ผิด, tech debt บล็อก delivery
- High: module boundaries ไม่ชัด, missing tests, inconsistent patterns, major bottlenecks
- Medium: ขาด docs, minor debt, ขาด observability
- Low: formatting, naming, minor inconsistencies

### 6. Output
- รายงานตาราง findings ชัดเจน
- architecture maturity scorecard
- สรุป tech debt และ trade-offs
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน staff engineer review จากมุมมอง technical leader
- ตาราง findings มี Severity, Dimension, Location, Issue, Engineering Impact, Recommendation
- architecture maturity scorecard
- สรุป top 3-5 tech debt
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

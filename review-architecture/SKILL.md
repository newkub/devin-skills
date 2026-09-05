---
name: review-architecture
description: Review architecture, modularity, isolation, resilience, reliability, governance
related:
  - scan-codebase
  - deep-analyze
  - review-codebase-everything
  - deep-validate
  - report
  - report-table
  - suggest-next-action
  - improve-architecture
---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, anti-patterns, modularity, isolation, resilience, reliability, และ governance พร้อม review score

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, modularity, isolation, resilience, reliability, governance, data flow tracing, และ cost impact analysis

ดูเพิ่มเติม: /review-codebase-everything

## Execute

### 1. Prepare

> Goal: เข้าใจ architecture, patterns, module structure, dependency graph และ governance

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ architectural patterns, module/package boundaries, shared state, test strategy, environment separation, และ governance structure ที่ใช้
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก architecture dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
2. ทำ `/deep-review` แล้วรัน review analyzers
3. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
4. ตรวจสอบแต่ละ dimension ตาม reference files ใน [references/index.md](references/index.md)
5. ทำ data flow analysis ตาม [references/data-flow.md](references/data-flow.md)
6. ทำ cost impact analysis ตาม [references/cost-impact.md](references/cost-impact.md)
7. คำนวณ architecture review score จาก [references/scoring.md](references/scoring.md)

### 3. Review Paradigm Consistency

> Goal: ตรวจสอบวา module หรือ feature ใช้ programming paradigm ทีเหมาะสมและสม่ำเสมอ

1. ระบุ paradigm หลักทีใช้ในแต่ละ module: declarative, functional, imperative, object-oriented, reactive, dynamic programming
2. ตรวจสอบ consistency: paradigm หลักต้องสม่ำเสมอภายใน module หรือ feature
3. ตรวจ declarative: collection operations แทน loops, immutable data, composition
4. ตรวจ functional: pure functions, separation of functional core / imperative shell, `Result`/`Option` patterns
5. ตรวจ imperative: control flow, guard clauses, mutable state scope, error handling
6. ตรวจ OOP: encapsulation, interfaces, polymorphism, single responsibility, composition over inheritance
7. ตรวจ reactive: lazy streams, proper subscription/unsubscription, error handling with `catchError`
8. ตรวจ dynamic programming: overlapping subproblems, base cases, state transitions, space optimization
9. ถ้า mixed paradigms → ตรวจ boundaries ให้ชัดเจน

### 4. Review Design Patterns

> Goal: ตรวจสอบว่า design patterns ถูกเลือกและใช้งานอย่างเหมาะสม

1. ทำตาม [references/design-patterns.md](references/design-patterns.md) และ [references/apply-design-patterns.md](references/apply-design-patterns.md)
2. ระบุ patterns ที่ใช้ใน codebase: Creational, Structural, Behavioral
3. ตรวจสอบ pattern fit กับปัญหาที่แก้ไข — ไม่ over-engineer, ไม่ under-engineer
4. ตรวจสอบ trade-offs และ maintainability ของแต่ละ pattern
5. ระบุ anti-patterns และ premature abstraction จาก [references/patterns-boundaries.md](references/patterns-boundaries.md)
6. บันทึก findings

### 6. Review Import, Export And Barrel Exports

> Goal: ตรวจสอบ import/export strategy และ barrel exports ของ module

1. ทำตาม [references/import-export.md](references/import-export.md)
2. บันทึก findings

### 7. Validate Findings

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/deep-validate` สำหรับ validate issues แต่ละอย่าง
3. ใช้เกณฑ์ severity จาก [references/severity-classification.md](references/severity-classification.md)
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 8. Report

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. สร้างตาราง Metrics Summary ตาม dimension พร้อม status indicators และ score
4. จัดกลุ่ม findings ตาม category และเรียงตาม severity
5. ทำ `/suggest-next-action`

### 9. Implement All

> Goal: ไม่มี implementation gap ค้างหลัง review

1. ทำ `/realize-implementation` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

1. ทุก finding ต้องมี file path, line number และ evidence — ดูรายละเอียดใน [references/review-rules.md](references/review-rules.md)
2. แยก review process จาก fix process และ scope boundaries ตาม [references/review-rules.md](references/review-rules.md)
3. ใช้ skip conditions เมื่อ project ไม่มีสภาพแวดล้อมที่เกี่ยวข้อง — ดูรายละเอียดใน [references/review-rules.md](references/review-rules.md)
4. คำนวณ score, grade, status, และ metrics ตาม [references/scoring.md](references/scoring.md)
5. รายงานด้วยตารางและไม่ใช้ bold markers — ดูรายละเอียดใน [references/review-rules.md](references/review-rules.md)

- ใช้ /improve-architecture ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- รายงาน recommended actions พร้อม priority
- Architecture review score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

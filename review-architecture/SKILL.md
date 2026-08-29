---
name: review-architecture
description: Review architecture, modularity, isolation, resilience, reliability, governance
---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, anti-patterns, modularity, isolation, resilience, reliability, และ governance พร้อม review score

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, modularity, isolation, resilience, reliability, governance, data flow tracing, และ cost impact analysis

## Execute

### 1. Prepare

> Goal: เข้าใจ architecture, patterns, module structure, dependency graph และ governance

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ architectural patterns, module/package boundaries, shared state, test strategy, environment separation, และ governance structure ที่ใช้
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก architecture dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/review-codebase-everythink` แล้วรัน review analyzers
3. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
4. ดูรายละเอียด dimension checks ใน [references/index.md](references/index.md)
5. ทำ data flow analysis ตาม `references/data-flow.md`
6. ทำ cost impact analysis ตาม `references/cost-impact.md`
7. คำนวณ architecture review score จาก [references/scoring.md](references/scoring.md)

### 3. Review Import, Export And Barrel Exports

> Goal: ตรวจสอบ import/export strategy และ barrel exports ของ module

1. ดูรายละเอียดใน [references/import-export.md](references/import-export.md)
2. ยืนยัน public API ซ่อน implementation details
3. ตรวจ circular dependencies และ unused imports
4. ประเมิน tree-shaking และ bundle size impact
5. บันทึก findings

### 4. Validate Findings

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 5. Report

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. สร้างตาราง Metrics Summary ตาม dimension พร้อม status indicators และ score
4. จัดกลุ่ม findings ตาม category และเรียงตาม severity
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 6. Implement All

> Goal: ไม่มี implementation gap ค้างหลัง review

1. ทำ `/realize-implementation` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: broken architecture, circular dependency ระหว่าง core modules, God object/module ที่ทำทุกอย่าง, Singleton abuse ที่ทำให้ test ไม่ได้, anti-pattern ใน critical path ที่ก่อน bugs, global mutable state ใน critical path, no environment separation ระหว่าง prod กับ non-prod, no timeout/retries บน critical external call, no fallback สำหรับ critical dependency, SPOF โดยไม่มี redundancy, no governance for critical decisions, missing security/compliance policy, no code review requirement, no CI in critical path
- High: violated SOLID principle, tight coupling, pattern ที่ใช้ผิด intent, Factory overuse, Observer ที่ไม่ cleanup, premature abstraction, SRP violation ใน module หลัก, missing dependency inversion, missing boundaries ระหว่าง layers, leaky abstraction, missing retry/timeout/fallback/circuit breaker, incomplete ownership, missing coding standards, single reviewer for critical code
- Medium: inconsistent pattern, missing abstraction, Decorator chain ยาวเกินไป, Facade ที่ซ่อน complexity มากเกินไป, pattern ที่ over-engineer, mixed concerns, unclear public API, minor side effect leak, suboptimal retry/backoff, policy gaps, outdated owner, informal decision process
- Low: minor pattern improvement, pattern ที่ simplify ได้, cosmetic, documentation gap, minor naming improvement

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`madge`, `knip`, `ast-grep`)
- ระบุ module, package, boundary, dependency, policy, owner ที่เกี่ยวข้อง
- ระบุ false positives ที่พบ

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ใช้ `/review-codebase-everythink` สำหรับระบุ issues ใน code
- แยก review process จาก fix process
- ห้ามลบไฟล์, โค้ด, dependencies, หรือ configuration ระหว่าง review

### 4. Scope Boundaries

- ไม่ review code-level structure (symbols, exports, members) ที่ `/check-code-structure` ทำ
- ไม่ review filesystem organization ที่ `/check-code-structure` ทำ
- ไม่ review refactor opportunities ลึกที่ `/review-codebase-everythink` ทำ
- ไม่ review deployment / CI/CD — ใช้ `/review-delivery`
- ไม่ review security controls — ใช้ `/review-delivery`
- ไม่ review code quality — ใช้ `/review-quality`
- focus ที่ system-level: patterns, boundaries, coupling, SOLID, scalability, modularity, isolation, resilience, reliability, governance

### 5. Skip Conditions

- ถ้า project ไม่มี module/package structure → ข้าม package boundaries checks
- ถ้า project ไม่มี tests → ข้าม test isolation checks
- ถ้า project ไม่มี container/process separation → ข้าม environment isolation checks
- ถ้า project ไม่มี async operations → ข้าม concurrency checks

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- รายงาน recommended actions พร้อม priority
- Architecture review score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

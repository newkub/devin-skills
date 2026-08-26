---
name: review-architecture
description: Review architecture, modularity, isolation, resilience, reliability, governance
---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, design pattern correctness, anti-patterns, modularity, isolation, resilience, reliability, และ governance พร้อม review score

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, creational patterns (Factory, Builder, Singleton, Prototype), structural patterns (Adapter, Decorator, Facade, Proxy, Composite), behavioral patterns (Strategy, Observer, Command, Iterator, State), functional patterns (composition over inheritance, pure functions, immutability), anti-patterns (God object, singleton abuse, factory overuse, callback hell, premature abstraction), pattern appropriateness, modularity (cohesion, coupling, single responsibility, barrel exports, feature-based folders, vertical slices, package by feature), isolation (state isolation, environment separation, test isolation, data isolation, leaky abstractions, namespace boundaries, interface boundaries, API boundaries), resilience (side effects, flow, rate limiting, retries, timeouts, circuit breakers, fallback, graceful degradation), reliability (failure points, redundancy, idempotency, observability, disaster recovery, predictability, concurrency), และ governance (ownership, policies, review process, maintenance)

## Execute

### 1. Prepare

สแกน codebase เพื่อเข้าใจ architecture ปัจจุบัน

> Goal: เข้าใจ architecture, patterns, module structure, dependency graph และ governance

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ architectural patterns, module/package boundaries, shared state, test strategy, environment separation, และ governance structure ที่ใช้
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

วิเคราะห์ architecture อย่างลึกซึ้งด้วย scripts

> Goal: ครอบคลุมทุก architecture dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-review-codebase-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. ดู `references/patterns-boundaries.md` สำหรับ architecture patterns และ boundaries checks
6. ดู `references/modularity.md` สำหรับ modularity checks
7. ดู `references/isolation.md` สำหรับ isolation checks
8. ดู `references/resilience.md` สำหรับ resilience checks
9. ดู `references/reliability.md` สำหรับ reliability checks
10. ดู `references/governance.md` สำหรับ governance checks
11. Review CLI คำนวณ architecture review score จาก review report (ดู `references/scoring.md`)
12. ถ้า review CLI ไม่ผ่าน → ทำ `/update-review-codebase-cli-and-run` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings ก่อน report

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low → Info
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 4. Report

รายงานผลการ review ในแชท

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. สร้างตาราง Metrics Summary ตาม dimension พร้อม status indicators และ score
4. จัดกลุ่ม findings ตาม category และเรียงตาม severity
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 5. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
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
- ใช้ `/update-review-codebase-cli-and-run` สำหรับระบุ issues ใน code
- แยก review process จาก fix process
- ห้ามลบไฟล์, โค้ด, dependencies, หรือ configuration ระหว่าง review

### 4. Scope Boundaries

- ไม่ review code-level structure (symbols, exports, members) ที่ `/check-code-structure` ทำ
- ไม่ review filesystem organization ที่ `/check-code-structure` ทำ
- ไม่ review refactor opportunities ลึกที่ `/update-review-codebase-cli-and-run` ทำ
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

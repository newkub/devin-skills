---
name: review-architecture
description: Review architecture, modularity, isolation, resilience, reliability, governance
argument-hint: "[scope]"
related:
  - scan-codebase
  - deep-analyze
  - deep-review
  - deep-validate
  - report
  - suggest-next-action

---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, anti-patterns, modularity, isolation, resilience, reliability และ governance พร้อม review score

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, modularity, isolation, resilience, reliability และ governance

ดูเพิ่มเติม: /deep-review

## Execute

### 1. Prepare

> Goal: เข้าใจ architecture, patterns, module structure และ dependency graph

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ architectural patterns, module/package boundaries, shared state, test strategy และ environment separation ที่ใช้
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Review Dimensions

> Goal: ครอบคลุมทุก architecture dimension

1. Modularity/isolation: module boundaries, cohesion, coupling, public API ชัดเจน, ไม่ bypass layers, state/side-effect/test isolation
2. Dependency direction: domain ไม่พึ่ง infrastructure, ไม่มี circular deps, fan-in/fan-out ยอมรับได้
3. Paradigm consistency: paradigm หลัก (declarative/functional/imperative/OOP/reactive) สม่ำเสมอภายใน module — mixed paradigms ต้องมี boundaries ชัดเจน
4. Design patterns: pattern fit กับปัญหา — ไม่ over/under-engineer, ระบุ anti-patterns และ premature abstraction
5. Import/export: barrel exports สม่ำเสมอ, ไม่มี deep imports ข้าม layer, public API ผ่าน `index` entry point
6. Resilience/reliability: retries, timeouts, circuit breakers, fallback, health checks บน critical path
7. Governance: ADR สำหรับ significant decisions, dependency rules enforced ผ่าน lint/CI, ownership ชัดเจน

### 3. Validate Findings

> Goal: findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings
2. จัด severity: Critical (broken boundaries/SPOF/no isolation), High (tight coupling, missing resilience), Medium (inconsistency), Low (cosmetic)
3. ระบุ false positives ที่พบ

### 4. Report

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. จัดกลุ่ม findings ตาม category และเรียงตาม severity
4. ทำ `/suggest-next-action`

## Rules

1. ทุก finding ต้องมี file path, line number และ evidence
2. แยก review process จาก fix process — review เป็น report-only จนกว่า user confirm
3. ใช้ skip conditions เมื่อ project ไม่มีสภาพแวดล้อมที่เกี่ยวข้อง
4. รายงานด้วยตารางและไม่ใช้ bold markers

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. structural fixes (boundary violations, coupling, misplaced files) → ทำ `/refactor`, `/restructure` และ `/update-references` — รักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี
3. เลือก/apply architecture pattern ตาม guides ใน `## Pattern Guides` เมื่อ finding ต้องเปลี่ยน pattern:

| Finding | Guide |
|---------|-------|
| ต้อง layered structure สำหรับ frontend ขนาดเล็ก-กลาง | `### Pattern: Layered Architecture` |
| ต้อง clean architecture — testability สูง, ports & adapters | `### Pattern: Clean Architecture` |
| ต้อง microservices — distributed, service boundaries | `### Pattern: Microservices Architecture` |

4. สรุปผลด้วย `/report-before-after`

## Pattern Guides

> Merged จาก `references/patterns-*.md` เดิม — guides สำหรับ `## Fix` เมื่อต้องเปลี่ยน architecture pattern

| Pattern | Reference |
|---------|-----------|
| Clean | [references/pattern-clean.md](references/pattern-clean.md) |
| Layered | [references/pattern-layered.md](references/pattern-layered.md) |
| Microservices | [references/pattern-microservices.md](references/pattern-microservices.md) |

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action` แยกเป็น follow-clean-architecture, follow-layered-architecture

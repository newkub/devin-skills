---
name: review-backend
description: Orchestrator backend review ครอบคลุม 14 sub-review workflows แบบ parallel
---

## Goal

Orchestrate backend review ครอบคลุม API, service, database, data flow, data fetching, data validation, integration ผ่าน 14 sub-review workflows แบบ parallel พร้อม validate findings และ review score

## Scope

ใช้สำหรับ backend review ทั้งหมด — เรียก sub-review workflows โดยตรง ไม่ทำ review เอง — ไม่รวม frontend, infrastructure, หรือ security reviews

ครอบคลุม 7 backend dimensions:
- `api` — API design, versioning, docs, errors, rate limiting (ดู `references/api.md`)
- `service` — service layer organization, boundaries, business logic, transactions, DI (ดู `references/service.md`)
- `database` — schema, query, index, integrity, connection, migrations (ดู `references/database.md`)
- `data-flow` — data lineage, API-to-database, API-to-client mapping, schema consistency, impact (ดู `references/data-flow.md`)
- `data-fetching` — loading, cache, optimistic, pagination, race conditions (ดู `references/data-fetching.md`)
- `data-validation` — Zod schemas, input/output validation, data contracts, transformation safety (ดู `references/data-validation.md`)
- `integration` — API client design, timeout, retry, circuit breaker, vendor lock-in, fallback (ดู `references/integration.md`)

## Execute

### 1. Prepare And Update Rules

เตรียม context และอัปเดต rules ก่อนรัน sub-reviews

> Goal: rules และ analyzers ครอบคลุมล่าสุด พร้อมรัน sub-reviews

1. ทำ `/scan-codebase` เพื่อเข้าใจ backend structure และ stack
2. ระบุ API framework, service patterns, database engine, data fetching library, validation library, integration points ที่ใช้
3. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในเพื่ออัปเดต ast-grep rules
4. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
5. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
6. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Run Backend Sub-Reviews

รัน 14 backend sub-review workflows แบบ parallel โดยอ้างอิง reference files ใน `references/`

> Goal: ครอบคลุมทุก backend dimension ผ่าน 14 sub-review workflows

1. ทำ `/review-codebase` สำหรับ API review (อ้างอิง `references/api.md`)
2. ทำ `/review-codebase` สำหรับ service layer review (อ้างอิง `references/service.md`)
3. ทำ `/review-codebase` สำหรับ database review (อ้างอิง `references/database.md`)
4. ทำ `/review-codebase` สำหรับ data flow review (อ้างอิง `references/data-flow.md`)
5. ทำ `/review-codebase` สำหรับ data fetching review (อ้างอิง `references/data-fetching.md`)
6. ทำ `/review-codebase` สำหรับ data validation review (อ้างอิง `references/data-validation.md`)
7. ทำ `/review-codebase` สำหรับ integration review (อ้างอิง `references/integration.md`)
8. ถ้า sub-review ไม่เกี่ยวข้องกับ project → ข้าม sub-review นั้น
9. ถ้าพบ critical issues → หยุดและทำ `/validate` ก่อนดำเนินต่อ

### 3. Validate And Report

ตรวจสอบ findings และรายงานผล

> Goal: findings ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก sub-review
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตามสูตรใน `references/scoring.md`
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Delegation

- Orchestrator เรียก sub-review workflows โดยตรง ไม่ทำ review เอง
- ไม่ duplicate เนื้อหา inline — checklist ของแต่ละ dimension อยู่ใน `references/` ไฟล์
- ถ้า project ไม่มี dimension ใด → ข้าม sub-review นั้น

### 2. Skip Conditions

- ถ้า project ไม่มี API layer → ข้าม `api` sub-review
- ถ้า project ไม่มี service layer → ข้าม `service` sub-review
- ถ้า project ไม่มี database → ข้าม `database` sub-review
- ถ้า project ไม่มี data pipeline → ข้าม `data-flow` sub-review
- ถ้า project ไม่มี data fetching → ข้าม `data-fetching` sub-review
- ถ้า project ไม่มี validation schemas → ข้าม `data-validation` sub-review
- ถ้า project ไม่มี third-party integrations → ข้าม `integration` sub-review

### 3. Severity Classification

- Critical: data loss risk, data corruption, broken endpoint, no error handling on critical path, unauthenticated endpoint, missing input validation, no timeout on external call, connection leak, missing transaction boundary, circular service dependency
- High: missing rate limiting, inconsistent response format, missing idempotency, missing pagination, N+1 query, missing index, missing DI, untestable service, missing cache invalidation, race condition, missing retry, no circuit breaker, missing schema on endpoint
- Medium: inconsistent naming, suboptimal schema, suboptimal cache strategy, minor schema drift, missing abstraction layer, missing localization
- Low: cosmetic, documentation gap, minor naming

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ endpoint, service, table, query, schema, integration, หรือ component ที่เกี่ยวข้อง
- ใช้ query plans, EXPLAIN ANALYZE, หรือ metrics แทน assumptions

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่สั่งให้ `drop table`, `drop index`, `delete data`, หรือรัน `destructive migration` ใน review phase
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 6. Update Before Run

- ทำ `/update-create-review-cli` ก่อนรัน sub-reviews เสมอ — `/update-create-review-cli` เรียก `/update-rules` ภายใน
- ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Findings และ recommendations จาก 14 backend sub-review workflows
- Issues ที่พบถูก validate ครบถ้วนตาม severity
- Review score ต่อ dimension และ overall ตาม `references/scoring.md`
- รายงานในแชทเป็นตารางตาม `/report-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

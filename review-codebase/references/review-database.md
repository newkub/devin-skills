---
name: review-database
description: Review database schema, migrations, data integrity, query patterns, N+1, connection, search indexing
---

## Goal

Review database ครอบคลุม schema design, migration safety, data integrity, query patterns, search พร้อม review score

## Scope

database review สำหรับ: schema design, index coverage, relation integrity, migration safety, rollback capability, data integrity, constraints, query patterns, N+1 queries, connection management, search indexing, relevance scoring

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ database structure และ ORM ที่ใช้

1. ทำ `/scan-codebase` เพื่อเข้าใจ database structure
2. ระบุ database driver, ORM, migration tool, seed strategy ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก database dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ database patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Schema Design And Index Review

> Goal: ครอบคลุม schema, index, relation integrity

1. ตรวจสอบ schema design: table structure, data types, column naming, relation integrity, normalization level
2. ตรวจสอบ index coverage: index on hot queries, composite indexes, partial indexes, unique indexes, index bloat, unused indexes
3. ตรวจสอบ relation integrity: foreign key constraints, cascade rules, orphaned record risk, relation cardinality

### 4. Migration Safety And Data Integrity Review

> Goal: ครอบคลุม migrations, data integrity, constraints

1. ตรวจสอบ migration safety: destructive operations, locking, data loss risk, rollback capability, down scripts completeness, reversibility, data preservation (default values, nullable columns, data backfill), migration ordering, dependency chain, migration conflicts
2. ตรวจสอบ data integrity: primary key constraints, foreign key constraints, cascade rules, unique constraints, composite unique, partial unique indexes, check constraints, orphaned record risk, transaction integrity, atomic operations, isolation level
3. Critical: data loss risk, missing migration rollback, destructive operation without safeguard, missing foreign key constraint, orphaned record risk, no transaction integrity
4. High: missing index on hot query, relation integrity issue, data quality gap, missing down script, non-reversible migration, unsafe locking, missing unique constraint, missing check constraint, unsafe cascade delete

### 5. Query Patterns And Search Review

> Goal: ครอบคลุม query optimization และ search

1. ตรวจสอบ query patterns: N+1 queries, unbounded queries, connection management, query optimization, batch operations, transaction scope
2. ตรวจสอบ search: search indexing, index coverage, index freshness, relevance scoring, filtering logic, sort options, autocomplete, search UX, search result rendering
3. Critical: broken search, missing index, incorrect search results, unbounded query ที่ crash ที่โหลดสูง
4. High: N+1 query ใน hot path, missing connection pool, poor relevance, missing filter, broken autocomplete

### 6. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี database → ข้ามทั้งหมด
- ถ้า project ไม่มี migrations → ข้าม Step 4 item 1
- ถ้า project ไม่มี search functionality → ข้าม Step 5 item 2

### 2. Severity Classification

- Critical: data loss risk, missing migration rollback, destructive operation without safeguard, missing foreign key constraint, orphaned record risk, no transaction integrity, broken search, unbounded query ที่ crash
- High: missing index on hot query, N+1 query ใน hot path, missing unique constraint, missing check constraint, unsafe cascade delete, missing connection pool
- Medium: suboptimal schema, minor schema drift, missing batch operations, poor relevance scoring
- Low: cosmetic, naming convention, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ table, column, migration file, หรือ query ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก database section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

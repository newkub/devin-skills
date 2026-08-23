---
name: review-database
description: Review database schema, query, index, integrity, connection, and migrations
---


## Goal

Review database ครอบคลุม schema design, query patterns, index coverage, data integrity, connection management, migration safety พร้อม review score

## Scope

database review สำหรับ relational หรือ NoSQL database ใน project: schema design, query patterns, index coverage, data integrity, connection management, migration safety

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจ database structure, stack, และ workload

1. ทำ `/scan-codebase` เพื่อรวบรวม schema, migrations, ORM models, query files
2. ระบุ database engine เช่น PostgreSQL, MySQL, SQLite, MongoDB, Redis
3. ระบุ database driver, ORM, migration tool, seed strategy ที่ใช้
4. รวบรวม workload profile: read/write ratio, query patterns, peak load
5. ถ้า project ไม่มี database → stop และ report

### 2. Schema Review

> Goal: ตรวจสอบ schema design และ structural quality

1. ตรวจสอบ table structure, data types, column naming, normalization level
2. ตรวจสอบ primary keys, foreign keys, unique constraints, check constraints
3. ตรวจสอบ relation integrity, relation cardinality, implicit relationships, orphan risks
4. ตรวจสอบ multivalued columns, EAV misuse, duplicate data, misnamed tables/columns
5. ตรวจสอบ data types สำหรับ precision, storage, compatibility
6. Critical: missing primary key, missing foreign key constraint, orphaned record risk
7. High: suboptimal schema, missing unique constraint, missing check constraint, unsafe cascade delete

### 3. Query and Index Review

> Goal: ตรวจสอบ query patterns และ index coverage

1. ตรวจสอบ slow queries, full table scans, missing indexes, unused indexes ด้วย EXPLAIN ANALYZE หรือ query plans
2. ตรวจสอบ N+1 queries, heavy joins, aggregation patterns, batch operations
3. ตรวจสอบ index coverage: hot queries, composite indexes, partial indexes, unique indexes, index bloat
4. ตรวจสอบ transaction boundaries, lock contention, hot spots
5. Critical: unbounded query ที่ crash หรือ load สูง, missing index บน hot query
6. High: N+1 query ใน hot path, poor query optimization, missing composite index opportunity

### 4. Integrity Review

> Goal: ตรวจสอบ data integrity และ constraints

1. ตรวจสอบ primary key constraints, foreign key constraints, cascade rules
2. ตรวจสอบ unique constraints, composite unique, partial unique indexes, check constraints
3. ตรวจสอบ orphaned record risk, transaction integrity, atomic operations, isolation level
4. ตรวจสอบ soft delete, audit trail, change data capture
5. ตรวจสอบ sensitive data exposure และ encryption needs
6. Critical: data loss risk, missing foreign key constraint, orphaned record risk, no transaction integrity
7. High: missing unique constraint, missing check constraint, unsafe cascade delete, data quality gap

### 5. Connection Review

> Goal: ตรวจสอบ connection management และ concurrency

1. ตรวจสอบ connection pool size, timeout, retry strategy
2. ตรวจสอบ connection leaks, long-running transactions, connection exhaustion
3. ตรวจสอบ read/write split, load balancing, failover configuration
4. ตรวจสอบ concurrency handling, peak load, lock contention
5. Critical: missing connection pool, connection leak ที่ทำให้ crash
6. High: connection timeout ต่ำ/สูงเกินไป, ไม่มี retry strategy

### 6. Migration Review

> Goal: ตรวจสอบ migration safety และ rollback capability

1. ตรวจสอบ destructive operations, locking, data loss risk, rollback capability
2. ตรวจสอบ down scripts completeness, reversibility, data preservation
3. ตรวจสอบ default values, nullable columns, data backfill, migration ordering, dependency chain
4. ตรวจสอบ migration conflicts, strategy: online, batched, blue/green, feature flag
5. Critical: missing migration rollback, destructive operation without safeguard, non-reversible migration
6. High: missing down script, unsafe locking, data preservation gap, migration conflict

### 7. Validate and Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี database → ข้ามทั้งหมด
- ถ้า project ไม่มี migrations → ข้าม Step 6
- ถ้า project ไม่มี connection pool → ข้าม connection pool items

### 2. Severity Classification

- Critical: data loss risk, missing migration rollback, destructive operation without safeguard, missing foreign key constraint, orphaned record risk, no transaction integrity, unbounded query ที่ crash, missing connection pool
- High: missing index on hot query, N+1 query ใน hot path, missing unique constraint, missing check constraint, unsafe cascade delete, missing down script, poor connection config
- Medium: suboptimal schema, minor schema drift, missing batch operations, missing composite index opportunity
- Low: cosmetic, naming convention, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ table, column, migration file, query, หรือ config ที่เกี่ยวข้อง
- ใช้ query plans, EXPLAIN ANALYZE, หรือ metrics แทน assumptions

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่สั่งให้ `drop table`, `drop index`, `delete data`, หรือรัน `destructive migration` ใน review phase
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### 5. No Deletions

- ห้ามรวม instruction ที่สั่งให้ลบ table, index, column, data, หรือ migration ใน review
- ห้ามใช้ `DROP`, `DELETE`, `TRUNCATE` เป็นคำสั่งใน review phase
- ทุก finding บันทึกเป็น evidence สำหรับ improvement ต่อไป

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก database section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

---
name: improve-database
description: ปรับปรุง database design, schema, index, query, integrity, migration และ optimization
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - improve-codebase
  - run-test-integration
  - validate
---

## Goal

Review and improve database design เพื่อให้ได้ performance, integrity, maintainability, scalability ทีดีขึ้น

## Scope

ใช้กับ relational หรือ NoSQL database เมื่อต้องการปรับปรุง schema, queries, indexing, normalization, constraints, integrity, หรือ migration plan

## Execute

### 1. Assess Current Design
> Goal: เข้าใจ database context และปัญหา
1. ระบุ database engine เช่น PostgreSQL, MySQL, MongoDB, Redis
2. รวบรวม schema, ER diagrams, migration files, ORM models
3. รวบรวม workload profile: read/write ratio, query patterns, peak load
4. ระบุปัญหา: slow queries, data anomalies, lock contention, storage growth
5. ถ้า schema ไม่มีหรือ outdated → stop และถามหา source files

### 2. Diagnose Schema Issues
> Goal: หา structural problems
1. ตรวจสอบ normalization (1NF–3NF) และ denormalization needs
2. ตรวจ missing, redundant, หรือ misnamed tables/columns
3. ตรวจ primary keys, foreign keys, unique constraints
4. ระบุ implicit relationships หรือ orphan risks
5. ตรวจ data types สำหรับ precision, storage, compatibility
6. ตรวจ multivalued columns, EAV misuse, duplicate data

### 3. Diagnose Query And Index Performance
> Goal: หา runtime inefficiencies และ query issues
1. รวบรวม slow query logs, `EXPLAIN ANALYZE`, query frequency
2. ระบุ missing indexes, unused indexes, composite index opportunities
3. ตรวจ full table scans, nested loop inefficiency, sorting costs
4. ตรวจ N+1 queries, heavy joins, aggregation patterns
5. ประเมิน transaction boundaries และ lock contention
6. ระบุ hot spots และ partition/sharding candidates
7. ใช้ `/follow-orm` หรือ `/follow-drizzle` สำหรับ ORM-specific tuning
8. ตรวจ connection pool, timeout, retry strategy และ lock contention

### 4. Diagnose Integrity And Constraints
> Goal: ปรับปรุง data integrity และ constraints
1. ตรวจ constraints, triggers, check rules
2. ตรวจ soft delete, audit trail, change data capture
3. ตรวจ foreign key consistency และ orphaned rows
4. ระบุ sensitive data exposure และ encryption needs
5. ประเมิน backup, restore, disaster recovery strategy
6. ใช้ /review-reliability ถ้าพบ recoverability issues

### 5. Prioritize Improvements
> Goal: จัดลำดับตาม impact และ effort
1. จัดประเภท issues ตาม severity: critical, high, medium, low
2. ประเมิน effort และ risk ของแต่ละ improvement
3. จัดลำดับตาม impact: performance, integrity, maintainability
4. กลุ่ม quick wins และ foundational changes
5. กำหนด success metrics: query time, storage, error rate, test coverage

### 6. Plan Migration
> Goal: ออกแบบ migration ทีปลอดภัยและย้อนกลับได้
1. เลือก migration strategy: online, batched, blue/green, feature flag
2. เขียน DDL/DML scripts พร้อม rollback steps
3. วางแผน data backfill, validation, consistency checks
4. กำหนด maintenance window ถ้าต้อง downtime
5. เตรียม monitoring และ alerting สำหรับ migration

### 7. Apply And Validate
> Goal: ปรับปรุงและยืนยันว่าไม่มี regression
1. นำ schema changes ไปใช้ใน non-production environment ก่อน
2. rebuild หรือสร้าง indexes, update statistics
3. rewrite queries, views, ORM mappings
4. รัน load tests, unit tests, integration tests
5. ตรวจสอบ query plans และ performance metrics
6. เปรียบเทียบ before/after และรายงาน

## Rules
### 1. Start With Evidence
- ไม่ redesign โดยไม่มี measured symptoms
- ใช้ query plans และ metrics แทน assumptions
- รักษา existing behavior เว้นแต่ได้รับการ approve

### 2. Prefer Minimal Changes
- หนึ่ง logical change ต่อ migration
- หลีกเลี่ยง big-bang rewrite โดย iterative improvements
- รักษา backward compatibility เมื่อปลอดภัย

### 3. Maintain Integrity
- ไม่ disable foreign keys หรือ constraints โดยไม่มีเหตุผล
- validate data หลัง migration ด้วย reproducible checks
- ใช้ transactions สำหรับ schema และ data changes

### 4. Document Decisions
- บันทึกเหตุผลของ normalization/denormalization
- อธิบาย indexes ที่เลือก
- เก็บ migration scripts ไว้ใน version control

### 5. Test Performance
- benchmark before/after บน realistic data volume
- ทดสอบ concurrency ไม่ใช่แค่ single-query speed
- monitor หา regressions หลัง deployment

## Expected Outcome
- รายงาน review ของ database design ปัจจุบัน
- รายการ improvements ทีจัดลำดับตาม severity และ effort
- migration plan พร้อม rollback และ validation
- query performance, schema integrity หรือ security ดีขึ้น
- ไม่มี data loss หรือ broken references
- before/after metrics ทีมี evidence

---
name: optimize-database
description: Optimize database — queries, indexes, N+1, schema ตาม review-database findings พร้อมวัดผลจริง
argument-hint: "[scope]"
related:
  - review-database
  - follow-orm
  - deep-analyze
  - use-subagents
  - run-check
  - run-test
  - report
  - suggest-next-action
---

## Goal

แก้ database performance issues ที่ `/review-database` พบ — slow queries, missing indexes, N+1, schema problems — พร้อมวัด query time before/after จริง

## Scope

ใช้หลัง `/review-database` มี findings หรือเมื่อ query/endpoints ช้า — apply fixes พร้อม measurement ไม่ใช่แค่ report

- ถ้าต้องการ schema changes → วาง plan ผ่าน migration workflow ของ project ก่อน
- ถ้าใช้ ORM → ทำตาม `/follow-orm`
- ถ้า scope ใหญ่หลาย tables/services → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings And Baseline

> Goal: รู้ปัญหาและมีตัวเลข baseline

1. ทำ `/review-database` หรืออ่าน findings เดิม
2. หา slow queries จริง: slow query log, `EXPLAIN ANALYZE`, ORM query log, APM
3. บันทึก baseline: query time, rows scanned, query count ต่อ request

### 2. Fix N+1 Queries

> Goal: request ละ 1 query ต่อ relation ไม่ใช่ต่อ row

1. detect N+1 จาก logs/findings — loop ที่ query ในแต่ละ iteration
2. แก้ด้วย eager loading (`include`/`join`/`preload` ตาม ORM) หรือ batch query
3. verify query count ต่อ request ลดลงจริง

### 3. Fix Indexes

> Goal: queries ใช้ index ไม่ seq scan

1. `EXPLAIN` slow queries — หา seq scan บน table ใหญ่
2. เพิ่ม indexes ตาม WHERE/JOIN/ORDER BY จริง — composite index ตาม column order ที่ใช้
3. ลบ unused/duplicate indexes ที่ทำให้ writes ช้า
4. ทุก index change ผ่าน migration file — ห้ามแก้ DB ตรงๆ

### 4. Optimize Queries

> Goal: query ทำงานน้อยลง

1. `SELECT *` → เลือกเฉพาะ columns ที่ใช้
2. pagination ด้วย cursor/keyset แทน `OFFSET` บน table ใหญ่
3. aggregations/counts ที่แพง → precompute หรือ materialized view ถ้าเหมาะ
4. transactions สั้น — ไม่ lock นาน

### 5. Fix Schema Issues

> Goal: schema สนับสนุน access patterns

1. missing foreign keys/constraints → เพิ่มผ่าน migration
2. wrong column types ที่ทำให้ index ใช้ไม่ได้ → วาง migration plan
3. ถ้า schema change เสี่ยง → `/deep-analyze` impact ก่อน

### 6. Verify

> Goal: ยืนยันด้วยตัวเลขจริง

1. re-run `EXPLAIN ANALYZE`/slow query log — เทียบ before/after
2. `/run-test` — data correctness ต้องไม่เปลี่ยน
3. `/run-check` lint/typecheck ผ่าน

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — queries fixed, time before/after, indexes added, migrations list
2. ทำ `/suggest-next-action`

## Rules

### 1. Measure With EXPLAIN

- ทุก query fix ต้องมี `EXPLAIN`/`EXPLAIN ANALYZE` before/after — ห้ามเดา
- baseline ต้องวัดบน data ใกล้เคียง production scale

### 2. Migrations Only

- schema/index changes ผ่าน migration files เท่านั้น — มี `down` migration
- destructive migrations ต้องมี backup/confirmation ก่อน

### 3. No Behavior Change

- optimization ห้ามเปลี่ยน result correctness — tests ต้องผ่านเหมือนเดิม
- eager loading ที่กระทบ memory มาก → พิจารณา pagination ก่อน

### 4. Index Discipline

- ไม่เพิ่ม index มั่ว — ทุก index ต้องมี query ที่ใช้จริง
- พิจารณา write amplification ก่อนเพิ่ม index บน write-heavy tables

## Expected Outcome

- slow queries เร็วขึ้นพร้อม EXPLAIN evidence
- N+1 หมด, indexes ตรง access patterns
- ทุก change ผ่าน migrations และ tests ผ่าน

---
name: improve-database
description: ปรับปรุง database: indexes, queries, migrations, connection pool, N+1 detection
argument-hint: "[table-or-query-pattern]"
related:
  - improve-codebase-everything
  - improve-api
  - improve-data-validation
  - optimize-codebase-everything
  - deep-review
  - run-test
  - resolve-errors
---

## Goal

ปรับปรุง database queries, indexes, migrations และ connection management

## Scope

ใช้กับ PostgreSQL, MySQL, SQLite, Drizzle, Prisma, typeorm โดย audit schema/queries และ optimize

## Execute

### 1. Audit Schema And Queries

> Goal: รู้ว่ามีปัญหาอะไร

1. ตรวจ schema files ใน `src/schema`, `src/db`
2. ตรวจ migrations ล่าสุด
3. ตรวจ indexes ในปัจจุบัน
4. ตรวจ slow query logs ถ้ามี
5. ตรวจ ORM queries ใน source code

### 2. Optimize Queries

> Goal: ลด query time

1. แก้ N+1 queries ด้วย joins หรือ `in` clauses
2. ใช้ `select` เฉพาะ fields ทีจำเป็น
3. ใช้ pagination สำหรับ list queries
4. ใช้ `EXPLAIN` ตรวจ query plans
5. ลด subqueries ทีไม่จำเป็น

### 3. Add Indexes

> Goal: เพิ่ม performance

1. ระบุ columns ทีใช้ WHERE, JOIN, ORDER BY บ่อย
2. เพิ่ม indexes สำหรับ foreign keys
3. เพิ่ม composite indexes ถ้า query ใช้หลาย columns
4. ตรวจ indexes ที redundant หรือ unused
5. สร้าง migration สำหรับ index changes

### 4. Optimize Connection And Pool

> Goal: จัดการ connections

1. ตรวจ connection pool size
2. ใช้ connection limits ทีเหมาะสม
3. ปิด connections หลังใช้งาน
4. ใช้ prepared statements ถ้า ORM รองรับ

### 5. Validate Migrations

> Goal: มั่นใจ migrations ปลอดภัย

1. รัน migrations บน test DB
2. ตรวจ backward compatibility
3. ตรวจ table locks
4. รัน tests หลัง migrations

## Rules

### 1. Indexes

- ทุก foreign key ควรมี index
- อย่า over-index
- ตรวจ query plans ก่อนเพิ่ม index

### 2. N+1

- ใช้ joins หรือ batch loading
- ตรวจ ORM eager loading
- ใช้ `dataloader` ถ้าจำเป็น

### 3. Migrations

- แยก schema และ data migrations
- ทำ migrations backward-compatible
- ทดสอบบน staging/test

### 4. Query Safety

- ใช้ parameterized queries
- ไม่ concatenate user input
- ใช้ ORM หรือ query builder

### 5. Monitoring

- บันทึก slow queries
- ใช้ query metrics
- Alert ถ้า query time เกิน threshold

## Expected Outcome

- Query time ลดลง
- N+1 ลดลง
- Indexes เหมาะสม
- Migrations ปลอดภัย
- Tests ผ่าน

---
name: optimize-queries
description: แก้ slow queries, N+1 problems และ missing indexes ใน database layer
argument-hint: "[endpoint-or-model]"
related:
  - check-migrations
  - run-profiler
  - report-before-after
---

## Goal

วิเคราะห์และแก้ไข database queries ที่ช้า — N+1 queries, missing indexes, unbounded result sets, inefficient joins และ serialization ใน loop

## Scope

- ตรวจ data access layer: ORM queries (Drizzle, Prisma), raw SQL, repository functions
- ครอบคลุม: N+1, missing indexes, SELECT *, missing pagination, N+1 serialization, transaction scope กว้างเกิน
- Action-oriented: แก้ queries/schema จริง — ต้องมี evidence (slow log, explain plan)

## Execute

### 1. Collect Evidence

> Goal: หา queries ที่ช้าจากข้อมูลจริง

1. เปิด query logging / slow query log หรือ APM (Signoz, Drizzle Studio)
2. รัน `/run-profiler` บน endpoint ที่ช้า หรือเพิ่ม timing log ชั่วคราว
3. หา hot paths จาก `/check-bottlenecks`

### 2. Detect Anti-Patterns

> Goal: scan code หา query anti-patterns

1. ใช้ `use-astgrep`/`search-files-patterns` หา:
   - queries ใน loop/map (N+1 candidates)
   - `findAll`/`select()` ไม่มี `where`/`limit`
   - sequential `await` ของ independent queries (ควร `Promise.all`)
   - transactions ที่คลุม network calls หรืองานช้า
2. flag queries ที่ดึงทั้งตารางมา filter ใน app code

### 3. Fix Queries

> Goal: แก้ตาม severity โดยเรียง impact

1. N+1: รวมเป็น batch query, `IN` clause, joins, หรือ ORM eager loading (`with`/`include`)
2. Missing index: เพิ่ม index ใน migration — ทำ `/check-migrations` ตรวจ pending migrations
3. Unbounded: เพิ่ม `limit`/pagination (cursor-based สำหรับตารางใหญ่)
4. Over-fetching: select เฉพาะ columns ที่ใช้
5. Sequential awaits: parallel ด้วย `Promise.all` เมื่อ independent
6. รัน `EXPLAIN`/`EXPLAIN ANALYZE` เทียบก่อน-หลังสำหรับ queries สำคัญ

### 4. Verify

> Goal: ยืนยันผลลัพธ์ correctness และ performance

1. `/run-test` หรือ `/run-test-integration` ต้องผ่าน — results เหมือนเดิม
2. เทียบ query count/time ก่อน-หลัง — ใช้ `/report-before-after`
3. อัปเดต migration files ถ้าเพิ่ม index — ทำ `/report-schema` ถ้า schema เปลี่ยน

## Rules

### 1. Evidence-Based

- แก้เฉพาะ queries ที่มี evidence ว่าช้าหรือเป็น hot path — ไม่ optimize ทุก query
- ทุก fix ต้องวัดผลหรือ EXPLAIN เทียบได้

### 2. Preserve Correctness

- Results ต้องเหมือนเดิม — ระวัง N+1 fixes ที่เปลี่ยน ordering หรือ filtering semantics
- Index เพิ่มผ่าน migration เท่านั้น — ห้ามแก้ DB ตรงๆ

### 3. ORM Aware

- ใช้ ORM features ของ project (Drizzle `with`, Prisma `include`) ก่อนเขียน raw SQL
- ตรวจ ORM จาก `package.json`/schema files ก่อนเลือก approach

## Expected Outcome

- N+1 และ slow queries ถูกแก้พร้อมตัวเลข before/after
- Indexes ที่ขาดถูกเพิ่มผ่าน migrations
- Query count/time ต่อ endpoint ลดลงพร้อมหลักฐาน

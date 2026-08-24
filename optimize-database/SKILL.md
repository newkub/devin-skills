---
name: optimize-database
description: ปรับปรุง database ของ project ด้าน schema, query, index, และ connection
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - optimize-codebase
  - improve-database-design
  - follow-orm
  - follow-drizzle
  - run-test-integration
  - validate
---

## Goal

ปรับปรุง database ของ project ให้เร็ว ปลอดภัย และ scale ได้

## Scope

ใช้กับ relational หรือ NoSQL database ใน project หรือ workspace ที่ต้องการปรับปรุง schema, query, index, connection, migration

## Execute

### 1. Detect Database Context
> Goal: เข้าใจ database stack และปัญหา
1. อ่าน `package.json`, `Cargo.toml`, หรือ manifest ที่ระบุ database driver/ORM
2. ระบุ database engine เช่น PostgreSQL, MySQL, SQLite, MongoDB, Redis
3. รวบรวม schema, migrations, ORM models, และ query files
4. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
5. ถ้า schema หรือ migrations ไม่มี → stop และ report

### 2. Analyze Database Health
> Goal: หาสาเหตุที่ทำให้ database ช้าหรือไม่ปลอดภัย
1. ทำ /review-database เพื่อ review schema, index, normalization, integrity
2. ตรวจ connection pool, timeout, retry strategy
3. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
4. ถ้าไม่พบ issues → stop และ report

### 3. Optimize Query
> Goal: ลด query time และ N+1
1. ใช้ EXPLAIN ANALYZE หา slow queries, full table scans, missing indexes
2. ตรวจจับ N+1 queries, heavy joins, aggregation ที่ผิดพลาด
3. ใช้ /follow-orm หรือ /follow-drizzle สำหรับ ORM-specific tuning
4. เพิ่ม/ลบ indexes ตาม workload: reads vs writes
5. ใช้ query builder หรือ raw SQL ทีเหมาะสม

### 4. Optimize
> Goal: แก้ไขปัญหา database ตาม priority
1. แก้ไข schema, index, query, connection config ตาม findings
2. ถ้าต้อง migration → สร้าง migration scripts พร้อม rollback
3. ถ้าแก้ >10 ไฟล์ → ทำ /use-scripts

### 5. Validate
> Goal: ยืนยันว่า database ปรับปรุงแล้วดีขึ้น
1. รัน test ด้วย /run-test-integration
2. ทำ /validate และ /run-check
3. ถ้าไม่ผ่าน → ทำ /resolve-errors แล้ว retry (max 3)
4. สรุปผลด้วย /report และ /suggest-next-action

## Rules

### 1. Minimal Changes
- หลีกเลี่ยง schema redesign ใหญ่ถ้าไม่จำเป็น
- เก็บ backward compatibility เมื่อปลอดภัย
- ไม่ disable constraints โดยไม่มีเหตุผล

### 2. Safety First
- ทำ dry run กับ migration ก่อน production
- มี rollback plan สำหรับ schema changes
- ถ้าไม่แน่ใจ → ทำ /ask-me

### 3. Evidence Based
- ใช้ query plans, EXPLAIN, หรือ metrics ก่อน/หลัง
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome

- database เร็วขึ้น ปลอดภัยขึ้น หรือ scale ดีขึ้น
- ไม่มี data loss หรือ broken references
- รายงานสรุป before/after และ next action

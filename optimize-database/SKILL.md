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
  - optimize-query
  - improve-database-design
  - improve-data-integrity
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
4. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
5. ถ้า schema หรือ migrations ไม่มี → stop และ report

### 2. Analyze Database Health
> Goal: หาสาเหตุที่ทำให้ database ช้าหรือไม่ปลอดภัย
1. ทำ `/optimize-query` เพื่อตรวจ slow queries หรือ N+1
2. ทำ `/improve-database-design` เพื่อ review schema, index, normalization
3. ทำ `/improve-data-integrity` ถ้าพบ integrity หรือ constraint issues
4. ตรวจ connection pool, timeout, retry strategy
5. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
6. ถ้าไม่พบ issues → stop และ report

### 3. Optimize
> Goal: แก้ไขปัญหา database ตาม priority
1. ทำ `/follow-orm` หรือ `/follow-drizzle` ตาม ORM ที่ใช้
2. แก้ไข schema, index, query, connection config ตาม findings
3. ถ้าต้อง migration → สร้าง migration scripts พร้อม rollback
4. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`

### 4. Validate
> Goal: ยืนยันว่า database ปรับปรุงแล้วดีขึ้น
1. รัน test ด้วย `/run-test-integration`
2. ทำ `/validate` และ `/run-check`
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
4. สรุปผลด้วย `/report` และ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- หลีกเลี่ยง schema redesign ใหญ่ถ้าไม่จำเป็น
- เก็บ backward compatibility เมื่อปลอดภัย
- ไม่ disable constraints โดยไม่มีเหตุผล

### 2. Safety First
- ทำ dry run กับ migration ก่อน production
- มี rollback plan สำหรับ schema changes
- ถ้าไม่แน่ใจ → ทำ `/ask-me`

### 3. Evidence Based
- ใช้ query plans, EXPLAIN, หรือ metrics ก่อน/หลัง
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome

- database เร็วขึ้น ปลอดภัยขึ้น หรือ scale ดีขึ้น
- ไม่มี data loss หรือ broken references
- รายงานสรุป before/after และ next action
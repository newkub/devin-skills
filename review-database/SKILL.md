---
name: review-database
description: ตรวจ schema, indexes, queries, N+1, migrations และ data integrity ของ database
argument-hint: "[schema-or-scope]"
related:
  - improve-database
  - review-performance
  - run-drizzle-studio
  - follow-lib-drizzle
  - deep-review
  - report-table
  - check-reference
---

## Goal

ตรวจสอบ database layer — schema design, indexes, queries, N+1 problems, migrations และ data integrity ก่อนแก้ไขด้วย `/improve-database`

## Scope

ใช้เมื่อต้อง review database ของ project: schema, relations, indexes, query patterns, migration safety — รองรับ ORM ทั่วไป (Drizzle, Prisma) และ raw SQL — ไม่แก้ไข schema หรือ data (ใช้ `/improve-database`)

## Execute

### 1. Discover Database Layer

> Goal: เข้าใจ database stack และ schema

1. ทำ `/scan-codebase` หา schema files, migrations, queries และ ORM config
2. ระบุ ORM/database จาก manifests (`drizzle`, `prisma`, raw SQL)
3. ถ้ามี Drizzle → ใช้ `/run-drizzle-studio` เพื่อ inspect data จริง

### 2. Review Schema Design

> Goal: schema ถูกออกแบบถูกต้อง

1. ตรวจ normalization, primary keys, foreign keys และ relations
2. ตรวจ column types, nullability, defaults และ constraints
3. ตรวจ naming conventions และ orphaned tables/columns

### 3. Review Indexes And Queries

> Goal: queries ใช้ indexes และไม่มี anti-patterns

1. ตรวจ indexes ครอบคลุม WHERE/JOIN/ORDER BY ที่ใช้บ่อย
2. ค้นหา N+1 queries และ missing eager loading
3. ตรวจ queries ที่ไม่มี LIMIT, `SELECT *` และ sequential scans บนตารางใหญ่

### 4. Review Migrations And Integrity

> Goal: migrations ปลอดภัยและ data integrity ครบ

1. ตรวจ migrations reversible และไม่มี destructive ops โดยไม่จำเป็น
2. ตรวจ constraints: unique, check, foreign key cascades, soft deletes
3. ตรวจ transaction usage สำหรับ multi-step writes

### 5. Rate And Report

> Goal: สรุป findings พร้อม severity และ fix direction

1. ทำ `/report-table` พร้อม columns: No., Area, Severity, Finding, Evidence, Fix
2. ชี้ไป `/improve-database` สำหรับการแก้ไข
3. ถ้า findings เกี่ยวกับ performance → เชื่อม `/review-performance`

## Rules

### 1. Read Only

- ห้ามแก้ schema, data หรือ run migrations ระหว่าง review
- ใช้ read-only queries เท่านั้นเมื่อ inspect data

### 2. Evidence Required

- ทุก finding ต้องมี schema file/line หรือ query evidence
- ไม่เดา index needs — อ้างจาก query patterns จริง

### 3. No Production Data Risk

- ห้ามรัน queries ที่ lock หรือหนักบน production data
- ใช้ dev/staging environment หรือ EXPLAIN เท่านั้น

- ใช้ /follow-lib-drizzle ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม schema, indexes, queries, migrations, integrity
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน `/improve-database`

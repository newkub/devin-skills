---
name: check-migrations
description: ตรวจ database migrations ที่ pending vs applied และ schema drift ระหว่าง code กับ DB
argument-hint: "[path]"
related:
  - follow-lib-drizzle
  - run-drizzle-studio
  - review-database
  - report-schema
  - follow-lib-postgres
  - use-pwsh-shell
  - report-table
---

## Goal

ตรวจสอบ database migrations ให้ตรงกันระหว่างไฟล์ใน repo กับสิ่งที่ apply แล้วใน database — หา pending migrations, applied-but-missing files และ schema drift

## Scope

- ใช้กับ projects ที่มี migration system: Drizzle (`drizzle/`), Prisma (`prisma/migrations/`), Rails, Alembic, raw SQL migrations
- ครอบคลุม: pending files, out-of-order migrations, missing journal entries และ drift ระหว่าง schema code กับ actual DB
- Read-only: ตรวจและรายงานเท่านั้น ไม่รัน `migrate` หรือแก้ schema

## Execute

### 1. Detect Migration System

> Goal: รู้ว่า project ใช้ migration tool อะไร

1. ตรวจ `drizzle.config.ts`, `prisma/schema.prisma`, `alembic.ini`, `db/migrate/`, `migrations/` directories
2. อ่าน package manifest หา migration commands (`db:migrate`, `migrate deploy`)
3. ระบุ migration directory และ journal/meta file (เช่น `drizzle/meta/_journal.json`)

### 2. List Migration Files

> Goal: รู้ว่า repo มี migrations อะไรบ้าง

1. List migration files ตามลำดับ (timestamp/version prefix)
2. ตรวจ journal/index file ว่า register ครบทุกไฟล์
3. Flag: file ที่ไม่มีใน journal, journal entry ที่ไม่มีไฟล์, sequence ที่ข้ามหรือซ้ำ

### 3. Check Applied Status

> Goal: เทียบกับสิ่งที่ DB apply แล้ว

1. ตรวจ migrations table ใน DB (เช่น `__drizzle_migrations`, `_prisma_migrations`, `alembic_version`)
2. ใช้ tool CLI ถ้ามี: `bunx drizzle-kit check`, `npx prisma migrate status`
3. แยก: `applied` (ทั้ง file และ DB), `pending` (มี file แต่ DB ยัง), `orphaned` (DB มีแต่ไฟล์หาย)
4. ถ้าเชื่อม DB ไม่ได้ → รายงานจาก file-level เท่านั้นและระบุข้อจำกัด

### 4. Detect Schema Drift

> Goal: หาความต่างระหว่าง schema code กับ DB จริง

1. ใช้ introspect: `bunx drizzle-kit introspect`, `npx prisma db pull` เทียบกับ schema file
2. Flag tables/columns ที่ DB มีแต่ schema code ไม่มี และกลับกัน
3. Flag destructive drift: dropped columns/tables ที่ยังมี data อ้างอิง
4. ถ้าทำ `/report-schema` คู่กัน → ใช้ผลร่วมกัน

### 5. Report

> Goal: สรุป migration health

1. ทำ `/report-table` คอลัมน์: `No.`, `Migration`, `File`, `Journal`, `Applied`, `Status`, `Action`
2. Status: `ok`, `pending`, `orphaned`, `unregistered`, `drift`
3. สรุปว่าพร้อม deploy หรือต้อง reconcile ก่อน
4. แนะนำ next action: `migrate`, `generate` หรือ `/review-database`

## Rules

### 1. Read-Only

- ไม่รัน `migrate`, `push` หรือ `db execute` — ตรวจเท่านั้น
- ไม่แก้ migration files หรือ journal — เสนอ fix ให้ user

### 2. Safety On Production

- ถ้า target DB เป็น production → ใช้ read-only queries เท่านั้น
- ไม่ introspect production DB โดยไม่ได้รับอนุญาตชัดเจน

### 3. Accuracy

- เทียบจาก migration table จริง ไม่เดาจาก filenames
- ระบุเมื่อข้อมูลไม่ครบ (เช่น เชื่อม DB ไม่ได้)

- ใช้ /review-database ถ้าจำเป็น
- ใช้ /report-schema ถ้าจำเป็น
- ใช้ /run-drizzle-studio ถ้าจำเป็น

## Expected Outcome

- รายการ migrations ที่ pending, orphaned หรือ unregistered ครบ
- Schema drift findings พร้อม evidence
- ชัดเจนว่า DB พร้อมรับ deployment หรือไม่

---
name: check-schema-change
description: ตรวจสอบการเปลี่ยนแปลง database schema ระหว่าง commits หรือ migration files
argument-hint: "[base-ref] [head-ref]"
related:
  - report-database-schema
  - review-database
  - diff-file-history
  - compare-directories
  - check-migrations
  - report-in-table
  - report
  - suggest-next-action
---

## Goal

ตรวจสอบการเปลี่ยนแปลง database schema ระหว่าง commits หรือ versions — ระบุ tables/columns/indexes ที่เพิ่ม ลบ หรือเปลี่ยน

## Scope

- ใช้กับ project ที่มี schema files หรือ migration files
- รองรับ Drizzle, Prisma, SQL migrations, TypeORM, Sequelize
- Read-only: รายงานการเปลี่ยนแปลง ไม่แก้ schema

## Execute

### 1. Detect Schema Files

> Goal: รู้ว่า schema files อยู่ไหน

1. ใช้ `/search-files-patterns` หา `schema.ts`, `schema.prisma`, `migrations/`, `drizzle/`, `*.sql`
2. ระบุ ORM ที่ใช้จาก `package.json` dependencies

### 2. Compare Versions

> Goal: หา diff ของ schema

1. ถ้ามี `base-ref` และ `head-ref` → ใช้ `/diff-file-history` เปรียบเทียบ schema files
2. ถ้าไม่มี ref → ใช้ `git diff --stat` หรือ `/compare-directories` ระหว่าง working tree กับ `HEAD`
3. แยก diff เป็น added/removed/modified tables, columns, indexes, constraints

### 3. Check Migrations

> Goal: ตรวจสอบความสอดคล้องกับ migrations

1. ทำ `/check-migrations` เพื่อตรวจ migration files
2. ระบุ schema drift (schema เปลี่ยนแต่ไม่มี migration)
3. ระบุ orphan migration (migration มีแต่ schema ไม่ตรง)

### 4. Report

> Goal: สรุปการเปลี่ยนแปลง

1. ทำ `/report-in-table` คอลัมน์: `No.`, `Table`, `Change`, `Type`, `Severity`, `Migration`
2. ระบุ breaking changes และ backward-compatible changes
3. ทำ `/suggest-next-action`

## Rules

### 1. Read-Only

- ไม่แก้ schema หรือ migration
- ไม่รัน migration หรือ introspect database

### 2. Evidence-Based

- ทุก finding ต้องระบุ commit, file, และบรรทัด
- เปรียบเทียบจากไฟล์ที่ commit ไว้เท่านั้น

### 3. Safety

- ระบุ breaking changes ก่อน non-breaking
- ถ้ามี drift ระหว่าง schema กับ migration → แจ้ง user ทันที

- ใช้ /report-database-schema ถ้าจำเป็น
- ใช้ /review-database ถ้าจำเป็น

## Expected Outcome

- รายการ schema changes ระหว่างสอง ref
- ตารางแสดง added/removed/modified tables, columns, indexes
- ระบุ drift ระหว่าง schema กับ migration
- คำแนะนำสำหรับ next action

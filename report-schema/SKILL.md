---
name: report-schema
description: สร้างรายงาน DB schema จาก migrations/schema files พร้อม tables, relations และ ER diagram
argument-hint: "[path]"
related:
  - review-database
  - run-drizzle-studio
  - create-mermaid-diagram
  - report-table
---

## Goal

สร้างรายงาน database schema ของ project จาก schema definitions หรือ migration files — แสดง tables, columns, indexes, relations และ ER diagram ที่อ่านง่าย

## Scope

- ใช้เมื่อต้องการภาพรวม DB schema ของ project สำหรับ docs, review หรือ onboarding
- รองรับ Drizzle schema (`schema.ts`), SQL migrations, Prisma schema และ SQL files ทั่วไป
- Read-only: รายงานจากไฟล์เท่านั้น ไม่ connect database จริง

## Execute

### 1. Locate Schema Sources

> Goal: หา source ของ schema

1. ใช้ `find_file_by_name` หา `schema.ts`, `schema.prisma`, `migrations/`, `drizzle/`, `*.sql`
2. ตรวจ `drizzle.config.ts`, `DATABASE_URL` references และ ORM ที่ใช้
3. ถ้ามีหลาย source → รวมทุกอันและระบุ precedence

### 2. Parse Schema

> Goal: ดึง tables และ columns ครบ

1. Drizzle/Prisma → parse model/table definitions: name, columns, types, constraints
2. SQL migrations → parse `CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX` statements
3. รวมเป็น canonical model: table, column, type, nullable, default, PK/FK, index
4. ระบุ relations จาก foreign keys และ ORM `references()`

### 3. Build ER Diagram

> Goal: วาด relations อ่านง่าย

1. ทำ `/create-mermaid-diagram` สร้าง `erDiagram` ใน mermaid
2. Node = table, edge = foreign key relation พร้อม cardinality
3. จัดกลุ่ม tables ตาม domain ถ้ามีหลายสิบ tables

### 4. Compile Report

> Goal: รายงานครบพร้อมใช้เป็น docs

1. ทำ `/report-table` สรุป tables: `No.`, `Table`, `Columns`, `Indexes`, `Relations`, `Note`
2. แสดง table detail ต่อกลุ่ม: columns พร้อม type, nullability, constraints
3. รวม ER diagram ใน section เดียว
4. ระบุ findings: missing indexes บน FK, tables ไม่มี PK, naming ไม่ consistent
5. ถ้า report ถาวร → บันทึกลง `docs/` หรือ `.devin/reports/<workspace>/` ตาม context

## Rules

### 1. Source-Of-Truth

- อิงจาก schema files ที่ commit ไว้เท่านั้น — ไม่ introspect DB จริง
- ถ้า schema files กับ migrations ไม่ตรง → flag เป็น drift

### 2. Read-Only

- ไม่แก้ไข schema หรือ migrations
- ไม่รัน migration หรือ connect database

### 3. Coverage

- รวมทุก table และ relation ไม่ตัดทอน
- ถ้า schema ใหญ่ → แบ่ง report ตาม domain พร้อม index

- ใช้ /review-database ถ้าจำเป็น
- ใช้ /create-mermaid-diagram ถ้าจำเป็น
- ใช้ /run-drizzle-studio ถ้าจำเป็น

## Expected Outcome

- Report แสดง tables, columns, indexes, relations ครบ
- ER diagram ใน mermaid พร้อมใช้ใน docs
- ระบุ schema findings (missing indexes, no PK, naming drift)

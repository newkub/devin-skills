---
name: review-database-check-schema
description: Check schema design — normalization, types, constraints, naming, integrity
argument-hint: "[schema-or-scope]"
related:
  - review-database
  - run-drizzle-studio
  - report
---

## Goal

Run the schema design dimension of `/review-database` แบบ focused — schema สะอาด มี constraints ครบ และ type ถูก

## Scope

- ใช้เมื่อ `/review-database` dispatch มาที่ `schema` หรือเรียก standalone บน schema files/migrations
- ครอบคลุม: table design, column types, constraints (PK/FK/unique/not-null), naming, normalization

## Execute

### 1. Schema Checks

> Goal: ครอบคลุมทุก schema dimension — parent Execute §2

ทำตาม `../../references/checklist.md` (schema section)

1. constraints — PK ทุก table, FK มี index, unique/not-null/check constraints ครบ
2. types — ขนาดพอดี (varchar length, int range, timestamp tz), money → numeric/decimal
3. normalization — duplicated data ที่ควร reference, EAV/JSON columns ที่ abuse relational model
4. naming — consistent conventions, ไม่มี reserved words

### 2. Integrity Checks

> Goal: data integrity enforced ที่ DB ไม่ใช่แค่ app

1. orphaned rows possible — FK ขาด `ON DELETE` behavior หรือขาด FK เลย
2. cascades — `CASCADE`/`SET NULL`/`RESTRICT` ตรง intent
3. soft-delete consistency — `deleted_at` partial indexes, queries filter ครบ

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Table/Column`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — schema changes ผ่าน migrations เท่านั้น (`../../SKILL.md` `## Fix`)
- ทุก finding มี evidence: schema file/migration + line
- missing FK บน critical relation / type ที่ overflow ได้ = High

## Expected Outcome

- Schema findings แยก constraints/types/normalization/naming
- Integrity gaps พร้อม affected relations

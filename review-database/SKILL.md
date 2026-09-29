---
name: review-database
description: ตรวจ schema, indexes, queries, N+1, migrations และ data integrity ของ database
argument-hint: "[schema-or-scope]"
related:
  - review-performance
  - run-drizzle-studio
  - follow-lib-drizzle
  - deep-review
  - report
  - check-reference
  - run-review
---

## Goal

ตรวจสอบ database layer — schema design, indexes, queries, N+1 problems, migrations และ data integrity โดยไม่แก้ไข — ส่งต่อ fix ไปยัง section `## Fix` เมื่อ user confirm

## Scope

ใช้เมื่อต้อง review database ของ project: schema, relations, indexes, query patterns, migration safety — รองรับ ORM ทั่วไป (Drizzle, Prisma) และ raw SQL — ไม่แก้ไข schema หรือ data ระหว่าง review (แก้ไขตาม section `## Fix`)

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

### 5. Operations And Pii

> Goal: coverage เพิ่มเติมของ domain — ทำตาม `references/operations.md`

1. replication lag, vacuum/maintenance health
2. PII columns inventory + retention per table
3. capacity headroom — growth rate vs limits

### 6. Concurrency And Pooling

> Goal: connection lifecycle และ lock behavior ปลอดภัย — ทำตาม `references/concurrency.md`

1. connection pooling — pool size vs workers, leak detection, idle reaping
2. locks — `SELECT FOR UPDATE` scope, lock ordering, deadlock handling
3. isolation levels — ตรงความต้องการจริง (serializable anomalies ถ้ามี)
4. long transactions — ไม่ครอบ network/slow work, idle-in-transaction monitoring

### 7. Query Safety And Injection

> Goal: SQL surface ปลอดภัย — ทำตาม `references/injection.md`

1. parameterized queries — ไม่มี string interpolation เข้า SQL
2. raw SQL audit — escape/quote helpers ถูก, whitelist สำหรับ identifiers (orderBy, table names)
3. ORM raw escapes — `sql`/`raw`/`whereRaw` ทุกจุดมี justification
4. least-privilege DB user — app user ไม่ใช่ superuser/DDL rights

### 8. Rate And Report

> Goal: สรุป findings พร้อม severity และ fix direction

1. ทำ `/report` พร้อม columns: No., Area, Severity, Finding, Evidence, Fix
2. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้

### Subskills

> Goal: dispatch งาน fix ไปยัง subskill เมื่อ user confirm ให้แก้ findings

| Topic | Subskill |
|-------|----------|
| Apply query findings — indexes, N+1, pagination | `subskills/optimize-queries/SKILL.md` |
| `schema` — schema design + integrity checks | `subskills/check-schema/SKILL.md` |
| `indexes`, `queries` — index coverage + query patterns | `subskills/check-indexes/SKILL.md` |
| `slow-queries`, `report` — slow-query table + index recs | `subskills/report-slow-queries/SKILL.md` |
| Apply migration findings — expand-contract, rollback (user confirm) | `subskills/improve-migrations/SKILL.md` |

## Check: Migrations
ทำตาม [references/check-migrations.md](references/check-migrations.md)

## Check: Schema Change
ทำตาม [references/check-schema-change.md](references/check-schema-change.md)

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `migrations` | `## Check: Migrations` |
| `schema-change` | `## Check: Schema Change` |

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

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. baseline: slow query log, `EXPLAIN ANALYZE`, query count/request
2. N+1 → eager loading/batch; verify query count ลดจริง
3. indexes ตาม WHERE/JOIN/ORDER จริง, ลบ unused — ผ่าน migration files เท่านั้น
4. queries: เลือก columns ที่ใช้, keyset pagination, transactions สั้น
5. migrations: backup DB ก่อน → drift แก้ด้วย reconcile migration (ห้ามแก้ migration ที่ apply แล้ว สร้างใหม่เสมอ), failed migrations mark resolved/rollback ตาม tool — เพิ่ม down/rollback ให้ครบ, destructive ops แยกเป็น expand-contract — verify migrate up/down บน fresh DB + `## Check: Migrations` diff เป็นศูนย์
5. verify: EXPLAIN before/after, tests ผ่าน

## References

- [Full-dimension checklist](references/checklist.md)
- [Operations and PII checklist](references/operations.md)
- [Concurrency and pooling checklist](references/concurrency.md)
- [Query safety and injection checklist](references/injection.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-performance ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม schema, indexes, queries, migrations, integrity
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`

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
  - use-subagents
---

## Goal

ตรวจสอบ database layer — schema design, indexes, queries, N+1 problems, migrations และ data integrity โดยไม่แก้ไข — ส่งต่อ fix ไปยัง section `## Fix` เมื่อ user confirm — domain checklist อยู่ใน `subagents/database-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้เมื่อต้อง review database ของ project: schema, relations, indexes, query patterns, migration safety — รองรับ ORM ทั่วไป (Drizzle, Prisma) และ raw SQL — ไม่แก้ไข schema หรือ data ระหว่าง review (แก้ไขตาม section `## Fix`)

| Dimension | Checklist |
|-----------|-----------|
| `schema`, `indexes-queries`, `migrations`, `integrity` — full overview | `subagents/database-reviewer/checklist.md` |
| `operations` — replication, PII inventory, capacity | `subagents/database-reviewer/operations.md` |
| `concurrency` — pooling, locks, isolation, long transactions | `subagents/database-reviewer/concurrency.md` |
| `injection` — parameterization, raw SQL audit, least-privilege | `subagents/database-reviewer/injection.md` |

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ database stack และ schema

1. ทำ `/scan-codebase` หา schema files, migrations, queries และ ORM config
2. ระบุ ORM/database จาก manifests (`drizzle`, `prisma`, raw SQL)
3. ถ้ามี Drizzle → ใช้ `/run-drizzle-studio` เพื่อ inspect data จริง
4. ทำ `/run-review` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Database-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension (`schema`, `indexes-queries`, `migrations`, `operations`, `concurrency`, `injection`)
2. Spawn `subagents/database-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย schema → spawn หลาย instance ทีละ scope ขนานกัน

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม table/query + issue type
2. classify severity — data loss, destructive migration, injection = Critical
3. findings ที่เป็น perf deep-dive → ระบุเป็น info + เชื่อม `/review-performance`

### 4. Rate And Report

> Goal: สรุป findings พร้อม severity และ fix direction

1. ทำ `/report` พร้อม columns: No., Area, Severity, Finding, Evidence, Fix + score ต่อ dimension และ overall
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

### Subagents

> Goal: domain reviewer ที่ถือ checklist ทั้งหมด — spawn ผ่าน `/use-subagents`

| Agent | Path |
|-------|------|
| `database-reviewer` — database dimensions พร้อม severity + evidence | `subagents/database-reviewer/AGENT.md` |

## Check: Migrations
ทำตาม [subagents/database-reviewer/check-migrations.md](subagents/database-reviewer/check-migrations.md)

## Check: Schema Change
ทำตาม [subagents/database-reviewer/check-schema-change.md](subagents/database-reviewer/check-schema-change.md)

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
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/database-reviewer/` เท่านั้น

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

## Expected Outcome

- รายงาน findings ครอบคลุม schema, indexes, queries, migrations, integrity
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`

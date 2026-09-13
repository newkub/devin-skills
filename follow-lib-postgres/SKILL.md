---
name: follow-lib-postgres
description: ใช้ postgres (postgres.js) driver — tagged templates, connection pool, listen/notify
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - run-drizzle-studio
  - follow-lib-drizzle
---

## Goal

ใช้ postgres (postgres.js) driver — tagged templates, connection pool, listen/notify

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib postgres)

- ครอบคลุม: `postgres` (postgres.js) driver — tagged templates, pool, transactions, LISTEN/NOTIFY, `sql.subscribe`
- ไม่ครอบคลุม: ORM/schema layer — ใช้ `/follow-lib-drizzle` (drizzle ใช้ postgres.js เป็น driver); `Bun.sql` built-in สำหรับ Bun-only project
- ไม่มี CLI — ใช้งานผ่าน programmatic API เท่านั้น (จึงไม่มี `references/cli.md`)
- Latest: `postgres@3.4.9` (verified 2026-09-13)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Setup | `subskills/setup-postgres/SKILL.md` — install, connection string, client |
| Optimize | `subskills/optimize-pool/SKILL.md` — pool sizing, prepared statements |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `postgres(url, {max, prepare})` — default pool 10 connections
1. ใช้ tagged template `` sql`SELECT * FROM t WHERE id = ${id}` `` — parameterized อัตโนมัติ
1. ใช้ `sql.begin()` สำหรับ transactions, `sql.listen(channel, onnotify)` สำหรับ LISTEN/NOTIFY และ `sql.notify(channel, payload)` สำหรับส่ง notify
1. ใช้ `sql.subscribe(pattern, onrow)` สำหรับ realtime row changes (เช่น `'insert:events'`, `'*:users'`) — สร้าง dedicated connection อัตโนมัติ
1. อยู่คู่กับ Drizzle — drizzle ใช้ postgres.js เป็น driver

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib postgres)

## Rules

- ห้าม string-concat queries — ใช้ tagged template เสมอ; `sql.unsafe()` เฉพาะ dynamic queries ที่ parameterized ไม่ได้
- ปิด connection ด้วย `sql.end()` ใน teardown
- บน serverless ใช้ Hyperdrive/PgBouncer pooling — อย่าเปิด connection ต่อ request

- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น
- ใช้ `/run-drizzle-studio` ถ้าจำเป็น
- ใช้ `/follow-lib-drizzle` ถ้าต้องการ ORM layer

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib postgres)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib postgres)
- Lint, typecheck, tests ผ่าน

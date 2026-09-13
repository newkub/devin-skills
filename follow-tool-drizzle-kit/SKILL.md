---
name: follow-tool-drizzle-kit
description: ใช้ drizzle-kit จัดการ migrations — generate, migrate, push, studio
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - run-drizzle-studio
---

## Goal

ใช้ drizzle-kit จัดการ migrations — generate, migrate, push, studio

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (tool drizzle kit)

- Latest: `drizzle-kit@0.31.10` (pair กับ `drizzle-orm@0.45.2`) (verified 2026-09-12)
- Note: v1.0.0 อยู่ใน beta/rc channel (`beta` dist-tag, ล่าสุด 1.0.0-rc.x) — มี breaking changes (casing API, ลบ RQB v1 `db._query`); production ยังใช้ stable 0.31.x
- References: [apis](references/apis.md) | [cli](references/cli.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| `drizzle.config.ts` — dialect, schema, `out`, dbCredentials | `subskills/config-drizzle-kit/SKILL.md` |
| generate/push/migrate commands, workflow, rollback | `subskills/migrate-schema/SKILL.md` |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. `drizzle-kit generate` สร้าง SQL migration จาก schema diff (`--name`, `--custom`, `--breakpoints`)
1. `drizzle-kit migrate` apply migrations; `push` สำหรับ dev prototyping (`--force`, `--strict`)
1. `drizzle-kit pull` introspect DB → drizzle schema; `check` ตรวจ migration collisions; `up` upgrade snapshots; `export` แปลง schema เป็น SQL DDL
1. ตั้ง `drizzle.config.ts`: schema path, dialect, dbCredentials (หลาย config ใช้ `--config=<path>`)
1. ใช้ `drizzle-kit studio` หรือ `/run-drizzle-studio` สำหรับ data browsing

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (tool drizzle kit)

## Rules

- production ใช้ `migrate` เสมอ — `push` เฉพาะ dev
- review generated SQL ก่อน commit — rename detection ไม่สมบูรณ์
- เก็บ migrations ใน version control เสมอ
- อย่าแก้ migration ที่ applied แล้ว — สร้าง migration ใหม่

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (tool drizzle kit)
- ไม่มี security/performance pitfalls ที่รู้จัก (tool drizzle kit)
- Lint, typecheck, tests ผ่าน

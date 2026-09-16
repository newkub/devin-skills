---
name: follow-lib-drizzle-migrate-schema
description: จัดการ Drizzle migrations — generate/migrate/push flow พร้อม rollback path
argument-hint: "[strategy-or-scope]"
related:
  - follow-lib-drizzle
  - check-migrations
  - plan
  - run-test
  - report-before-after
---

## Goal

จัดการ schema changes ของ Drizzle อย่างปลอดภัย — เลือก strategy (generate/migrate vs push vs pull), review SQL ก่อน apply และมี rollback path เสมอ

## Scope

- ใช้เมื่อเปลี่ยน `schema.ts` หรือต้อง sync schema กับ database
- ครอบคลุม: `drizzle-kit generate`, `migrate`, `push`, `pull`, `check` และ rollback notes
- ไม่ครอบคลุม first-time setup — ทำ `subskills/setup-drizzle/SKILL.md` ก่อน

## Execute

### 1. Plan Migration

> Goal: ระบุ from→to และเลือก strategy ก่อนลงมือ

1. ทำ `/plan` — อ่าน diff ของ schema, ระบุ tables/columns/indexes ที่เปลี่ยน และ tables ที่มี data จริง
2. เลือก strategy ตาม use case — ดู [../../references/cli.md](../../references/cli.md):
   - Development/prototyping: `bunx drizzle-kit push`
   - Production/team: `bunx drizzle-kit generate` + `bunx drizzle-kit migrate`
   - Existing database ไม่มี schema: `bunx drizzle-kit pull`
3. ถ้าเปลี่ยน destructive (drop column/table, rename, type change บน data จริง) → backup database ก่อนเสมอ
4. ทำ `/check-migrations` เพื่อตรวจ state ของ migration files ปัจจุบัน

### 2. Generate And Review

> Goal: generate migration SQL และ review ก่อน apply

1. รัน `bunx drizzle-kit generate --name=<descriptive-name>`
2. เปิดไฟล์ SQL ที่ generate ใน `out` directory — ตรวจทุก statement โดยเฉพาะ `DROP`, `ALTER` ที่อาจสูญ data
3. ถ้า SQL ไม่ตรง intent → แก้ schema แล้ว generate ใหม่ (ห้ามแก้ snapshot/meta โดยตรง)
4. แยก commit ต่อ migration — ห้ามผสมกับ feature work

### 3. Apply Migration

> Goal: apply migration ตามลำดับ local → staging → production

1. Local: รัน `bunx drizzle-kit migrate` แล้วทดสอบ queries ที่เกี่ยวข้อง
2. Staging/production: apply ผ่าน deploy pipeline หรือ `migrate()` ใน startup code — อย่ารัน manual บน prod โดยไม่มี runbook
3. ตรวจ drift ด้วย `bunx drizzle-kit check` หลัง apply
4. รัน tests ที่แตะ tables ที่เปลี่ยน (ทำ `/run-test`)

### 4. Prepare Rollback

> Goal: มี rollback path ที่ execute ได้จริง

1. drizzle-kit ไม่ generate down-migrations อัตโนมัติ — เขียน rollback SQL เองหรือเตรียม restore จาก backup
2. เก็บ rollback script คู่กับ migration (เช่น `migrations/rollback/<name>.sql`) หรือระบุ restore procedure ใน notes
3. Rename/type change → rollback ต้อง reverse ทุก step รวมถึง data backfill
4. ถ้า rollback ไม่ได้ (destructive + no backup) → stop และแจ้ง user ก่อน apply

## Rules

- Production ต้อง `generate` + `migrate` เสมอ — ห้าม `push` บน database ที่มี data สำคัญ
- Review generated SQL ทุกครั้งก่อน apply — tool อาจ drop/create แทน alter
- Destructive changes ต้องมี backup ก่อน — ไม่มี backup = ไม่ apply
- ตรวจ version ใน `package.json` — v1.0 RC มี `drizzle-kit up`, `push --explain`, migration folder v3
- ถ้าไม่แน่ใจ command/flag → ทำ `/learn-from-references` ดู official docs

## Expected Outcome

- Migration files ถูก generate, review และ apply ตามลำดับ env
- `drizzle-kit check` ไม่มี drift — schema ตรง database
- Rollback path ถูกระบุและทดสอบได้
- Report before/after ด้วย `/report-before-after`

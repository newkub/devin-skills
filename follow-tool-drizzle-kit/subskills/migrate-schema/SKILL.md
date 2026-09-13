---
name: follow-tool-drizzle-kit-migrate-schema
description: รัน drizzle-kit migration workflow — generate, push, migrate, review SQL, rollback
argument-hint: "[scope]"
related:
  - run-drizzle-studio
  - run-verify
  - run-test
---

## Goal

จัดการ schema migrations ด้วย drizzle-kit อย่างปลอดภัย — `generate` → review SQL → `migrate`/`push` — พร้อม rollback notes

## Scope

ใช้เมื่อ schema เปลี่ยนและต้องสร้าง/apply migrations — config setup อยู่ใน `subskills/config-drizzle-kit/SKILL.md`

## Execute

### 1. Prepare

> Goal: ตรวจ state ก่อน generate

1. ตรวจ `drizzle.config.ts` ถูกต้อง (`dialect`, `schema`, `out`) — ถ้าไม่มี → ทำ `subskills/config-drizzle-kit/SKILL.md` ก่อน
2. ตรวจ schema diff ที่ตั้งใจ — อ่าน schema files ที่เปลี่ยน
3. Backup DB ถ้าเป็น data-affecting migration บน shared/production DB
4. ตรวจ `out` dir — migrations เดิมต้อง intact, sequence ต่อเนื่อง

### 2. Generate Migration

> Goal: สร้าง SQL migration จาก schema diff

1. รัน `bunx drizzle-kit generate` — เพิ่ม `--name <name>` ให้ชื่อสื่อความหมาย
2. `--custom` สำหรับ empty migration ที่เขียน SQL เอง; `--breakpoints` ถ้าต้องการ statement splitting control
3. review generated SQL เสมอ — rename detection ไม่สมบูรณ์: drizzle-kit อาจเห็น rename เป็น drop+create = data loss
4. แก้ SQL ในไฟล์ที่ generate ถ้า rename/edge case ผิด — แก้ก่อน commit/apply

### 3. Apply

> Goal: apply migration ตาม environment

1. Dev/prototyping: `bunx drizzle-kit push` — push schema ตรงไป DB (`--force` ข้าม warnings, `--strict` ตรวจก่อน)
2. Production/staging: `bunx drizzle-kit migrate` — apply migrations จาก `out` dir เท่านั้น ห้าม `push`
3. `bunx drizzle-kit check` ตรวจ migration collisions ก่อน apply
4. `bunx drizzle-kit up` upgrade snapshots เมื่อ drizzle-kit version เปลี่ยน

### 4. Rollback Notes

> Goal: เตรียม rollback path ก่อน apply เสมอ

1. drizzle-kit ไม่มี built-in down migrations — เขียน rollback SQL เองหรือพึ่ง DB backup
2. สำหรับ destructive changes (drop column/table, rename) — เขียน inverse SQL ไว้ใน migration plan ก่อน apply
3. ห้ามแก้ migration ที่ applied แล้ว — สร้าง migration ใหม่เสมอ
4. ถ้า apply แล้วพัง → restore backup หรือ apply inverse migration

### 5. Verify

> Goal: ยืนยัน schema ตรงและ app ทำงาน

1. ตรวจ DB schema หลัง migrate — ผ่าน `/run-drizzle-studio` หรือ introspection (`drizzle-kit pull` เทียบได้)
2. รัน lint/typecheck/tests — ทำ `/run-verify` และ `/run-test` ถ้ามี tests ที่กระทบ
3. Commit migrations เข้า version control พร้อม schema changes — แยก commit จาก feature work ถ้าเป็นไปได้
4. ทำ `/report-before-after` สรุป schema changes

## Rules

### 1. Environment Discipline

- production ใช้ `migrate` เสมอ — `push` เฉพาะ dev/prototyping
- review generated SQL ก่อน commit — rename detection ไม่สมบูรณ์

### 2. Migration Integrity

- เก็บ migrations ใน version control เสมอ — sequence ห้ามขาด
- อย่าแก้ migration ที่ applied แล้ว — สร้างใหม่
- data migration → backup ก่อนเสมอ

### 3. Safety

- destructive changes ต้องมี rollback SQL/backup plan ก่อน apply
- ถ้าไม่แน่ใจ flags → ดู `drizzle-kit <cmd> --help` หรือ official docs

- ใช้ /run-drizzle-studio ถ้าจำเป็น

## Expected Outcome

- Migrations generated, reviewed และ applied ถูกต้อง
- DB schema ตรงกับ drizzle schema
- Rollback path พร้อมสำหรับ destructive changes
- Lint/typecheck/tests ผ่าน

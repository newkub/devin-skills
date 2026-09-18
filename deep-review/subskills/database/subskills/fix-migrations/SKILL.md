---
name: review-database-fix-migrations
description: Fix migration issues — drift, failed migrations, rollback safety, destructive ops
argument-hint: "[schema-or-migration]"
related:
  - review-database
  - review-migration
  - check-migrations
  - check-schema-change
  - follow-lib-drizzle
  - run-test
  - report-before-after
---

## Goal

แก้ migration findings จาก `/review-database` จริง — schema drift, failed/partial migrations, missing rollback, destructive ops — ให้ migrate ขึ้น-ลงได้สะอาด

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: drift ระหว่าง schema กับ migrations, failed migrations ค้าง, missing down/rollback, destructive changes
- query performance → `subskills/optimize-queries/SKILL.md`; multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Diagnose State

> Goal: รู้สถานะ migrations จริงก่อนแก้

1. ทำ `/check-migrations` + เทียบ schema files กับ migrations table — หา drift และ pending entries
2. ระบุ migration tool จาก config (`drizzle-kit`, `prisma migrate`, raw SQL) — commands ตาม official docs ของ tool นั้น
3. backup/snapshot dev DB ก่อนแก้อะไรก็ตาม

### 2. Fix Drift

> Goal: schema ตรงกับ migration history

1. ถ้า schema ถูกแก้นอก migrations → generate migration ให้ตรง diff จริง ห้ามแก้ migration files ที่ apply แล้ว
2. ถ้า DB drift จาก migrations → ตัดสิน source of truth (schema files) แล้วสร้าง reconcile migration
3. ตรวจด้วย `/check-schema-change` — diff ต้องเป็นศูนย์หลัง reconcile

### 3. Fix Failed Migrations

> Goal: clear สถานะค้างให้ migrate ต่อได้

1. ระบุ migration ที่ fail ค้างใน migrations table — mark resolved/rollback ตาม mechanism ของ tool
2. แก้ migration ที่ fail เฉพาะถ้ายังไม่เคย apply ใน env ไหน — ถ้า apply แล้วให้สร้าง migration ใหม่แก้ต่อ
3. re-run migrate บน fresh DB — ต้องขึ้นครบตั้งแต่ศูนย์ไม่มี error

### 4. Ensure Rollback And Safety

> Goal: migrations reversible และไม่ทำลาย data โดยไม่จำเป็น

1. เพิ่ม down/rollback ให้ migrations ที่ขาด — ทุก migration ต้อง revert ได้หรือระบุเหตุผลชัดเจน
2. destructive ops (drop column/table, type change ที่ lose data) → แยกเป็น expand-contract: เพิ่มใหม่ → migrate data → ลบเก่าทีหลัง
3. ตรวจ lock/timeout risk บนตารางใหญ่ — index concurrently, batched backfill ตามที่ DB รองรับ (ดู official docs)

### 5. Verify Full Cycle

> Goal: migrate up/down ทำงานครบ

1. migrate up บน fresh DB → schema ตรงกับ source of truth
2. rollback แล้ว up ซ้ำ → สะอาดทั้งสองทิศ
3. `/run-test` ผ่าน — app ใช้ schema ใหม่ได้จริง
4. `/report-before-after` — drift, fixed migrations, rollback coverage

## Rules

- ห้ามแก้ migration files ที่ apply ไปแล้ว — สร้าง migration ใหม่เสมอ
- backup ก่อน touch migrations table เสมอ
- ห้าม destructive change รวมกับ feature change ใน migration เดียว
- ทุก fix ทำบน dev/staging ก่อน — production plan แยกใน report
- fix-verify loop สูงสุด 3 รอบต่อ finding → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- schema, migrations และ DB state ตรงกัน — ไม่มี drift
- migrate up/down ผ่านบน fresh DB, failed migrations cleared
- report before/after พร้อม production rollout notes


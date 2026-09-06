---
name: improve-migration
description: แก้ findings จาก review-migration ทั้ง schema safety, rollbacks, data migration และ deploy order
argument-hint: "[finding-or-migration]"
related:
  - review-migration
  - check-migrations
  - follow-tool-drizzle-kit
  - improve-database
  - follow-orm
  - ship-rollback
  - report-review
  - verify-migration-data
---

## Goal

แก้ไข migration findings จาก `/review-migration` — unsafe schema changes, missing rollbacks, data migration risks, ordering issues และ zero-downtime gaps

## Scope

- รับ findings จาก `/review-migration` หรือ `/check-migrations`
- ครอบคลุม: destructive operations, missing down migrations, lock risks, data backfills, expand-migrate-contract patterns, migration ordering กับ code deploy
- Action-oriented: แก้ migrations/deploy plan จริง — high risk ต้องมี rollback path

## Execute

### 1. Triage Findings

> Goal: เรียง migration findings ตามความเสี่ยง

1. อ่าน findings จาก `/review-migration` หรือรัน `/check-migrations` ดู pending migrations
2. เรียงตาม risk: data loss → locks/downtime → ordering → missing rollback → style
3. แยก findings ที่แก้ใน migration file ออกจากที่ต้องเปลี่ยน deploy strategy

### 2. Fix Unsafe Operations

> Goal: แก้ migrations ที่เสี่ยง data loss หรือ downtime

1. **Destructive**: `DROP`, `RENAME`, type narrowing → เปลี่ยนเป็น expand-contract (add new → migrate → drop old ใน release ถัดไป)
2. **Lock risks**: `ALTER` บนตารางใหญ่ → `CONCURRENTLY` indexes, batched updates, หรือ shadow-table approach
3. **NOT NULL ใหม่**: เพิ่ม column แบบ nullable/default ก่อน → backfill → ค่อยบังคับ constraint
4. **Defaults หนัก**: เลี่ยง `ALTER ... SET DEFAULT` ที่ rewrite ทั้งตารางใน DB versions เก่า

### 3. Add Rollback Paths

> Goal: ทุก migration ต้องย้อนกลับได้

1. เพิ่ม `down` migrations ที่ขาด — ทดสอบ rollback จริงบน staging copy
2. สำหรับ irreversible ops → document data preservation (backup/export ก่อน)
3. ทำ `/ship-rollback` เพื่อวาง deploy rollback plan ที่สอดคล้อง

### 4. Fix Ordering And Data Migrations

> Goal: ให้ migration สอดคล้องกับ code deploy

1. ตรวจ ordering: schema ต้อง compatible กับ code ทั้งก่อนและหลัง deploy (backward-compatible)
2. แยก data backfills ออกจาก schema migrations — รันเป็น job แยกถ้าใหญ่
3. กำหนด batching + progress logging สำหรับ backfills บนตารางใหญ่

### 5. Verify And Report

> Goal: ทดสอบ migration จริง

1. apply + rollback + re-apply บน database copy — ต้องสำเร็จทั้งสาม
2. `/run-test` + integration tests ผ่าน
3. ใช้ `/report-review` สรุป fixed findings และ residual risks

## Rules

### 1. Safety First

- ห้าม destructive migration โดยไม่มี expand-contract plan หรือ user approval
- ทดสอบ rollback จริงก่อนถือว่าเสร็จ — ไม่ใช่แค่เขียน down migration

### 2. Zero-Downtime

- schema ต้อง compatible กับ code เก่าและใหม่ช่วง deploy window
- ระบุ downtime ที่หลีกเลี่ยงไม่ได้ชัดเจนให้ user ตัดสินใจ

### 3. Tooling Aware

- ใช้ migration tool ของ project (Drizzle Kit, Prisma Migrate, sqlx, goose) — ห้ามแก้ DB ตรงๆ
- ทำ `/check-migrations` หลังแก้เพื่อยืนยัน pending/applied ตรง

## Expected Outcome

- Migrations ปลอดภัย: rollback ได้, ไม่ lock นาน, compatible ข้าม deploy
- Data migrations มี batching และ progress tracking
- รายงาน fixes พร้อม rollback verification

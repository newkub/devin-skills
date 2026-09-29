---
name: review-database-improve-migrations
description: Apply migration findings — expand-contract, backfill, rollback, ordering — test จริง
argument-hint: "[migrations-or-scope]"
related:
  - review-database
  - review-database
  - run-test
  - report-before-after
  - ask-me
---

## Goal

แก้ migration findings จาก `/review-database` จริง — unsafe ops ให้ปลอดภัย, rollback ครบ, ordering ถูก — test บน data copy จริง

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: unsafe ops (NOT NULL, DROP, RENAME), missing rollback, ordering/idempotency, data-in-schema issues
- ห้ามแก้ applied migrations — fix-forward เท่านั้น (new migration)

## Execute

### 1. Baseline

> Goal: รู้ migration state จริง

1. ทำ `/review-database` — pending/applied/failed states
2. list findings: unsafe ops, missing down, ordering issues
3. เตรียม existing-data copy สำหรับ test (dev/staging เท่านั้น)

### 2. Fix Unsafe Ops

> Goal: migrations deploy ได้โดยไม่ lock/corrupt

1. NOT NULL → เพิ่ม column nullable + backfill + แล้วค่อย constraint (expand-contract)
2. DROP/RENAME → expand-contract: add new → migrate → drop old ใน migration ถัดไป
3. big tables → batch updates หรือ online tools (pt-osc, gh-ost) ตาม DB
4. data changes แยกจาก schema changes ต่าง migration กัน

### 3. Fix Rollback And Ordering

> Goal: ทุก migration rollback ได้จริง

1. ทุก migration มี down ที่ทำงานได้ — test up→down→up บน data copy
2. dependencies เรียงถูก, `IF NOT EXISTS`/`IF EXISTS` สำหรับ idempotent
3. lock duration estimate บนตารางใหญ่ — flag ที่เกิน threshold

### 4. Verify

> Goal: migrations run clean บน real-ish data

1. up→down→up บน existing-data copy ผ่าน
2. `/run-test` ผ่าน + `/report-before-after` — findings หายครบ

## Rules

- ห้ามแก้ migration ที่ applied แล้ว — fix-forward เท่านั้น
- preserve data — backfill ต้อง verify row counts ก่อน/หลัง
- destructive ops ต้อง user confirm + backup note
- fix-verify loop สูงสุด 3 รอบ → ไม่ผ่าน stop และ report

## Expected Outcome

- Migrations deploy-safe: no lock-heavy ops, rollback ครบ
- up→down→up tested on data copy พร้อม evidence

---
name: verify-migration-data
description: เทียบข้อมูลก่อน-หลัง migration ด้วย row counts, checksums และ spot checks
argument-hint: "[table-or-migration]"
related:
  - check-migrations
  - improve-migration
  - review-migration
  - follow-orm
  - report-before-after
  - report-table
---

## Goal

ยืนยันว่า data migration ไม่ทำข้อมูลหายหรือเพี้ยน — เทียบ row counts, checksums, spot checks ก่อนและหลัง migration

## Scope

- ใช้หลัง apply migration หรือ data backfill บน staging/copy ก่อน production
- ครอบคลุม: row counts, aggregate checksums, key columns integrity, constraint violations, orphaned rows
- Read-only ต่อข้อมูลจริง: ตรวจสอบอย่างเดียว — แก้ไขผ่าน `/improve-migration`

## Execute

### 1. Capture Pre-Migration Baseline

> Goal: เก็บ snapshot ตัวเลขก่อน migrate (หรือใช้ที่บันทึกไว้)

1. ถ้ายังไม่ migrate: เก็บ row counts ทุกตารางที่เกี่ยว + aggregates (`COUNT`, `SUM`, `MIN/MAX` ของ key columns)
2. ถ้า migrate ไปแล้ว: ใช้ backup/pre-dump หรือตารางต้นทางถ้ายังอยู่ (expand-contract)
3. เก็บ checksums ของ critical tables (เช่น `MD5` ของ ordered dump ตัวอย่าง)

### 2. Apply Or Confirm Migration

> Goal: ให้ migration applied บน target ที่ตรวจ

1. ยืนยัน migration ที่ตรวจคือ version ล่าสุด — `/check-migrations`
2. ถ้าเป็น dry-run verification → ทำบน staging/backup copy เสมอ ไม่ใช่ production โดยตรง

### 3. Compare Post-Migration

> Goal: เทียบตัวเลขหลัง migrate กับ baseline

1. Row counts: ตารางที่ไม่เกี่ยวต้องเท่าเดิม — ตารางที่ migrate ต้องตรงตาม expected delta
2. Aggregates: `SUM`/`COUNT` ของคอลัมน์ที่ migrate ต้อง preserve หรือต่างตาม design
3. Orphans: FK references ที่ชี้ไป record ที่หาย
4. Constraints: violations ที่ migration อาจ introduce (dup keys, null ใน NOT NULL ใหม่)

### 4. Spot Check Content

> Goal: ตรวจตัวอย่างข้อมูลจริง

1. sample N records จากตารางที่เปลี่ยน — เทียบกับ source ของมัน
2. ตรวจ transformations: format, encoding, timezone, truncation
3. ตรวจขอบเขต: records เก่าสุด/ใหม่สุด, edge values (null, empty, max)

### 5. Report

> Goal: สรุป data integrity verdict

1. ใช้ `/report-before-after` แสดง counts/aggregates เทียบกัน
2. Verdict ต่อตาราง: `intact`, `expected-delta`, `mismatch`, `corrupted`
3. ถ้า mismatch → ระบุ rows/columns ที่ต่าง และแนะนำ rollback หรือ fix-forward

## Rules

### 1. Never Verify On Production Blindly

- ทำบน staging/copy เมื่อเป็นไปได้ — production verify ต้อง read-only เท่านั้น
- ห้ามรัน queries หนักบน production โดยไม่คำนึง load

### 2. Evidence-Based

- ทุก claim ต้องมีตัวเลขจริง (counts, checksums, samples)
- ถ้าเทียบไม่ได้ (ไม่มี baseline) → ระบุชัดเจนและใช้ heuristic checks แทน

### 3. Read-Only

- ไม่แก้ข้อมูลระหว่าง verify — mismatch ให้รายงานแล้วทำ `/improve-migration`
- queries ต้อง read-only เสมอ

## Expected Outcome

- Verdict ต่อตารางว่าข้อมูล intact หรือไม่ พร้อมตัวเลข
- รายการ mismatches/orphans/constraint violations ถ้ามี
- Evidence สำหรับ go/no-go หรือ rollback decision

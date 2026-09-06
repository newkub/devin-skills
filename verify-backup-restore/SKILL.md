---
name: verify-backup-restore
description: ทดสอบว่า backup ล่าสุด restore ได้จริง — ไม่ใช่แค่มีไฟล์ backup อยู่
argument-hint: "[backup-source]"
related:
  - review-stability
  - improve-stability
  - ship-rollback
  - report-before-after
  - report-table
---

## Goal

ทดสอบ restore path ของ backup จริง — backup ที่ restore ไม่ได้ไม่มีค่า — ยืนยัน integrity, completeness และเวลาที่ใช้ restore (RTO)

## Scope

- ครอบคลุม: database dumps, file backups, config snapshots, volume snapshots ตามที่ project มี
- ทดสอบบน isolated environment (local, container, staging) — ห้าม restore ทับ production
- Verify-only: ทดสอบ restore แล้วทิ้ง — ไม่เปลี่ยน backup source

## Execute

### 1. Inventory Backups

> Goal: หา backup artifacts และ schedules ที่มี

1. หา backup locations: dumps (`*.sql`, `*.dump`), archives, snapshots, backup scripts
2. ระบุ: อะไรถูก backup, ความถี่, retention และ storage location
3. flag ถ้าไม่มี backup เลย → escalate เป็น gap ของ stability ทันที

### 2. Pick Latest And Verify Integrity

> Goal: ตรวจ backup ล่าสุดว่าไม่เสีย

1. เลือก backup ล่าสุด — เช็ค timestamp ว่าสดตาม schedule
2. ตรวจ integrity: file ไม่ว่าง/ไม่ตัด, checksum ถ้ามี, format valid (เช่น `pg_restore -l`, `unzip -t`, `tar -tzf`)
3. flag backup ที่ corrupted หรือ suspiciously small

### 3. Test Restore

> Goal: restore จริงบน isolated target

1. สร้าง target ชั่วคราว: local DB instance, container, หรือ temp directory
2. รัน restore ตาม runbook/script ที่มี — จับเวลา (RTO evidence)
3. ถ้าไม่มี documented restore procedure → นั่นเองคือ finding สำคัญ

### 4. Validate Restored Data

> Goal: ยืนยันข้อมูลครบและใช้ได้

1. เทียบ row counts / record counts กับ source ถ้าทราบ
2. spot-check: เปิดข้อมูลตัวอย่าง, รัน simple queries, verify schema intact
3. flag: missing tables, truncated data, encoding issues, permission problems

### 5. Report

> Goal: สรุป restore viability พร้อมตัวเลข

1. ใช้ `/report-table` คอลัมน์: `No.`, `Backup`, `Integrity`, `Restore OK`, `Data Valid`, `RTO`, `Verdict`
2. ระบุ gaps: no backup, corrupt, undocumentated restore, RTO เกินเป้า
3. แนะนำ automate restore test เป็น scheduled job ถ้ายังไม่มี

## Rules

### 1. Never Restore Over Production

- restore test ต้องอยู่บน isolated target เท่านั้น
- ห้ามแก้ backup source หรือ production data

### 2. Evidence-Based

- Verdict ต้องมาจากการ restore จริง — ไม่ใช่การเช็คว่าไฟล์มีอยู่
- รายงาน RTO จากการจับเวลาจริง

### 3. Non-Destructive

- cleanup test target หลังจบ — ไม่ทิ้ง restored data ค้าง
- ไม่แก้ backup scripts — ถ้าพังให้รายงานและทำ `/improve-stability`

## Expected Outcome

- Verdict ชัดเจนว่า backup แต่ละตัว restore ได้จริงหรือไม่
- RTO measurement และ data validity evidence
- รายการ gaps: missing backups, undocumented restore, corrupt artifacts

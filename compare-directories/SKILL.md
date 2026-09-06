---
name: compare-directories
description: เทียบสอง directory trees ระดับ content — ไฟล์ที่ต่าง, หาย, เพิ่ม พร้อมรายละเอียด
argument-hint: "<dir-a> <dir-b>"
related:
  - view-diff
  - list-file-structure
  - check-file-relations
  - report-table
---

## Goal

เปรียบเทียบสอง directory trees อย่างละเอียด — files เดียวกัน/ต่างกัน/หาย/เพิ่ม — ระดับ content (hash) ไม่ใช่แค่ชื่อ เพื่อ migration, backup verification, หรือ sync auditing

## Scope

- เทียบสอง paths: project copies, backup vs original, before/after migration, cross-machine sync
- ครอบคลุม: file presence, content diff (hash), size/mtime differences, structure differences
- Read-only: รายงาน diff — ไม่ sync หรือแก้ไฟล์

## Execute

### 1. Map Both Trees

> Goal: สร้าง inventory ของทั้งสอง dirs

1. Enumerate files ทั้งสองฝั่ง — relative paths เทียบกัน
2. เช็คขนาดเบื้องต้น — count + total size ต่อฝั่ง
3. ข้าม patterns ที่ไม่ควรเทียบ (`.git`, `node_modules`, `*.log`) เว้นแต่ระบุ

### 2. Compare Presence

> Goal: หา files ที่อยู่ฝั่งเดียว

1. **Only in A**: files ที่ B ขาด
2. **Only in B**: files ที่ A ขาด
3. **Both**: candidates สำหรับ content comparison

### 3. Compare Content

> Goal: หา files ที่ต่างกันแม้ชื่อเดียวกัน

1. Hash ทั้งสองฝั่ง (`Get-FileHash` SHA256) สำหรับ "both" files — เทียบ content จริง
2. ถ้า file จำนวนมาก → quick pass ด้วย size+mtime ก่อน แล้ว hash เฉพาะที่ suspect
3. จัดกลุ่มผล: `identical`, `content-differs`, `size-differs`, `metadata-only`

### 4. Analyze Differences

> Goal: เข้าใจลักษณะ diff สำหรับ actionable report

1. สำหรับ `content-differs`: sample diff บรรทัดแรกที่ต่าง — `/view-diff` สำหรับรายละเอียด
2. Pattern detection: mass differences (generated files, line endings) vs isolated changes
3. flag: files ที่ต่างแต่ไม่ควร (binary drift, unexpected modifications)

### 5. Report

> Goal: สรุป diff แบบ actionable

1. ใช้ `/report-table`: `No.`, `Path`, `Status`, `A Detail`, `B Detail`, `Notes`
2. Summary: counts ต่อ category + verdict (`identical`, `minor drift`, `significantly different`)
3. แนะนำ: sync direction ถ้าเห็นชัดว่าฝั่งไหน newer/correct

## Rules

### 1. Content Over Names

- เทียบด้วย hash ไม่ใช่แค่ชื่อ/size — name match ≠ content match
- ระบุ comparison method (hash/size/mtime) ในรายงาน

### 2. Read-Only

- ไม่ copy/merge/แก้ไฟล์ — รายงาน diff เท่านั้น
- ข้าม paths ที่ไม่เกี่ยวโดย default

### 3. Scalable

- dirs ใหญ่มาก → sampling หรือ two-pass (metadata → hash เฉพาะ suspects)
- ระบุ coverage ในรายงานถ้าไม่ได้ hash ทุกไฟล์

## Expected Outcome

- รายการ diff ครบ: only-A, only-B, content-differs, identical count
- Verdict ชัดเจนว่าสอง trees ต่างกันแค่ไหนและตรงไหน
- Drill-down พร้อมสำหรับ files ที่น่าสงสัย

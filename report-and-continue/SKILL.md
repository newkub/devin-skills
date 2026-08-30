---
name: report-and-continue
description: รายงานผลและแนะนำ next action เพื่อทำงานต่อ
related:
  - report-table
  - suggest-next-action
  - report-before
  - report-before-after
  - analyze-project
  - scan-codebase
  - deep-report
---

## Goal

รายงานสถานะปัจจุบันและแนะนำ next action ชัดเจน เพื่อให้ผู้ใช้ตัดสินใจทำงานต่อไป

## Scope

ใช้เมื่อต้องการ report สถานะ ปัญหา หรือผลการทำงาน แล้วแนะนำ action ถัดไปโดยไม่บังคับให้ fix ทันที

## Execute

### 1. Report Current State

> Goal: สร้าง report สถานะปัจจุบัน

1. ทำ `/report-before` เพื่อสร้าง report เริ่มต้น
2. ทำ `/analyze-project` และ `/scan-codebase` ถ้าจำเป็น
3. ระบุ issues พร้อม severity

### 2. Analyze Findings

> Goal: วิเคราะห์ผลทีพบ

1. ทำ `/deep-report` หรือ `/report-plan`
2. จัดลำดับ findings ตาม impact ก่อน effort
3. ระบุ files ทีเกี่ยวข้องและผลกระทบ

### 3. Recommend Next Action

> Goal: แนะนำ action ถัดไป

1. ทำ `/report-table` สรุป findings, severity, suggested next action
2. ใช้ `/suggest-next-action` เพื่อแนะนำขั้นตอนทีเหมาะสม
3. ถ้า action เสี่ยง → ใช้ `/ask-me` ขอ approval ก่อนทำ

### 4. Continue Or Stop

> Goal: ดำเนินการตามทีผู้ใช้เลือก

1. ถ้าผู้ใช้ต้องการ fix ต่อ → ใช้ `/resolve-errors`, `/fix` หรือ skill ทีเหมาะสม
2. ถ้าผู้ใช้ต้องการหยุด → report สถานะและจุดทีหยุด
3. ถ้าต้องการข้อมูลเพิ่ม → ทำ `/deep-research` หรือ `/ask-me`

### 5. Verify

> Goal: ตรวจสอบผลหลังดำเนินการ

1. รัน tests/build/typecheck ตาม ecosystem ถ้ามีการแก้ไข
2. ทำ `/report-before-after` เพื่อแสดง before/after
3. ทำ `/suggest-next-action`

## Rules

### 1. Report Before Continue

- ต้อง report ก่อนแนะนำ action เสมอ
- ไม่บังคับ fix ก่อนได้รับ confirmation

### 2. User Choice

- ให้ผู้ใช้เลือก action ถัดไป
- ถ้าผู้ใช้ข้าม/ปฏิเสธ → หยุดทันที

### 3. Safe Continue

- แก้ไขทีละไฟล์หรือทีละ small batch
- รัน verify หลังแก้ไข
- ถ้า fail → stop และ report

### 4. Evidence

- ทุก finding ต้องมีเหตุผลจาก report
- ระบุ file path และ line number
- ใช้ symbols แสดง status

## Expected Outcome

- report สถานะปัจจุบันชัดเจน
- next action ถูกแนะนำตามทีผู้ใช้ตกลง
- ผ่าน verify ถ้ามีการแก้ไข
- before/after report
- ทิศทางงานถัดไปชัดเจน

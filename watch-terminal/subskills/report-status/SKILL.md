---
name: watch-terminal-report-status
description: สร้าง terminal watch status report — command progress, errors, output summary
argument-hint: "[session]"
related:
  - report
  - report-progress
---

## Goal

แปลง watch session ของ `/watch-terminal` เป็น status report — command progress, errors, output highlights

## Scope

- ใช้เมื่อ `/watch-terminal` dispatch มาที่ `report`/`status` หรือเรียกหลัง watch จบ
- Chat-only report — ไม่สร้างไฟล์ถาวร

## Execute

### 1. Collect Output

> Goal: รวม output จาก watch interval

1. รวม output snapshots ต่อ interval (default ทุก 5 วิ)
2. ตรวจ state changes: progress %, new errors, completion signals
3. ตัด noise — spinner frames, repeated progress lines

### 2. Build Status Report

> Goal: ตอบว่า command คืบหน้า/ติดขัดยังไง

1. ตาราง: `No.`, `Time`, `Event`, `Detail`
2. สรุป: current state, elapsed, ETA ถ้าประเมินได้
3. errors ใหม่ที่โผล่ระหว่าง watch — แยกเป็น section

### 3. Verdict

> Goal: ตัดสินว่าต้อง intervene ไหม

1. Verdict: `running-fine` / `stalled` / `erroring` / `done`
2. ถ้า stalled/erroring → แนะนำ `/resolve-errors` หรือ kill command
3. ทำ `/report-progress` ถ้าต้องการ progress bar format

## Rules

- รายงานจาก output จริง — ห้ามเดาจากความเงียบ
- stalled = ไม่มี output ใหม่เกิน threshold — ระบุ threshold ที่ใช้
- เก็บ output ดิบไว้ให้ drill-down ได้

## Expected Outcome

- Status report พร้อม verdict ว่า command ปกติ/ติดขัด/เสร็จ

---
name: report-ansi
description: Format terminal reports with ANSI colors, progress bars, and status indicators
---

## Goal

สร้างรายงาน terminal ด้วย ANSI colors, progress bars, status symbols และ summary สำหรับ logs, status และ progress

## Scope

ใช้สำหรับรายงานความคืบหน้า, สถานะ, error summary ใน terminal ทีอ่านง่าย

## Execute

### 1. Collect Status

> Goal: รวบรวมข้อมูลทีต้องรายงาน
> Goal: มีข้อมูลสถานะครบ

1. อ่าน logs หรือ status จาก file/stdout
2. ระบุ categories ของข้อมูล
3. นับจำนวน pass/fail/warning

### 2. Format With ANSI

> Goal: จัดรูปแบบด้วย ANSI escape codes
> Goal: terminal output ชัดเจน

1. ใช้สี green สำหรับ success, red สำหรับ error, yellow สำหรับ warning, blue สำหรับ info
2. ใช้ bold สำหรับ headers
3. ใช้ progress bars สำหรับ percentage (ถ้ามี)
4. ใช้ symbols ✅ ❌ ⚠️ ℹ️ สำหรับ status

### 3. Render Summary

> Goal: แสดงสรุปด้านบน
> Goal: user เห็นภาพรวมก่อนรายละเอียด

1. สรุปจำนวนรายการตาม status
2. แสดง key findings สั้นๆ
3. แสดง progress ถ้ามี
4. แยกรายละเอียดด้านล่าง

## Rules

### 1. ANSI Safety

- ใช้ ANSI codes ที support common terminals
- ถ้า output ถูก redirect ให้รองรับ NO_COLOR
- ไม่ใช้ 256 colors ถ้าไม่จำเป็น

### 2. Readability

- summary อยู่ด้านบน
- จัดกลุ่มตาม category
- ใช้ symbols คู่กับสี

### 3. Consistency

- ใช้ชุดสีเดียวกันกับ `/report`
- ไม่ผสมหลาย color scheme

## Expected Outcome

- terminal report พร้อม ANSI colors
- status summary ด้านบน
- รายละเอียดด้านล่าง
- รองรับ common terminals

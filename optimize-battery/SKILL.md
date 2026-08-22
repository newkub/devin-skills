---
name: optimize-battery
description: ปรับปรุง battery ของ project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - optimize-codebase
---

## Goal

ปรับปรุง battery ของ project ให้ดีขึ้น

## Scope

ใช้กับ battery ใน project หรือ workspace ที่ต้องการปรับปรุง

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบัน
1. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
3. ถ้าไม่พบ issues -> stop และ report

### 2. Improve
> Goal: ปรับปรุง battery
1. ใช้ /follow-best-practice หรือ /learn-from-web หา best practices
2. แก้ไขปัญหาตาม priority
3. ถ้าแก้ >10 ไฟล์ -> ทำ /use-scripts

### 3. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate หรือ /run-check
2. ถ้าไม่ผ่าน -> ทำ /resolve-errors แล้ว retry (max 3)
3. ทำ /suggest-next-action

## Rules
### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ -> stop และ /ask-me

## Expected Outcome
- battery ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
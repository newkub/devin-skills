---
name: read-all-files
description: อ่านไฟล์ทั้งหมดในโปรเจกต์เพื่อวิเคราะห์
argument-hint: "all | patterns <glob>"
related:
  - all-this-patterns
  - deep-analyze
  - report-file-structure
  - read-devin-context
  - update-devin-global-skills
---

## Goal

อ่านและวิเคราะห์ไฟล์ทั้งหมดในโปรเจกต์อย่างครบถ้วน

## Scope

ใช้เมื่อต้องการอ่านทุกไฟล์หรือเฉพาะ pattern ที่เกี่ยวข้องกับ task

- `all` — อ่านทุกไฟล์ที่จำเป็นในโปรเจกต์
- `patterns <glob>` — อ่านเฉพาะไฟล์ที่ตรง glob pattern เช่น `src/**/*.ts`

## Execute

### 1. Prepare

> Goal: วางแผนการอ่าน

1. ทำ `/report-file-structure` เพื่อดู overview
2. ระบุประเภทไฟล์ที่ต้องการอ่าน ตาม argument
3. กำหนดลำดับความสำคัญ: config → entry points → core → tests → docs

### 2. Read Files

> Goal: อ่านไฟล์ครบถ้วน

1. ถ้า argument `all`:
   - อ่าน config files ก่อน
   - อ่าน entry points ต่อมา
   - อ่าน files ตาม import chain
   - ข้าม `node_modules`, `.git`, `dist`, `build`, `coverage`, `.devin/tmp`
2. ถ้า argument `patterns`:
   - ใช้ `/all-this-patterns` หา files ตาม pattern
   - อ่าน matching files ทั้งหมด
3. ใช้ parallel read สำหรับไฟล์อิสระ
4. จำกัด file ละ 250 บรรทัด; ถ้ายาวกว่า ให้อ่านต่อด้วย offset

### 3. Analyze

> Goal: วิเคราะห์สิ่งทีอ่าน

1. วิเคราะห์โครงสร้างโปรเจกต์
2. ระบุความสัมพันธ์ระหว่างไฟล์
3. สรุป pattern และ architecture — ทำ `/deep-analyze` หากต้องการวิเคราะห์ลึก
4. ตรวจสอบความสมบูรณ์ของการอ่าน

## Rules

- อ่าน config ก่อนเสมอ
- อ่าน entry points ก่อน dependencies
- อ่านตาม import chain
- ใช้ parallel reading สำหรับไฟล์อิสระ
- ข้ามไฟล์ที่ไม่เกี่ยวข้อง
- ใช้ `/read-devin-context` ถ้าจำเป็น
- ถ้าอ่านเพื่อปรับปรุง devin global skills → ใช้คู่กับ `/update-devin-global-skills`

## Expected Outcome

- อ่านไฟล์ทั้งหมดที่เกี่ยวข้อง
- เข้าใจโครงสร้างโปรเจกต์
- ระบุความสัมพันธ์ระหว่างไฟล์
- พร้อมสำหรับการวิเคราะห์ต่อ

---
name: write-examples
description: เขียน examples ครอบคลุมทุก API ใน project ลงใน examples/<title>/ ของ workspace
related:
  - analyze-project
  - follow-readme
  - run-dev
  - validate
  - report-table
  - write-test
  - update-usage-md
---

## Goal

เขียน examples ครอบคลุมทุก API ในโปรเจกต์

## Scope

ใช้ `write-examples` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม โดยสร้าง examples ใน `examples/<title>/` ภายใน workspace นั้นๆ

## Execute

### 1. Analyze APIs

> Goal: Analyze APIs

1. รัน `/analyze-project` เพื่อดูภาพรวม
2. อ่าน entry point และ index files ในแต่ละ module
3. ระบุ API ทั้งหมดจาก source code

### 2. Create Structure

> Goal: Create Structure

1. สร้าง `examples/<title>/` directory ใน workspace
2. สร้าง subdirectories ตาม project organization
3. สร้าง `src/` directory ในแต่ละ example subdirectory
4. สร้าง `README.md` อธิบายโครงสร้าง

### 3. Write Examples per Module

> Goal: Write Examples per Module

1. เขียน examples สำหรับทุก module ครอบคลุมทุก API
2. เขียน basic usage สำหรับแต่ละ API
3. เขียน advanced usage สำหรับ use cases ที่ซับซ้อน
4. เขียน edge cases และ error handling
5. เขียน `src/index.ts` ที่เมื่อ run example แล้ว ต้องแสดงทั้งหมดแบบ reactive ว่ามีอะไรบ้าง เพื่อให้เห็นภาพรวม

### 4. Write Integration Examples

> Goal: Write Integration Examples

1. End-to-end use case flows
2. Cross-module integration
3. Error handling flows

### 5. Validate

> Goal: Validate

1. รัน examples เพื่อตรวจสอบว่าทำงานได้จริง
2. ตรวจสอบว่าครอบคลุมทุก API
3. ตรวจสอบว่า code ถูกต้องและ runnable

### 6. Update Documentation

> Goal: Update Documentation

1. ทำตาม `/follow-readme` สำหรับการอัปเดท README.md
2. เพิ่ม examples ที่เขียนไว้ลงใน README.md ในส่วน Usage
3. อัปเดท API Reference ด้วยตารางครบถ้วนตามรูปแบบที่กำหนดใน `/follow-readme`

## Rules

### 1. Structure

- ทุก examples ต้องอยู่ใน `src/` directories
- แต่ละ example มีไฟล์แยก พร้อม comments และ output ที่คาดหวัง

### 2. Quality

- Examples ต้อง runnable ได้จริง
- ใช้ best practices

### 3. Coverage

- ครอบคลุมทุก public API
- ทั้ง basic และ advanced usage

### 4. Documentation

- มี description สั้นๆ อธิบาย input/output

### 5. Organization

- จัดเรียงตาม modules และ complexity

## Expected Outcome

- มี examples ครอบคลุมทุก API
- ทุก example runnable ได้จริง
- ผู้ใช้ copy-paste และใช้งานได้ทันที
- examples ถูกสร้างใน `examples/<title>/` ของ workspace นั้นๆ

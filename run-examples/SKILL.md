---
name: run-examples
description: เขียน examples ครอบคลุมทุก API ในโปรเจกต์
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
  - follow-readme
  - update-reference
  - follow-project-docs
  - analyze-project
---

## Goal

เขียน examples ครอบคลุมทุก API ในโปรเจกต์

## Scope

Use `run-examples` for the specific tasks and workflows it covers

## Execute

### 1. Prepare
> Goal: Prepare

1. ใช้ `/follow-project-docs` เพื่อเก็บ reference
2. รัน `/analyze-project` เพื่อดูภาพรวม

### 2. Analyze APIs
> Goal: Analyze APIs

1. อ่าน entry point และ index files ในแต่ละ module
2. ระบุ API ทั้งหมดจาก source code

### 3. Create Structure
> Goal: Create Structure

1. สร้าง `examples/` directory หรือใช้ `apps/examples` สำหรับ monorepo
2. สร้าง subdirectories ตาม project organization
3. สร้าง `README.md` อธิบายโครงสร้าง

### 4. Write Examples per Module
> Goal: Write Examples per Module

1. เขียน examples สำหรับทุก module ครอบคลุมทุก API
2. เขียน basic usage สำหรับแต่ละ API
3. เขียน advanced usage สำหรับ use cases ที่ซับซ้อน
4. เขียน edge cases และ error handling

### 5. Write Integration Examples
> Goal: Write Integration Examples

1. End-to-end use case flows
2. Cross-module integration
3. Error handling flows

### 6. Validate
> Goal: Validate

1. รัน examples เพื่อตรวจสอบว่าทำงานได้จริง
2. ตรวจสอบว่าครอบคลุมทุก API
3. ตรวจสอบว่า code ถูกต้องและ runnable

### 7. Update Documentation
> Goal: Update Documentation

1. ทำตาม `/follow-readme` สำหรับการอัพเดท README.md
2. เพิ่ม examples ที่เขียนไว้ลงใน README.md ในส่วน Usage
3. อัพเดท API Reference ด้วยตารางครบถ้วนตามรูปแบบที่กำหนดใน `/follow-readme`

### 8. Update Reference
> Goal: Update Reference

1. ใช้ `/update-reference` เพื่ออัพเดท references

## Rules

### 1. Structure

- แต่ละ example มีไฟล์แยก พร้อม comments และ output ที่คาดหวัง
- Examples ต้อง runnable ได้จริง ใช้ best practices
- ครอบคลุมทุก public API ทั้ง basic และ advanced usage
- มี description สั้นๆ อธิบาย input/output
- จัดเรียงตาม modules และ complexity

### 2. Monorepo

- ใช้ `apps/examples` สำหรับ monorepo
- ใช้ `examples` สำหรับ single package

### 3. Dependencies

- ใช้ `workspace:*` สำหรับ internal dependencies ใน monorepo

## Expected Outcome

มี examples ครอบคลุมทุก API
ทุก example runnable ได้จริง
ผู้ใช้ copy-paste และใช้งานได้ทันที

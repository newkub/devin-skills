---
name: more-file
description: เพิ่มไฟล์ใน project เมื่องชุดปัจจุบันไม่เพียงพอ
argument-hint: "[scope]"
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
---

## Goal

เพิ่มไฟล์เพิ่มเติม

## Scope

ใช้ `more-file` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม (file)

## Execute

### 1. Identify Needed Files

> Goal: ระบุไฟล์ที่ต้องเพิ่ม

1. รับ `<scope>` จาก argument หรือ context — ถ้าไม่ชัดให้ถาม user
2. วิเคราะห์ว่าไฟล์ปัจจุบันครอบคลุม scope หรือไม่
3. ระบุไฟล์ที่ขาด: source files, config, tests, docs, หรือ assets
4. ถ้าไม่แน่ใจ → ทำ `/follow-best-practice` เพื่อดู structure ที่เหมาะสม

### 2. Create Files

> Goal: สร้างไฟล์ตาม conventions

1. สร้างไฟล์ที่ระบุด้วย naming และ location ตาม project conventions
2. เพิ่ม boilerplate ที่จำเป็น: imports, exports, types, หรือ config
3. ถ้าเป็น source file → เพิ่ม stub implementation หรือ TODO
4. ถ้าเป็น config → ใช้ shared config หรือ defaults ที่เหมาะสม
5. ถ้ามีหลายไฟล์ → ทำ `/use-scripts` สำหรับ bulk creation

### 3. Verify And Report

> Goal: ยืนยันว่าไฟล์ถูกสร้างและใช้งานได้

1. ตรวจสอบว่าไฟล์ถูกสร้างใน location ที่ถูกต้อง
2. ถ้าเป็น source file → ตรวจว่าไม่มี import errors
3. ถ้าเป็น config → ตรวจว่า valid syntax
4. ทำ `/report` แสดงไฟล์ที่สร้างและสถานะ

## Rules

- ตั้งชื่อไฟล์ตาม project conventions
- วางไฟล์ใน location ที่ถูกต้อง
- ไม่สร้างไฟล์ที่ไม่จำเป็น
- ใช้ `/follow-best-practice` สำหรับ structure ที่เหมาะสม
- ใช้ `/suggest-next-action` หลังเสร็จเพื่อแนะนำขั้นตอนถัดไป
- ใช้ `/resolve-errors` ถ้าสร้างไฟล์แล้วมี errors

## Expected Outcome

- ไฟล์ที่ขาดถูกสร้างครบถ้วน
- ไฟล์อยู่ใน location และ naming ตาม conventions
- ไม่มี import errors หรือ config errors จากไฟล์ใหม่

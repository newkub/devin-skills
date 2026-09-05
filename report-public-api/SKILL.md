---
name: report-public-api
description: รายงาน public API ของ project หรือ library ในรูปแบบ markdown table
argument-hint: "[scope]"
related:
  - scan-codebase
  - check-code-structure
  - report-table
---

## Goal

วิเคราะห์และรายงาน public API (exports, functions, types, classes) ของ project หรือ library ให้ชัดเจน

## Scope

ใช้สำหรับ library, package, หรือ module ที่ต้องการสรุป public surface

## Execute

### 1. Collect Public API

> Goal: หา exports ทั้งหมดที่ public

1. ทำ `/scan-codebase` หรือ `/check-code-structure` เพื่อหา exports
2. อ่าน barrel files (`index.ts`, `index.js`, `mod.rs`, `lib.rs`)
3. แยกประเภท: function, class, type, interface, constant, enum, macro
4. ระบุ module/file ที่ export แต่ละตัว

### 2. Classify API

> Goal: จัดกลุ่ม public API

1. จัดกลุ่มตาม domain/module
2. ระบุ stability: stable, experimental, deprecated
3. ระบุ required parameters และ return type ถ้ามี

### 3. Report With Markdown Table

> Goal: สร้างรายงาน public API

1. ใช้ `/report-table` แสดง:
   - `| API | Type | Module | Description | Stability |`
2. กลุ่มตาม domain ด้วย heading `## <domain>`
3. สรุปจำนวน public API, breaking changes, deprecations

## Rules

- แสดงเฉพาะ public exports ไม่รวม internal
- ใช้ backticks ครอบชื่อ API
- ระบุ stability อย่างชัดเจน
- ไม่ต้องสร้างไฟล์แยกถ้า user ไม่ต้องการ

## Expected Outcome

- ตาราง public API ครบถ้วน
- จัดกลุ่มตาม domain
- ระบุ stability และ description
- ใช้ `/report-table` เป็นหลัก

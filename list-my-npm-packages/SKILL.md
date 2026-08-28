---
name: list-my-npm-packages
description: แสดงรายการ npm packages ทีผู้ใช้เป็น owner/author บน npm registry
related:
  - list-program-in-computer
  - report-table
  - suggest-next-action
---

## Goal

แสดงรายการ npm packages ทีผู้ใช้เป็น owner หรือ author บน npm registry พร้อม version, description, last published

## Scope

ใช้สำหรับดู packages ที publish จาก account ของผู้ใช้ โดย query จาก npm registry หรือ npm CLI โดยไม่แก้ไข packages

## Execute

### 1. Verify npm And Authentication

> Goal: ยืนยันว่า npm พร้อมและ authenticated

1. รัน `npm --version` เพื่อตรวจสอบการติดตั้ง
2. รัน `npm whoami` เพื่อรับ username ที login อยู่
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `npm login` หรือ `npm adduser`
4. บันทึก username

### 2. List Packages By Ownership

> Goal: ดึงรายการ packages ที user เป็นเจ้าของ

1. รัน `npm access ls-packages` เพื่อรับ JSON mapping package -> permission
2. ถ้า `npm access ls-packages` ไม่ใช้ได้ ให้ fallback:
   - `curl "https://registry.npmjs.org/-/v1/search?text=author:<username>&size=250"` หรือ
   - `curl "https://registry.npmjs.org/-/v1/search?text=maintainer:<username>&size=250"`
3. บันทึกรายการ package names

### 3. Fetch Package Metadata

> Goal: ดึง version, description, last published

1. สำหรับแต่ละ package รัน `npm view <package> version description time.modified --json`
2. หรือ batch ด้วย Bun/Node script โดยเรียก `https://registry.npmjs.org/<package>`
3. บันทึก version, description, last published date

### 4. Build Report

> Goal: รายงานผลเป็นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Package
   - Version
   - Last Published
   - Description
2. เรียงตาม Last Published ล่าสุด
3. ระบุสรุปจำนวน packages

### 5. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ publish, deprecate, หรือ update packages

## Rules

### 1. Authentication

- ต้อง login ด้วย npm ก่อน
- ไม่ expose token, password หรือ credentials ใน output

### 2. Read Only

- ไม่ publish, unpublish, deprecate หรือ update package ใดๆ
- แค่ query และรายงาน

### 3. Rate Limit

- ถ้า packages มาก → ใช้ batch หรือ sleep เพื่อไม่ hit rate limit
- ถ้า API ไม่ตอบ → report timeout และ stop

### 4. Scope

- แสดง packages ที user เป็น owner/author เท่านั้น
- ถ้าไม่แน่ใจว่า user หมายถึง `installed packages` หรือ `published packages` → ทำ `/ask-me`

## Expected Outcome

- รายการ npm packages ที user เป็น owner พร้อม version, description, last published
- ตารางที sort ตาม last published
- ไม่มีการแก้ไข package ใดๆ

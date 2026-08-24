---
name: cleanup-files-in-project
description: Clean up unnecessary source files in the project, not build artifacts or dependency caches
---

## Goal

ลบ source files ที่ไม่จำเป็นใน project เช่น ไฟล์ที่ไม่ถูกใช้ ซ้ำซ้อน หรือ dead code โดยไม่แตะ build artifacts หรือ dependency caches

## Scope

ใช้กับ source files ใน project workspace — ไม่รวม `node_modules`, `dist`, `target`, `.next`, `.nuxt`, `.output`, `coverage`, logs, caches, หรือ generated build files

## Execute

### 1. Identify Candidates

> Goal: หา source files ที่ไม่จำเป็น
> Goal: มีรายการ files ที่ควรลบ

1. ทำ `/check-unused-files` เพื่อหาไฟล์ที่ไม่ถูกใช้
2. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ต้องใช้
3. ค้นหา duplicate files ด้วย `glob` และ `exec` (hash comparison)
4. ค้นหา empty files, orphan test fixtures, abandoned stubs

### 2. Analyze Impact

> Goal: ประเมินผลกระทบก่อนลบ
> Goal: ลบได้ปลอดภัย

1. ใช้ `grep` ค้นหา imports หรือ references ของแต่ละ file
2. ตรวจสอบว่าไฟล์อยู่ใน `.gitignore` หรือไม่
3. ระบุไฟล์ที่เป็น source จริง (`.ts`, `.js`, `.rs`, `.py`, `.go`, `.vue`, `.svelte` ฯลฯ)
4. ยกเว้น build artifacts, lock files, config files, `.env`, `AGENTS.md`, `README.md`

### 3. Confirm With User

> Goal: ขอ explicit confirmation ก่อนลบ
> Goal: ไม่มีการลบอัตโนมัติ

1. ทำ `/report-table` รายงาน candidates พร้อมเหตุผลและ path
2. ทำ `/report-file-structure` แสดง top-level files ที่จะลบ
3. ถาม user ด้วย `ask_user_question` ว่าต้องการลบไหม

### 4. Remove Source Files

> Goal: ลบเฉพาะไฟล์ที่ได้รับ approval
> Goal: source files ไม่จำเป็นถูกลบ

1. ลบทีละไฟล์ด้วย `Remove-Item` หรือ `rm`
2. อัปเดท imports/references ที่ใช้ไฟล์นั้นด้วย `edit`
3. อัปเดท `README`, `AGENTS.md` ถ้าจำเป็น

### 5. Validate

> Goal: ตรวจสอบหลังลบ
> Goal: ไม่มี broken references

1. รัน `git status` เพื่อดู files ที่ถูกลบ
2. ทำ `/check-reference` เพื่อตรวจ broken references
3. รัน project tests หรือ build ถ้ามี

## Rules

### 1. Source Only

- ลบเฉพาะ source files เช่น `.ts`, `.js`, `.tsx`, `.jsx`, `.vue`, `.svelte`, `.rs`, `.py`, `.go`
- ไม่ลบ build artifacts (`dist`, `target`, `.output`), dependency caches (`node_modules`, `.bun/install/cache`), logs, coverage
- ไม่ลบ lock files, config files, `.env`, `AGENTS.md`, `README.md`

### 2. Explicit Confirmation

- ห้ามลบอัตโนมัติ
- ต้องได้รับ approval จาก user ก่อนลบ
- ถ้าไม่แน่ใจให้ ask ก่อน

### 3. Safe Impact

- ใช้ `grep` ตรวจ references ก่อนลบ
- อัปเดท imports/exports ทั้งหมดหลังลบ
- ตรวจสอบ `git status` ก่อนและหลัง

### 4. Ecosystem Aware

- ปฏิบัติตาม conventions ของภาษา/เฟรมเวิร์ค
- ถ้ามี barrel exports ให้อัปเดท

## Expected Outcome

- source files ที่ไม่จำเป็นถูกลบ
- ไม่มี build artifacts หรือ dependency caches ถูกแตะ
- imports/exports อัปเดทถูกต้อง
- รายงานตารางและ file structure ก่อน/หลัง

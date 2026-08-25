---
name: git-submodule-delete
description: ลบ git submodule ออกจาก repository อย่างสมบูรณ์
argument-hint: "[path]"
---

## Goal

ลบ git submodule ออกจาก repository อย่างสมบูรณ์ ทั้งจาก `.gitmodules`, `.git/modules`, และ working tree

## Scope

ใช้สำหรับการลบ git submodule ที่ไม่ต้องการอีกต่อไป พร้อม cleanup ทุกส่วนที่เกี่ยวข้อง

## Execute

### 1. Deinit Submodule
> Goal: Deinit Submodule

1. รัน `git submodule deinit -f <submodule-path>` เพื่อลบ submodule จาก configuration
2. ตรวจสอบว่า submodule ถูก deinit สำเร็จ

### 2. Remove From Gitmodules
> Goal: Remove From Gitmodules

1. ลบ entry ของ submodule ออกจาก `.gitmodules`
2. ลบ entry ของ submodule ออกจาก `.git/config`
3. ถ้าไม่มี submodule เหลือ ลบไฟล์ `.gitmodules` ออกเลย

### 3. Remove From Working Tree
> Goal: Remove From Working Tree

1. รัน `git rm -f <submodule-path>` เพื่อลบ submodule จาก working tree
2. ตรวจสอบว่า submodule folder ถูกลบแล้ว

### 4. Clean Git Modules
> Goal: Clean Git Modules

1. ลบ submodule ออกจาก `.git/modules/<submodule-path>`
2. ใช้ `Remove-Item .git/modules/<submodule-path> -Recurse -Force` บน Windows
3. ใช้ `rm -rf .git/modules/<submodule-path>` บน macOS/Linux

### 5. Garbage Collect
> Goal: Garbage Collect

1. รัน `git gc` เพื่อ cleanup orphaned objects
2. ตรวจสอบว่าไม่มี references เหลืออยู่

## Rules

### 1. Order Of Operations

- ทำ `git submodule deinit` ก่อนเสมอ
- ลบจาก `.gitmodules` ก่อนลบจาก working tree
- ลบ `.git/modules` หลังจากลบ working tree แล้ว
- รัน `git gc` เป็นขั้นตอนสุดท้าย

### 2. Safety Checks

- ตรวจสอบว่าไม่มี uncommitted changes ใน submodule ก่อนลบ
- ตรวจสอบว่าไม่มี dependencies อื่นอ้างถึง submodule นั้น
- ถ้าเป็น monorepo ตรวจสอบว่าไม่มี workspace อื่นใช้ submodule นั้น

### 3. Cleanup Completeness

- ลบทุกส่วน: `.gitmodules`, `.git/config`, `.git/modules`, working tree
- ถ้าเป็น submodule ตัวเดียว ลบ `.gitmodules` ออกเลย
- รัน `git gc` เสมอหลังลบเสร็จ

## Expected Outcome

- Submodule ลบออกจาก repository อย่างสมบูรณ์
- ไม่มี references เหลืออยู่ใน `.gitmodules`, `.git/config`, `.git/modules`
- Working tree สะอาด ไม่มี submodule folder
- `git gc` ทำงานเสร็จโดยไม่มี error

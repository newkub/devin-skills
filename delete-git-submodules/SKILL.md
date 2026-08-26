---
name: delete-git-submodules
description: ลบ git submodule อย่างปลอดภัย
description: ลบ git submodule ออกจาก repo โดยลบทั้ง config, index และ working tree
argument-hint: "[path]"
related:
  - list-git-submodules
  - git-commit
  - ship
---

## Goal

ลบ git submodule ออกจาก parent repository อย่างปลอดภัย ไม่ทิ้งร่องรอยใน .gitmodules หรือ .git/modules

## Scope

ใช้เมื่อต้องการถอน submodule ออกจาก repo

## Execute

### 1. Identify Submodule

> Goal: ระบุ submodule ทีต้องการลบ

1. รัน `git config --file .gitmodules --get-regexp path` เพื่อดูรายการ submodule
2. หรือทำ `/list-git-submodules`
3. ยื่นยัน `path` ของ submodule ทีต้องการลบ

### 2. Remove From Git

> Goal: ลบ submodule ออกจาก index และ config

1. รัน `git rm <submodule-path>`
2. รัน `git config --file .gitmodules --remove-section submodule.<name>`
3. ถ้า `.gitmodules` ว่าง → ลบไฟล์

### 3. Remove Git Metadata

> Goal: ลบ .git/modules metadata

1. รัน `rm -rf .git/modules/<submodule-path>` หรือ `Remove-Item -Recurse -Force .git/modules/<submodule-path>`
2. ตรวจสอบว่า directory ยังอยู่ใน working tree หรือไม่
3. ถ้ายังเหลือ directory ให้ลบหรือ move ตามต้องการ

### 4. Commit Changes

> Goal: บันทึกการลบ

1. รัน `git status` ตรวจสอบ
2. รัน `git add .gitmodules`
3. ทำ `/git-commit`
4. ถ้าต้องการ push → ทำ `/ship`

## Rules

### 1. Verify Before Delete

- ตรวจสอบว่า submodule ใช้งานไม่อยู่จริง
- ไม่ลบถ้า submodule มี uncommitted changes โดยไม่ถาม
- สำรองข้อมูลสำคัญก่อนลบ

### 2. Clean All References

- ลบทั้งจาก `.gitmodules`, `index`, `.git/modules`
- ตรวจ `git submodule status` หลังลบ

### 3. Preserve Parent Repo

- ไม่ทำลาย parent repo
- ไม่ลบ files อื่นที่ไม่เกี่ยวข้อง

## Expected Outcome

- Submodule ถูกลบออกจาก repo
- `git submodule status` ไม่แสดง submodule นั้น
- `.gitmodules` และ `.git/modules` สะอาด
- มี commit บันทึกการลบ

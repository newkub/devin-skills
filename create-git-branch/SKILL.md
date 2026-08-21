---
name: create-git-branch
description: สร้าง git branch ใหม่อย่างถูกต้อง
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
  - follow-git-branch
  - follow-git
  - ship
---

## Goal

สร้าง branch ใหม่จาก base ที่ถูกต้อง พร้อมตั้งชื่อที่เหมาะสม

## Scope

ใช้ก่อนเริ่ม feature, bugfix, hotfix หรือ experiment

## Execute

### 1. Determine Base
> Goal: Determine Base

1. ระบุ default branch (main/master)
2. ตรวจสอบว่า base branch เป็นเวอร์ชันล่าสุด
3. ถ้าจำเป็นให้ pull ล่าสุดก่อน

### 2. Choose Naming
> Goal: Choose Naming

1. `feature/<ticket>-description`
2. `bugfix/<ticket>-description`
3. `hotfix/description`
4. `experiment/description`
5. ใช้ lowercase คั่นด้วย `-`

### 3. Create And Switch
> Goal: Create And Switch

1. `git switch -c <branch>` สำหรับ modern git
2. หรือ `git checkout -b <branch>`
3. ตรวจสอบว่าอยู่บน commit ที่ถูกต้อง
4. push upstream ด้วย `git push -u origin <branch>`

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- สร้างจาก latest default branch
- ตั้งชื่อ branch สื่อความหมาย
- 1 branch ต่อ 1 concern
- ไม่สร้าง branch ซ้ำ

## Expected Outcome

- มี branch ใหม่บน base ล่าสุด
- ชื่อ branch ตาม convention
- อยู่ใน branch ใหม่แล้ว

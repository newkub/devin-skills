---
name: convert-to-git-submodules
description: แปลง directory ใน repo ไปเป็น git submodule
related:
  - create-github-repo
  - git-commit-and-push
  - list-git-submodules
  - delete-git-submodules
  - ship
---

## Goal

แปลง directory ภายใน parent repository ให้เป็น git submodule โดยสร้าง remote repo ใหม่ แล้ว clone กลับมาเป็น submodule

## Scope

ใช้เมื่อ directory ใน repo โตเกินไป ต้องการแยกเป็น repo อิสระ หรือต้องการใช้ submodule

## Execute

### 1. Identify Directory

> Goal: ระบุ directory ทีจะ convert

1. ตรวจสอบ `path` ของ directory ใน parent repo
2. ยื่นยันว่า directory ไม่ใช่ submodule อยู่แล้ว
3. ตรวจสอบว่า directory ไม่มี uncommitted changes สำคัญ

### 2. Create Remote Repo

> Goal: มี remote repo สำหรับ directory

1. ใช้ `/create-github-repo` หรือ `gh repo create <repo-name>`
2. บันทึก remote URL ทีได้มา
3. ถ้าไม่มี remote ใหม่ให้ถามก่อนดำเนินการ

### 3. Convert To Repo And Push

> Goal: ทำให้ directory เป็น repo และ push

1. ย้าย directory ออกไปไว้นอก parent repo ชั่วคราว เช่น `/tmp/<name>`
2. รัน `git init` ใน directory นั้น
3. รัน `git add .` แล้ว `git commit -m "initial commit"`
4. รัน `git remote add origin <remote-url>`
5. รัน `git push -u origin main` (หรือ master)
6. หรือทำ `/git-commit-and-push`

### 4. Replace With Submodule

> Goal: แทนที directory เดิมด้วย submodule

1. ลบ directory เก่าออกจาก parent repo: `git rm -r <path>`
2. รัน `git commit -m "remove directory before adding as submodule"`
3. รัน `git submodule add <remote-url> <path>`
4. รัน `git submodule update --init --recursive`
5. ตรวจสอบว่า submodule ถูก clone ลงมา

### 5. Commit And Push Parent

> Goal: บันทึกการเปลี่ยนแปลง

1. รัน `git add .gitmodules <path>`
2. รัน `git status` ตรวจสอบ
3. ทำ `/git-commit`
4. ทำ `/ship` ถ้าต้องการ push

## Rules

### 1. Backup And Confirm

- ทำ dry run หรือ backup ก่อนลบ directory
- ถามก่อนถ้ามี uncommitted/unpushed changes
- ไม่ลบ history ของ parent repo

### 2. Preserve History

- ถ้าต้องการ keep history → ใช้ `git filter-repo` หรือ split subtree ก่อน
- ระบุว่าการ convert นี้สร้าง repo ใหม่โดยไม่มี history เดิม

### 3. Remote Required

- ต้องมี remote repo ก่อน add submodule
- ตรวจสอบสิทธิ์ push ก่อน

### 4. Clean Working Tree

- parent repo ต้อง clean ก่อนเริ่ม
- submodule ต้อง clone สำเร็จก่อน commit

## Expected Outcome

- Directory กลายเป็น git submodule
- `.gitmodules` อัปเดต
- Submodule ถูก clone ลงมา
- Parent repo มี commit บันทึกการเปลี่ยนแปลง

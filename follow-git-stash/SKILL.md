---
name: follow-git-stash
description: จัดการ git stash สำหรับเก็บและกู้คืน changes ชั่วคราว
---

## Goal

จัดการ git stash อย่างเป็นระบบ สำหรับเก็บ changes ชั่วคราวและกู้คืนเมื่อต้องการ

## Scope

ครอบคลุม git stash operations: create, list, pop, apply, drop และ manage stash entries

## Execute

### 1. Create Stash

1. ตรวจสอบ changes ด้วย `git status`
2. รัน `git stash push -m "<description>"` เพื่อ stash changes พร้อม description
3. ใช้ `git stash push --keep-index` ถ้าต้องการเก็บเฉพาะ unstaged changes
4. ใช้ `git stash push -u` ถ้าต้องการ stash untracked files ด้วย

### 2. List Stashes

1. รัน `git stash list` เพื่อดู stashes ทั้งหมด
2. ตรวจสอบ description และ branch ของแต่ละ stash
3. ระบุ stashes ที่เก่าและไม่จำเป็น

### 3. Apply Stash

1. รัน `git stash pop` เพื่อ apply stash ล่าสุดและลบออกจาก list
2. รัน `git stash apply stash@{n}` เพื่อ apply stash เฉพาะโดยไม่ลบ
3. ถ้ามี conflicts ให้แก้ไขก่อน `git stash drop`
4. ตรวจสอบว่า changes ถูก apply ถูกต้องด้วย `git status`

### 4. Drop Stash

1. รัน `git stash drop stash@{n}` เพื่อลบ stash เฉพาะ
2. รัน `git stash clear` เพื่อลบ stashes ทั้งหมด (ใช้อย่างระมัดระวัง)
3. ตรวจสอบว่าไม่ได้ลบ stash ที่ยังต้องการ

### 5. Stash Workflow

1. ใช้ stash เมื่อต้องการสลับ branch โดยไม่ commit
2. ใช้ stash เมื่อต้องการ pull โดยไม่มี conflicts
3. หลัง apply stash ให้ทำ `/git-commit` ถ้า changes พร้อม
4. หลีกเลี่ยงการมี stashes มากเกินไป — ใช้ `/git-commit` แทนถ้า changes พร้อม

## Rules

### 1. Stash Hygiene

- ใช้ description ทุกครั้ง: `git stash push -m "<description>"`
- ลบ stashes ที่ไม่ใช้งาน
- ห้ามใช้ stash เป็น long-term storage — ใช้ branch หรือ commit แทน
- ตรวจสอบ `git stash list` อย่างสม่ำเสมอ

### 2. Stash Over Commit

- ใช้ stash เฉพาะเมื่อต้องการเก็บ changes ชั่วคราว
- ถ้า changes พร้อมให้ทำ `/git-commit` แทน stash
- ถ้าต้องการทำงานหลาย branches ให้ใช้ `/create-git-worktree` แทน stash

### 3. Conflict Safety

- ตรวจสอบว่าไม่มี conflicts ก่อน apply stash
- ถ้ามี conflicts ให้แก้ไขก่อน drop stash
- ห้าม `git stash clear` โดยไม่ตรวจสอบ stashes ทั้งหมด

### 4. Non-Redundancy

- รายละเอียด commit อยู่ใน `/git-commit` แล้ว
- รายละเอียด worktree อยู่ใน `/create-git-worktree` แล้ว

## Expected Outcome

- Stashes จัดการเป็นระบบ ไม่มี stale stashes
- Changes ชั่วคราวเก็บและกู้คืนได้อย่างปลอดภัย
- ไม่ใช้ stash เป็น long-term storage

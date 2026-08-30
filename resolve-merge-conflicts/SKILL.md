---
name: resolve-merge-conflicts
description: แก้ไข git merge conflicts อย่างปลอดภัย ไม่สูญเสีย changes
related:
  - idea-merge-files
  - merge-git-branch
  - merge-github-pr
  - git-commit
---

## Goal

แก้ไข git merge conflicts ด้วยการเลือกฝ่ายที่ถูกต้อง รวม changes ทีดีทั้งสองฝ่าย และไม่สูญเสียงาน

## Scope

ใช้เมื่องาน pull/rebase/merge แล้วเกิด conflicts ใน code, config, หรือ docs

## Execute

### 1. Identify Conflicts

> Goal: รู้ไฟล์ไหนมี conflicts ก่อนแก้ไข

1. รัน `git status` เพื่อดูไฟล์ `Unmerged`
2. รัน `git diff --name-only --diff-filter=U`
3. บันทึกรายการไฟล์ทีมี conflicts

### 2. Understand Conflicting Changes

> Goal: เข้าใจว่าแต่ละฝ่ายเปลี่ยนอะไร

1. รัน `git log --merge --left-right --oneline`
2. เปรียบเทียบ ` ours` และ `theirs` สำหรับแต่ละไฟล์
3. อ่าน `<<<<<<<`, `=======`, `>>>>>>>` markers ในไฟล์
4. ถ้าไม่แน่ใจว่าฝ่ายไหนถูก → หยุดและถามเจ้าของ branch

### 3. Resolve Each File

> Goal: ไฟล์แต่ละไฟล์ไม่มี conflict markers และยังทำงานได้

1. อ่านไฟล์ทีมี conflicts
2. เลือก: ใช้ `ours`, `theirs`, หรือรวมแบบ manual
3. ถ้าทั้งสองฝ่ายมีส่วนดี → รวมดีทั้งสองฝ่าย
4. ลบ `<<<<<<<`, `=======`, `>>>>>>>` ทั้งหมด
5. บันทึกทำไมถึงเลือกแบบนั้นใน commit message

### 4. Validate

> Goal: ตรวจสอบว่า conflict resolution ไม่พัง

1. รัน `git diff --check` เพื่อตรวจ conflict markers ตกค้าง
2. รัน `grep -E '^<<<<<<<|^=======|^>>>>>>>'` ใน repo
3. รัน lint, typecheck, tests ถ้ามี
4. ถ้า fail → กลับไป resolve ใหม่

### 5. Stage And Commit

> Goal: เก็บผลการ resolve

1. `git add` ทุกไฟล์ที resolve แล้ว
2. `git commit` หรือทำ `/git-commit`
3. ถ้า rebase → `git rebase --continue`
4. ถ้า merge → ปิด merge

## Rules

### 1. Never Lose Work

- ไม่ลบ changes โดยไม่เข้าใจ
- ถ้าไม่แน่ใจ ให้ abort ก่อน (`git merge --abort` หรือ `git rebase --abort`)

### 2. Use Tools

- ใช้ `git mergetool` ถ้ามี
- ใช้ `git diff` เพื่อเปรียบเทียบ versions
- ไม่แก้มือล้วนถ้า conflict ซับซ้อน

### 3. Test After Resolve

- ต้องรัน test ก่อน commit
- ถ้าไม่มี test ให้ build หรือ run typecheck

### 4. Clean History

- commit message ระบุว่า resolve conflicts
- ถ้า rebase มีหลาย conflict ให้ squash ถ้าเหมาะสม

- ใช้ /idea-merge-files ถ้าจำเป็น
- ใช้ /merge-git-branch ถ้าจำเป็น
- ใช้ /merge-github-pr ถ้าจำเป็น

## Expected Outcome

- ไม่มี conflict markers ตกค้าง
- ทุกไฟล์สามารถ build/test ผ่าน
- ไม่สูญเสีย changes จากฝ่ายใดฝ่ายหนึ่ง
- commit history สะอาดและอธิบายชัดเจน

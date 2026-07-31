---
name: follow-git-conflict
description: resolve merge conflicts อย่างเป็นระบบ ครอบคลุม analysis, resolution และ validation
---

## Goal

Resolve merge conflicts อย่างเป็นระบบ ครอบคลุมการวิเคราะห์ แก้ไข และตรวจสอบ

## Scope

ครอบคลุม merge conflict resolution จาก merge, rebase, cherry-pick และ pull

## Execute

### 1. Identify Conflicts

1. รัน `git status` เพื่อดูไฟล์ที่มี conflict
2. ระบุประเภท conflict: both modified, both added, deleted by us/them
3. อ่าน conflict markers `<<<<<<<`, `=======`, `>>>>>>>` ในแต่ละไฟล์
4. ทำความเข้าใจ context ของทั้งสองฝั่ง

### 2. Analyze Root Cause

1. รัน `git log --oneline --merge` เพื่อดู commits ที่ทำให้เกิด conflict
2. รัน `git diff` เพื่อดูการเปลี่ยนแปลงจากทั้งสองฝั่ง
3. วิเคราะห์ว่าทั้งสองฝั่งเปลี่ยนแปลงอะไร และทำไม conflict
4. ตัดสินใจว่าควรเก็บฝั่งไหน หรือรวมทั้งสองฝั่ง

### 3. Resolve Conflicts

1. แก้ไขไฟล์โดยเลือกเนื้อหาที่ถูกต้อง ลบ conflict markers ออก
2. ถ้าทั้งสองฝั่งจำเป็น ให้รวมเนื้อหาอย่างมีตรรกะ
3. รัน `git add <file>` หลังแก้ไขไฟล์
4. ทำซ้ำจนกว่าทุกไฟล์จะ resolved

### 4. Validate Resolution

1. รัน `git status` เพื่อตรวจสอบว่าไม่มี conflicts เหลือ
2. รัน typecheck เพื่อตรวจสอบว่า code ถูกต้อง
3. รัน lint เพื่อตรวจสอบ code quality
4. รัน tests เพื่อตรวจสอบ functionality
5. ทำ `/run-verify` เพื่อตรวจสอบครบถ้วน

### 5. Complete Merge

1. รัน `git merge --continue` หรือ `git rebase --continue` ตาม context
2. ตรวจสอบ commit message ให้สื่อความหมาย
3. ทำ `/git-push` เพื่อ push ไปยัง remote

## Rules

### 1. Resolution Discipline

- แก้ที่ root cause ไม่ใช่แค่ลบ conflict markers
- เข้าใจ context ของทั้งสองฝั่งก่อนตัดสินใจ
- ห้ามเลือกฝั่งเดียวโดยไม่วิเคราะห์
- ตรวจสอบว่า code ทำงานได้หลัง resolve

### 2. Conflict Markers

- ห้ามปล่อย conflict markers ค้างใน code
- ตรวจสอบด้วย `grep -r "<<<<<<" .` หลัง resolve
- ลบ markers ออกทั้งหมดก่อน commit
- ใช้ editor ที่ highlight conflict markers

### 3. Abort Safety

- ถ้า conflicts ซับซ้อนเกินไป ให้ `git merge --abort` หรือ `git rebase --abort`
- ทำ `/resolve-errors` ถ้าเกิดปัญหาซับซ้อน
- ไม่ force resolution ถ้าไม่มั่นใจ
- ปรึกษา team member ถ้า conflict เกี่ยวกับ shared code

### 4. Non-Redundancy

- รายละเอียด rebase conflicts อยู่ใน `/follow-git-rebase` แล้ว
- รายละเอียด error resolution อยู่ใน `/resolve-errors` แล้ว

## Expected Outcome

- Conflicts ได้รับการแก้ไขอย่างถูกต้อง
- ไม่มี conflict markers ค้างใน code
- Code ทำงานได้หลัง resolve conflicts
- Merge หรือ rebase ดำเนินการต่อได้

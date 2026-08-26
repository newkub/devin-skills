---
name: edit-git-commit
description: แก้ไข commit messages และประวัติ git อย่างปลอดภัยด้วย amend, rebase, squash
---

## Goal

แก้ไข commit messages, รวม commits, หรือ reword ประวัติ git อย่างปลอดภัย โดยไม่ทำลายข้อมูลที่ไม่จำเป็น

## Scope

ใช้สำหรับ local git repository ที่ต้องการแก้ไข commit ก่อน push ครอบคลุม `git commit --amend`, `git rebase -i`, `git rebase --onto`, squash, fixup, reword

## Execute

### 1. Identify Edit Target

> Goal: ระบุ commit ที่ต้องการแก้ไข

1. ทำ `/list-git-commit` หรือ `git log --oneline -20` เพื่อดู commits ล่าสุด
2. ระบุ commit hash หรือ `HEAD~n` ที่ต้องการแก้
3. ระบุประเภทการแก้ไข: reword, squash, fixup, amend, drop, reorder
4. ถ้า commit ถูก push แล้ว → stop และ report ก่อน เพราะอาจกระทบผู้อื่น

### 2. Amend Last Commit

> Goal: แก้ไข commit ล่าสุด

1. ถ้าต้องการแก้ message → รัน `git commit --amend -m "<new-message>"`
2. ถ้าต้องการเพิ่มไฟล์ → `git add <files>` แล้ว `git commit --amend --no-edit`
3. ถ้าต้องการแก้ message และเพิ่มไฟล์ → `git add <files>` แล้ว `git commit --amend -m "<new-message>"`
4. ตรวจสอบผลด้วย `git log --oneline -3`

### 3. Interactive Rebase

> Goal: แก้ไขหลาย commit

1. รัน `git rebase -i HEAD~<n>` โดย `<n>` คือจำนวน commit ที่ต้องการแก้
2. ในหน้า todo ระบุ action สำหรับแต่ละ commit:
   - `reword` แก้ commit message
   - `squash` รวม commit เข้ากับ commit ก่อนหน้า
   - `fixup` รวมโดยไม่เก็บ message
   - `drop` ลบ commit
   - `edit` หยุดเพื่อแก้ไข
   - `reorder` ย้ายบรรทัด
3. บันทึกและปิด editor เพื่อดำเนินการ
4. ถ้า rebase มี conflict → ทำ `/resolve-merge-conflicts`

### 4. Verify History

> Goal: ยืนยันว่าประวัติถูกต้อง

1. รัน `git log --oneline -10` เพื่อดูผลลัพธ์
2. ตรวจสอบ commit messages ตรงกับ conventional commits
3. รัน `git diff <original-head>..HEAD` เพื่อดูว่าเนื้อหาไฟล์ไม่เปลี่ยน (ถ้าแก้เฉพาะ message)
4. รัน `git status` เพื่อดูว่าไม่มี leftover changes

### 5. Safety Check Before Push

> Goal: ไม่ rewrite history ที push แล้ว

1. ถ้า branch มี remote → ใช้ `git status` หรือ `git log --oneline --graph --decorate` ตรวจว่า upstream นำหน้า
2. ถ้า commits ถูก push แล้ว → แนะนำ `git revert` หรือ `git commit --fixup` แทน
3. ถ้าต้องการ force push → ต้องได้ user confirmation ก่อน

## Rules

### 1. No Silent Force Push

- ไม่ `git push --force` โดยไม่ได้ user confirmation
- ถ้าต้อง force push → ระบุเหตุผลและ impact
- แนะนำ `git push --force-with-lease` ถ้าจำเป็น

### 2. Preserve Content

- ถ้าแก้เฉพาะ commit message → ต้องมีเนื้อหาไฟล์เหมือนเดิม
- ถ้า rebase → ตรวจสอบ `git diff` ก่อนและหลัง
- ไม่ลบ commit ทีมี code สำคัญโดยไม่ได้บันทึก

### 3. Conflict Resolution

- ถ้า rebase เกิด conflict → หยุดและทำ `/resolve-merge-conflicts`
- ไม่ skip conflict หรือตัดสินใจเองโดยไม่มี evidence

### 4. Conventional Commits

- แก้ commit message ให้ตรง conventional commits format
- subject ไม่เกิน 72 ตัวอักษร
- ไม่ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่ ไม่จบด้วยจุด

## Expected Outcome

- Commit message ถูกแก้ไขตามที่ขอ
- History ถูก cleanup ด้วย squash/fixup/reorder ถ้าต้องการ
- ไม่มี commit ทีถูก push แล้วถูก rewrite โดยไม่ได้รับ approval
- `git log` แสดงผลตาม expected

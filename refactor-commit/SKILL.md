---
name: refactor-commit
description: Refactor commits ที่ commit ไปแล้วด้วย interactive rebase (break down, edit, reorganize)
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

Refactor commits ที่ commit ไปแล้วเพื่อ break down, edit, หรือ reorganize commits ให้เหมาะสม

## Scope

ใช้สำหรับแก้ไข commits ที่ commit ไปแล้วด้วย `git rebase` (interactive หรือ non-interactive) เพื่อ:
- Break down commit ขนาดใหญ่เป็น commits ย่อยๆ
- Edit commit messages ตาม conventional commits
- Reorder commits ตาม logical order
- Squash commits หลายตัวเป็นตัวเดียว
- Fix commits ที่ผิดพลาด
- Move commits ระหว่าง branches ด้วย cherry-pick
- Rebase commits ไปยัง upstream โดยอัตโนมัติ (non-interactive)

## Execute

### 1. Check Status

ตรวจสอบสถานะก่อน refactor

1. ทำ `git branch --show-current` เพื่อดู current branch
2. ทำ `git status` เพื่อดูว่าไม่มี uncommitted changes
3. ทำ `git log --oneline -10` เพื่อดู commits ล่าสุด
4. ทำ `git log --oneline origin/<branch>..HEAD` เพื่อดู commits ที่ยังไม่ได้ push

### 2. Check Shared Status

ตรวจสอบว่า branch ไม่ได้ถูก shared กับทีม

1. ทำ `git branch -r` เพื่อดู remote branches
2. ทำ `git log --oneline origin/<branch>..HEAD` เพื่อดู commits ที่ยังไม่ได้ push
3. ถ้ามี commits ที่ถูก push ไปแล้ว, แจ้งเตือนผู้ใช้เกี่ยวกับความเสี่ยงของ force push
4. แนะนำให้ใช้ branch ส่วนตัวสำหรับ refactor

### 3. Backup Branch

สร้าง backup branch ก่อน refactor

1. ทำ `git branch backup-<branch>-<timestamp>` เพื่อสร้าง backup
2. ทำ `git branch -a` เพื่อยืนยันว่า backup branch ถูกสร้าง
3. บันทึกชื่อ backup branch สำหรับ rollback ถ้าจำเป็น
4. ทำ `git reflog` เพื่อยืนยันว่า reflog มีข้อมูลสำหรับ recovery

### 4. Choose Rebase Mode

เลือก rebase mode ตามความต้องการ

1. ถ้าต้อง break down commits หรือ edit commit messages ใช้ Interactive Rebase (step 5)
2. ถ้าต้อง rebase ไปยัง upstream โดยอัตโนมัติ ใช้ Non-Interactive Rebase (step 6)
3. ถ้าต้อง squash commits ด้วย fixup ใช้ Autosquash (step 7)

### 5. Interactive Rebase

เริ่ม interactive rebase สำหรับ break down หรือ edit commits

1. ทำ `git rebase -i HEAD~N` (N = จำนวน commits ที่ต้อง refactor) หรือ `git rebase -i <commit-hash>`
2. แก้ไข rebase todo list:
   - เปลี่ยน `pick` เป็น `edit` สำหรับ commit ที่ต้อง break down
   - เปลี่ยน `pick` เป็น `reword` สำหรับ commit ที่ต้อง edit message
   - เปลี่ยน `pick` เป็น `squash` สำหรับ commit ที่ต้องรวม
   - ลำดับ commits ใหม่ถ้าต้องการ reorder
3. Save และ close editor

### 6. Non-Interactive Rebase

เริ่ม non-interactive rebase สำหรับ rebase ไปยัง upstream โดยอัตโนมัติ

1. ทำ `git rebase <upstream>` เพื่อ rebase commits ไปยัง upstream
2. ทำ `git rebase --onto <new-base> <upstream>` เพื่อ rebase ไปยัง base ใหม่
3. ถ้าเกิด conflicts, แก้ไขและทำ `git rebase --continue`
4. ถ้าต้องการ skip commit ปัจจุบัน, ทำ `git rebase --skip`
5. ถ้าต้องการ abort, ทำ `git rebase --abort` และ restore จาก backup branch

### 7. Autosquash Rebase

ใช้ fixup commits และ autosquash สำหรับการจัดการ commits ที่ซับซ้อน

1. สร้าง fixup commits: `git commit --fixup <commit-hash>` สำหรับแต่ละ fix
2. ทำ `git rebase -i --autosquash HEAD~N` เพื่อให้ Git จัดเรียง fixup commits อัตโนมัติ
3. Git จะเตรียม rebase todo list ให้โดยเรียง fixup commits ไว้หลัง target commits
4. Save และ close editor

### 8. Break Down Commits

Break down commit ขนาดใหญ่เป็น commits ย่อยๆ

1. เมื่อ rebase หยุดที่ commit ที่มี `edit`, ทำ `git reset HEAD~` เพื่อ unstage ทุกอย่าง
2. ทำ `git status` เพื่อดู files ที่ถูก unstage
3. Stage และ commit แยกเป็น commits ย่อยๆ ตามที่ต้องการ:
   - `git add <file>` และ `git commit -m "message"` สำหรับแต่ละ commit
4. ทำ `git rebase --continue` เมื่อ break down เสร็จ

### 9. Validate Refactor

ตรวจสอบว่า refactor สำเร็จ

1. ทำ `git log --oneline -10` เพื่อดู commits ใหม่
2. ทำ `git status` เพื่อยืนยันว่าไม่มี conflicts
3. ทำ `git diff backup-branch HEAD` เพื่อดู changes ที่เกิดขึ้น
4. รัน tests ถ้ามีเพื่อยืนยันว่าไม่มี regression

### 10. Handle Conflicts

แก้ไข conflicts ถ้าเกิดขึ้น

1. ถ้ามี conflicts, ทำ `git status` เพื่อดู files ที่มี conflicts
2. แก้ไข conflicts ใน files ที่มีปัญหา
3. ทำ `git add <file>` สำหรับ files ที่แก้ไขแล้ว
4. ทำ `git rebase --continue` เพื่อดำเนินการต่อ
5. ถ้าต้องการ abort, ทำ `git rebase --abort` และ restore จาก backup branch
6. ใช้ `git reflog` เพื่อดู history และ recover ถ้าจำเป็น

## Rules

### 1. Safety

- สร้าง backup branch ก่อน refactor เสมอ
- ไม่ refactor commits ที่ถูก push ไป remote แล้ว ถ้าไม่จำเป็น
- ถ้าต้อง force push หลัง refactor, ต้องแจ้ง team members ก่อน
- ใช้ `git rebase --abort` ถ้าเกิดปัญหาและ restore จาก backup

### 2. Commit Quality

- Break down commits ตาม logical changes (ไม่ใหญ่เกินไป)
- ใช้ commit messages ที่ชัดเจนและเป็นไปตาม conventional commits
- แต่ละ commit ควรเป็น self-contained และ buildable
- ไม่รวม unrelated changes ใน commit เดียวกัน
- ใช้ `fixup` และ `autosquash` สำหรับการจัดการ commits ที่ซับซ้อน
- ใช้ `git commit --amend` เฉพาะกรณีที่ commit ล่าสุดยังไม่ได้ push

### 3. Submodules

- ถ้ามี submodules, ต้อง refactor commits ใน submodules ด้วย
- ใช้ `git submodule foreach --recursive` สำหรับ operations ทั้งหมด
- ตรวจสอบว่า submodules sync กับ parent repository

### 4. Verification

- ตรวจสอบว่า refactor สำเร็จจริง
- รัน tests ถ้ามีเพื่อยืนยันว่าไม่มี regression
- ตรวจสอบว่าไม่มี conflicts หรือ errors
- ยืนยันว่า commits ใหม่มีความถูกต้อง
- ใช้ `git diff --stat` เพื่อดูสรุป changes
- ตรวจสอบว่าไม่มี files ที่ถูกลบโดยไม่ตั้งใจ

## Expected Outcome

- Commits ถูก refactor ให้เหมาะสม (break down, edit, reorganize)
- Commit history สะอาดและเป็นไปตาม best practices
- ไม่มี conflicts หรือ errors หลัง refactor
- Tests ผ่านทั้งหมด (ถ้ามี)
- Backup branch พร้อมสำหรับ rollback ถ้าจำเป็น

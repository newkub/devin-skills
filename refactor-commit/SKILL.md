---
name: refactor-commit
description: Refactor commits ด้วย rebase (break down, edit, squash, fixup, autosquash, force push, rollback)
related:
  - update-references
  - resolve-merge-conflicts
  - ask-me
---

## Goal

Refactor commits ที่ commit ไปแล้วเพื่อ break down, edit, reorganize, squash, fixup และ rollback ให้เหมาะสม

## Scope

ใช้สำหรับแก้ไข commits ที่ commit ไปแล้วด้วย `git rebase` (interactive หรือ non-interactive) เพื่อ:
- Break down commit ขนาดใหญ่เป็น commits ย่อยๆ
- Edit commit messages ตาม conventional commits
- Reorder commits ตาม logical order
- Squash commits หลายตัวเป็นตัวเดียว
- Fix commits ที่ผิดพลาดด้วย fixup และ autosquash
- Move commits ระหว่าง branches ด้วย cherry-pick
- Rebase commits ไปยัง upstream โดยอัตโนมัติ (non-interactive)
- Force push และ rollback หลัง refactor

## Execute

### 1. Check Status

> Goal: Check Status

ตรวจสอบสถานะก่อน refactor

1. ทำ `git branch --show-current` เพื่อดู current branch
2. ทำ `git status` เพื่อดูว่าไม่มี uncommitted changes
3. ทำ `git log --oneline -10` เพื่อดู commits ล่าสุด
4. ทำ `git log --oneline origin/<branch>..HEAD` เพื่อดู commits ที่ยังไม่ได้ push

### 2. Check Shared Status

> Goal: Check Shared Status

ตรวจสอบว่า branch ไม่ได้ถูก shared กับทีม

1. ทำ `git branch -r` เพื่อดู remote branches
2. ทำ `git log --oneline origin/<branch>..HEAD` เพื่อดู commits ที่ยังไม่ได้ push
3. ถ้ามี commits ที่ถูก push ไปแล้ว, แจ้งเตือนผู้ใช้เกี่ยวกับความเสี่ยงของ force push
4. แนะนำให้ใช้ branch ส่วนตัวสำหรับ refactor

### 3. Backup Branch

> Goal: Backup Branch

สร้าง backup branch ก่อน refactor

1. ทำ `git branch backup-<branch>-<timestamp>` เพื่อสร้าง backup
2. ทำ `git branch -a` เพื่อยืนยันว่า backup branch ถูกสร้าง
3. บันทึกชื่อ backup branch สำหรับ rollback ถ้าจำเป็น
4. ทำ `git reflog` เพื่อยืนยันว่า reflog มีข้อมูลสำหรับ recovery

### 4. Choose Rebase Mode

> Goal: Choose Rebase Mode

เลือก rebase mode ตามความต้องการ

1. ถ้าต้อง break down commits หรือ edit commit messages ใช้ Interactive Rebase (step 5)
2. ถ้าต้อง rebase ไปยัง upstream โดยอัตโนมัติ ใช้ Non-Interactive Rebase (step 6)
3. ถ้าต้อง squash commits ด้วย fixup ใช้ Autosquash (step 7)

### 5. Execute Rebase

> Goal: Execute rebase ตาม mode ที่เลือก (interactive, non-interactive, หรือ autosquash)

1. Interactive: ทำ `git rebase -i HEAD~N` หรือ `git rebase -i <commit-hash>` แล้วแก้ไข rebase todo list:
   - เปลี่ยน `pick` เป็น `edit` สำหรับ commit ที่ต้อง break down
   - เปลี่ยน `pick` เป็น `reword` สำหรับ commit ที่ต้อง edit message
   - เปลี่ยน `pick` เป็น `squash` สำหรับ commit ที่ต้องรวม
   - ลำดับ commits ใหม่ถ้าต้องการ reorder
2. Non-interactive: ทำ `git rebase <upstream>` หรือ `git rebase --onto <new-base> <upstream>`
3. Autosquash: สร้าง fixup commits ด้วย `git commit --fixup <commit-hash>` แล้วทำ `git rebase -i --autosquash HEAD~N`
4. ถ้าเกิด conflicts → แก้ไขและทำ `git rebase --continue`
5. ถ้าต้องการ skip commit → ทำ `git rebase --skip`
6. ถ้าต้องการ abort → ทำ `git rebase --abort` และ restore จาก backup branch
7. Save และ close editor

### 6. Break Down Commits

> Goal: Break Down Commits

Break down commit ขนาดใหญ่เป็น commits ย่อยๆ

1. เมื่อ rebase หยุดที่ commit ที่มี `edit`, ทำ `git reset HEAD~` เพื่อ unstage ทุกอย่าง
2. ทำ `git status` เพื่อดู files ที่ถูก unstage
3. Stage และ commit แยกเป็น commits ย่อยๆ ตามที่ต้องการ:
   - `git add <file>` และ `git commit -m "message"` สำหรับแต่ละ commit
4. ทำ `git rebase --continue` เมื่อ break down เสร็จ

#### 8.2 Validate Refactor

> Goal: Validate Refactor

ตรวจสอบว่า refactor สำเร็จ

1. ทำ `git log --oneline -10` เพื่อดู commits ใหม่
2. ทำ `git status` เพื่อยืนยันว่าไม่มี conflicts
3. ทำ `git diff backup-branch HEAD` เพื่อดู changes ที่เกิดขึ้น
4. รัน tests ถ้ามีเพื่อยืนยันว่าไม่มี regression

### 7. Handle Conflicts

> Goal: Handle Conflicts

แก้ไข conflicts ถ้าเกิดขึ้น

1. ถ้ามี conflicts, ทำ `git status` เพื่อดู files ที่มี conflicts
2. แก้ไข conflicts ใน files ที่มีปัญหา
3. ทำ `git add <file>` สำหรับ files ที่แก้ไขแล้ว
4. ทำ `git rebase --continue` เพื่อดำเนินการต่อ
5. ถ้าต้องการ abort, ทำ `git rebase --abort` และ restore จาก backup branch
6. ใช้ `git reflog` เพื่อดู history และ recover ถ้าจำเป็น

#### 9.2 Force Push

> Goal: Force Push

Push commits ที่ refactor แล้วไปยัง remote อย่างปลอดภัย

1. ตรวจสอบว่าจำเป็นต้อง force push จริงๆ (commits ถูก rewrite แล้ว)
2. ตรวจสอบว่าไม่มีคนอื่นดึง commits เดิมไปใช้แล้ว
3. ใช้ `git push --force-with-lease` เพื่อความปลอดภัยกว่า `--force`
4. แจ้งทีมให้ทราบก่อนทำ force push

### 8. Rollback

> Goal: Rollback

ย้อนกลับสู่สถานะก่อน refactor ถ้าจำเป็น

1. ใช้ `git reflog` เพื่อดูประวัติการทำงาน
2. ใช้ `git reset --hard backup-<branch>-<timestamp>` เพื่อย้อนกลับสู่ backup
3. หรือใช้ `git reset --hard HEAD@{1}` เพื่อย้อนกลับสู่สถานะก่อน rebase
4. ลบ backup branch ด้วย `git branch -D backup-<branch>-<timestamp>` เมื่อตรวจสอบแล้วถูกต้อง

#### 10.2 Update References

> Goal: Update References

อัปเดท references ทั้งหมดที่เกี่ยวข้อง

1. ทำตาม `@[/update-references]`

### 9. Quick Amend Or Rename

> Goal: แก้ไข message ของ commit ล่าสุดหรือ commit ก่อนหน้าอย่างรวดเร็ว

1. ถ้า commit ล่าสุดยังไม่ push → รัน `git commit --amend --message="<new-message>"`
2. ถ้าต้องแก้ message ของ commit ก่อนหน้า → หา N จาก `git log --oneline` แล้ว `git rebase -i HEAD~N`
3. เปลี่ยน `pick` เป็น `reword` สำหรับ target commit แล้วบันทึก
4. ถ้า rebase มี conflict → ใช้ `/resolve-merge-conflicts`
5. ตรวจสอบด้วย `git log --oneline -n 10`

### 10. Check And Rewrite Non-English Commit Messages

> Goal: ตรวจสอบและแก้ไข commit messages ที่ไม่ใช่ภาษาอังกฤษ

1. รัน `git log --oneline` เพื่อดู commit messages ทั้งหมด
2. ระบุ commits ที่มีตัวอักษรหรือคำภาษาอื่น (เช่น ภาษาไทย)
3. ถ้าพบ → ใช้ `git rebase -i HEAD~N` แล้วเปลี่ยน `pick` เป็น `reword` สำหรับ commits นั้น
4. แปลง messages เป้นภาษาอังกฤษทีมีความหมายเดียวกัน โดยใช้ imperative mood และ conventional commits
5. ถ้าไม่แน่ใจในการแปล → หยุดและใช้ `/ask-me` ก่อน reword
6. ตรวจสอบด้วย `git log --oneline -n 10` ว่า messages ทั้งหมดเป็นภาษาอังกฤษ

## Rules

### 1. Safety

- สร้าง backup branch ก่อน refactor เสมอ
- ไม่ refactor commits ที่ถูก push ไป remote แล้ว ถ้าไม่จำเป็น
- ถ้าต้อง force push หลัง refactor, ต้องแจ้ง team members ก่อน
- ใช้ `--force-with-lease` แทน `--force` เสมอ
- ใช้ `git rebase --abort` ถ้าเกิดปัญหาและ restore จาก backup

### 2. Commit Quality

- Break down commits ตาม logical changes (ไม่ใหญ่เกินไป)
- ใช้ commit messages ที่ชัดเจน เป็นไปตาม conventional commits และเป็นภาษาอังกฤษ
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

### 5. Language

- Commit messages ทั้งหมดต้องเป็นภาษาอังกฤษ
- ถ้าพบข้อความภาษาอื่นใน git history ให้ reword เป้นภาษาอังกฤษ
- รักษาความหมายและ context เดิมเมื่อแปล
- ถ้า commit ถูก push ไปแล้ว ให้ทำตาม Rules ส่วน Safety ก่อน reword

## Expected Outcome

- Commits ถูก refactor ให้เหมาะสม (break down, edit, reorganize, squash, fixup)
- Commit messages ทั้งหมดเป็นภาษาอังกฤษ
- Commit history สะอาดและเป็นไปตาม best practices
- ไม่มี conflicts หรือ errors หลัง refactor
- Tests ผ่านทั้งหมด (ถ้ามี)
- Force push สำเร็จด้วย `--force-with-lease` (ถ้าจำเป็น)
- Backup branch พร้อมสำหรับ rollback ถ้าจำเป็น
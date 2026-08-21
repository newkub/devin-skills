---
name: git-merge-commit
description: รวม commits หลายตัวเป็น commit เดียวด้วย git rebase
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

## Goal

รวม commits หลายตัวเป็น commit เดียวด้วย git rebase interactive เพื่อให้ git history สะอาด

## Scope

Use `git-merge-commit` for the specific tasks and workflows it covers

## Execute

## Execute

### 1. Prepare

1. ตรวจสอบ commits ที่ต้องการรวมด้วย `git log --oneline -n <n>`
2. ตรวจสอบว่า commits ยังไม่ถูก push ไป remote
3. สร้าง backup branch ด้วย `git branch backup-branch`
4. ตรวจสอบจำนวน commits ที่ต้องการรวม

### 2. Start Interactive Rebase

1. เริ่ม interactive rebase ด้วย `git rebase -i HEAD~<n>`
2. หรือใช้ `git rebase -i <commit-hash>` โดย commit-hash คือ parent ของ commit แรก
3. editor จะเปิดขึ้นมาแสดงรายการ commits

### 3. Choose Merge Method

1. `pick` - ใช้ commit นี้เป็น commit หลัก
2. `squash` - รวม commit นี้เข้ากับ commit ก่อนหน้า (แก้ message ได้)
3. `fixup` - รวม commit นี้เข้ากับ commit ก่อนหน้า (ไม่แก้ message)

### 4. Squash Commits

1. เก็บ `pick` สำหรับ commit แรกที่ต้องการเป็น commit หลัก
2. เปลี่ยน `pick` เป็น `squash` สำหรับ commits ที่ต้องการรวม
3. บันทึกและปิด editor
4. แก้ commit message ให้เป็น commit message เดียวตาม conventional commit
5. บันทึกและปิด editor

### 5. Fixup Commits

1. เก็บ `pick` สำหรับ commit แรกที่ต้องการเป็น commit หลัก
2. เปลี่ยน `pick` เป็น `fixup` สำหรับ commits ที่ต้องการรวม
3. บันทึกและปิด editor
4. commit message จะใช้จาก commit หลัก

### 6. Auto-Squash

1. สร้าง fixup commits ด้วย `git commit --fixup <commit-hash>`
2. รวม fixup commits อัตโนมัติด้วย `git rebase -i --autosquash HEAD~<n>`
3. fixup commits จะถูกจัดเรียงอัตโนมัติให้อยู่ใต้ commit หลัก

### 7. Handle Conflicts

1. ใช้ `git status` เพื่อดูไฟล์ที่มี conflict
2. เปิดไฟล์ที่มี conflict และแก้ไข
3. ใช้ `git add <file>` เพื่อ staging ไฟล์ที่แก้แล้ว
4. ใช้ `git rebase --continue` เพื่อดำเนินการ rebase ต่อ
5. หรือใช้ `git rebase --abort` เพื่อยกเลิก rebase

### 8. Verify Results

1. ใช้ `git log --oneline` เพื่อดู commits ที่รวมแล้ว
2. ใช้ `git log --stat` เพื่อดูไฟล์ที่ถูกรวม
3. ใช้ `git status` เพื่อตรวจสอบว่าไม่มี changes ค้าง
4. ใช้ `git diff backup-branch` เพื่อดูความแตกต่าง

### 9. Force Push

1. ตรวจสอบว่าจำเป็นต้อง force push จริงๆ
2. ตรวจสอบว่าไม่มีคนอื่นดึง commits ไปใช้แล้ว
3. ใช้ `git push --force-with-lease` เพื่อความปลอดภัยกว่า
4. แจ้งทีมให้ทราบก่อนทำ force push

### 10. Rollback

1. ใช้ `git reflog` เพื่อดูประวัติการทำงาน
2. ใช้ `git reset backup-branch` เพื่อย้อนกลับสู่ backup
3. หรือใช้ `git reset HEAD@{1}` เพื่อย้อนกลับสู่สถานะก่อน rebase
4. ใช้ `git branch -D backup-branch` เมื่อตรวจสอบแล้วถูกต้อง

### 11. Update References

อัปเดท references ทั้งหมดที่เกี่ยวข้อง

1. ทำตาม `@[/update-reference]`

## Rules

## Rules

1. สร้าง backup branch เสมอก่อนทำ rebase
2. ตรวจสอบว่า commits ยังไม่ถูก push ไป remote
3. ใช้ `force-with-lease` แทน `force` เสมอ
4. แจ้งทีมก่อนทำ force push
5. ใช้ conventional commit format สำหรับ commit message
6. ตรวจสอบผลลัพธ์หลังรวมเสร็จเสมอ

## Expected Outcome

## Expected Outcome

- Commits หลายตัวรวมเป็น commit เดียว
- Git history สะอาดและอ่านง่าย
- Commit message ตาม conventional commits
- ไม่มี data loss จากการ rebase
- Backup branch พร้อมสำหรับ rollback

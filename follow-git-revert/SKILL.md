---
name: follow-git-revert
description: revert commits โดยสร้าง commit ใหม่ที่ย้อนการเปลี่ยนแปลง โดยไม่ rewrite history
---

## Goal

ใช้ git revert เพื่อย้อนการเปลี่ยนแปลงของ commit โดยสร้าง commit ใหม่ ไม่ rewrite history

## Scope

ครอบคลุม revert operations: single, multiple, range และ conflict resolution

## Execute

### 1. Prepare Revert

1. ตรวจสอบ working tree clean ด้วย `git status`
2. ระบุ commit hash ที่ต้องการ revert ด้วย `git log`
3. ตรวจสอบว่า commit ไม่ใช่ merge commit (ถ้าเป็น merge commit ต้องใช้ `-m` flag)
4. อ่าน commit message และ changes ของ commit นั้น

### 2. Revert Single Commit

1. รัน `git revert <commit-hash>` เพื่อ revert commit
2. Git จะสร้าง commit ใหม่ที่ย้อนการเปลี่ยนแปลง
3. แก้ไข commit message ถ้าจำเป็น (default: `Revert: <original message>`)
4. รัน `/run-verify` เพื่อตรวจสอบว่า code ทำงานได้

### 3. Revert Multiple Commits

1. รัน `git revert <hash1> <hash2>` เพื่อ revert หลาย commits
2. รัน `git revert <start-hash>..<end-hash>` เพื่อ revert range
3. ใช้ `--no-commit` เพื่อ stage changes โดยไม่ commit อัตโนมัติ
4. ทำ `/git-commit` หลังจากตรวจสอบ changes

### 4. Revert Merge Commit

1. รัน `git revert -m 1 <merge-commit-hash>` เพื่อ revert merge commit
2. `-m 1` ระบุ parent หลัก (mainline) ที่ต้องการกลับไป
3. ตรวจสอบว่า revert ไม่ทำลาย commits ที่มาหลัง merge
4. ทำ `/run-verify` เพื่อตรวจสอบ

### 5. Resolve Conflicts

1. ถ้ามี conflicts ให้แก้ไขไฟล์ที่มี conflict markers
2. รัน `git add <file>` หลังแก้ไข
3. รัน `git revert --continue` เพื่อดำเนินการต่อ
4. รัน `git revert --abort` เพื่อยกเลิก

## Rules

### 1. Revert Over Reset

- ใช้ `git revert` แทน `git reset --hard` เมื่อ commit ถูก push ไปแล้ว
- Revert สร้าง commit ใหม่ ไม่ rewrite history
- ใช้ `git reset` เฉพาะเมื่อ commit ยังไม่ได้ push
- Revert ปลอดภัยสำหรับ shared branches

### 2. Revert Discipline

- ใช้ revert เฉพาะเมื่อจำเป็น ไม่ใช่ทุกครั้งที่ code ไม่ทำงาน
- วิเคราะห์ root cause ก่อน revert ว่า commit ไหนที่ทำให้เกิดปัญหา
- ถ้าต้อง revert หลาย commits ให้พิจารณา revert range
- ตรวจสอบว่า revert ไม่ทำลาย dependent changes

### 3. Message Quality

- ใช้ message format: `revert: <original-type>(<scope>): <original-description>`
- ระบุเหตุผลในการ revert ใน commit body
- ถ้า revert เพราะ bug ให้อ้างอิง issue number

### 4. Non-Redundancy

- รายละเอียด rebase อยู่ใน `/follow-git-rebase` แล้ว
- รายละเอียด commit อยู่ใน `/git-commit` แล้ว

## Expected Outcome

- Commits ถูก revert โดยไม่ rewrite history
- ไม่มี conflicts ค้างใน code
- Shared branches ปลอดภัยจาก force push

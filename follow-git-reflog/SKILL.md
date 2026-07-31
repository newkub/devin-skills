---
name: follow-git-reflog
description: จัดการ git reflog สำหรับกู้คืน commits และดูประวัติ HEAD movements
---

## Goal

ใช้ git reflog เพื่อกู้คืน commits ที่หายไป และดูประวัติการเปลี่ยนแปลงของ HEAD

## Scope

ครอบคลุม reflog operations: view, recover, expire และ manage

## Execute

### 1. View Reflog

1. รัน `git reflog` เพื่อดูประวัติ HEAD movements
2. รัน `git reflog --relative-date` เพื่อดูพร้อมวันที่ที่อ่านง่าย
3. รัน `git reflog show <branch>` เพื่อดู reflog ของ branch เฉพาะ
4. ระบุ commit hash ที่ต้องการกู้คืน

### 2. Recover Commits

1. ระบุ commit hash จาก reflog ที่ต้องการกู้คืน
2. รัน `git cherry-pick <commit-hash>` เพื่อนำ commit มายัง branch ปัจจุบัน
3. หรือรัน `git reset --hard <commit-hash>` เพื่อย้าย HEAD ไปยัง commit นั้น
4. ตรวจสอบว่า commit ถูกกู้คืนแล้วด้วย `git log`

### 3. Recover Deleted Branch

1. รัน `git reflog` เพื่อหา commit ล่าสุดของ branch ที่ถูกลบ
2. รัน `git branch <branch-name> <commit-hash>` เพื่อสร้าง branch ใหม่ที่ commit นั้น
3. ตรวจสอบว่า branch ถูกสร้างด้วย `git branch -a`
4. ทำ `/git-commit` ถ้าจำเป็น

### 4. Expire Old Reflog

1. รัน `git reflog expire --expire=30.days` เพื่อลบ reflog entries เก่ากว่า 30 วัน
2. รัน `git reflog expire --expire-unreachable=30.days` เพื่อลบ unreachable entries
3. รัน `git gc --prune=now` เพื่อลบ unreachable objects
4. ทำ `/follow-git-cleanup` เพื่อ cleanup repository

### 5. Verify Recovery

1. รัน `git log --oneline` เพื่อตรวจสอบ commit history
2. รัน `git status` เพื่อตรวจสอบ working tree
3. ทำ `/run-verify` เพื่อตรวจสอบว่า code ทำงานได้

## Rules

### 1. Reflog Retention

- Reflog เก็บประวัติไว้ default 90 วัน สำหรับ reachable commits
- Reflog เก็บประวัติไว้ default 30 วัน สำหรับ unreachable commits
- ห้าม expire reflog โดยไม่จำเป็น เพราะอาจทำให้กู้คืน commits ไม่ได้
- ใช้ `--dry-run` เพื่อดู entries ที่จะถูก expire ก่อนลบจริง

### 2. Recovery Safety

- ใช้ `git cherry-pick` แทน `git reset --hard` เมื่อต้องการเก็บ current state
- ตรวจสอบ commit hash ให้ถูกต้องก่อน recovery
- ทดสอบว่า code ทำงานได้หลัง recovery
- ใช้ `git reflog` ทันทีเมื่อพบว่า commit หายไป

### 3. Cleanup Discipline

- อย่า expire reflog บ่อยเกินไป
- ทำ `/follow-git-cleanup` หลัง expire reflog
- ตรวจสอบว่าไม่มี commits ที่จำเป็นจะหายไป
- ใช้ `--expire-unreachable` อย่างระมัดระวัง

### 4. Non-Redundancy

- รายละเอียด cleanup อยู่ใน `/follow-git-cleanup` แล้ว
- รายละเอียด cherry-pick อยู่ใน `/follow-git-cherry-pick` แล้ว

## Expected Outcome

- Commits ที่หายไปถูกกู้คืนได้
- ทราบประวัติการเปลี่ยนแปลงของ HEAD
- ไม่มีการ expire reflog ที่ไม่จำเป็น
- Repository สะอาดหลัง cleanup

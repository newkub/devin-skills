---
name: git-restore-file
description: กู้คืนไฟล์จาก git history โดยเริ่มจาก commit ล่าสุดและเดินกลับจนพบ
---

## Goal

กู้คืนไฟล์ที่ถูกลบหรือแก้ไข โดยดูจาก commit ล่าสุดก่อน ถ้าไม่พบให้เดินกลับไปใน `git log` จนกว่าจะพบไฟล์ที่ต้องการ

## Scope

ใช้สำหรับ restore ไฟล์จาก commit ในประวัติ git โดยเริ่มจาก commit ล่าสุดและเดินกลับทีละ commit
ไม่ใช้สำหรับ restore จาก stash หรือ reflog — ใช้ `/follow-git` หรือ `/follow-git` แทน

## Execute

### 1. Identify Target Files

> Goal: ระบุไฟล์ที่ต้องการ restore จาก context หรือถามผู้ใช้

1. ระบุไฟล์ที่ต้องการ restore จาก context
2. ถ้า context ไม่ชัด → ถามผู้ใช้ด้วย `/ask-me`
3. ถ้าผู้ใช้ไม่ตอบ → stop

### 2. Check Latest Commit

> Goal: ดู commit ล่าสุดว่ามีไฟล์ที่ต้องการหรือไม่

1. รัน `git log -1 --name-status` เพื่อดูไฟล์ที่เปลี่ยนแปลงใน commit ล่าสุด
2. รัน `git show HEAD:<file-path>` เพื่อตรวจสอบว่าไฟล์มีอยู่ใน commit ล่าสุดหรือไม่
3. ถ้าพบไฟล์ → ไป Step 4 Restore Files
4. ถ้าไม่พบ → ไป Step 3 Walk Back Through Log

### 3. Walk Back Through Log

> Goal: เดินกลับไปใน git log ทีละ commit จนกว่าจะพบไฟล์ที่ต้องการ

1. รัน `git log --oneline --all -- <file-path>` เพื่อดู commits ที่แก้ไฟล์เป้าหมาย
2. ถ้าไม่พบ commit ใด → ไฟล์อาจไม่เคยอยู่ใน git → stop และ report
3. ระบุ commit hash ล่าสุดที่มีไฟล์เป้าหมาย
4. รัน `git show <commit-hash>:<file-path>` เพื่อยืนยันว่าไฟล์มีอยู่ใน commit นั้น

### 4. Restore Files

> Goal: กู้คืนไฟล์จาก commit ที่พบ

1. รัน `git restore --source=<commit-hash> <file-path>` เพื่อ restore ไฟล์จาก commit ที่พบ
2. ถ้า restore หลายไฟล์ → รัน `git restore --source=<commit-hash> <file-1> <file-2> ...`
3. ตรวจสอบด้วย `git status` ว่าไฟล์ถูก restore แล้ว

### 5. Verify Restoration

> Goal: ตรวจสอบความถูกต้องของไฟล์ที่ restore

1. รัน `git diff <file-path>` เพื่อดูสิ่งที่เปลี่ยนแปลงหลัง restore
2. ตรวจสอบเนื้อหาไฟล์ว่าถูกต้อง
3. รัน `git status` เพื่อยืนยันสถานะของ working directory

## Rules

### Restore Strategy
> Goal: restore ไฟล์อย่างปลอดภัย ไม่ทำลาย working directory

- ใช้ `git restore --source=<commit-hash>` เสมอ ไม่ใช้ `git checkout <commit-hash> -- <file>` เพราะ restore สามารถยกเลิกได้ง่ายกว่า
- ถ้าไฟล์มีการเปลี่ยนแปลงใน working directory → ถามผู้ใช้ก่อน restore เพื่อยืนยัน
- ไม่ใช้ `git reset --hard` เพราะเป็น destructive action

### Walk Back Strategy
> Goal: เดินกลับใน git log อย่างมีประสิทธิภาพ

- ใช้ `git log -- <file-path>` เพื่อกรองเฉพาะ commits ที่แก้ไฟล์เป้าหมาย ไม่ต้องเดินทุก commit
- ถ้าไฟล์ถูกลบ → ใช้ `git log --diff-filter=D -- <file-path>` เพื่อหา commit ที่ลบไฟล์
- ระบุ commit hash ที่ชัดเจนก่อน restore เสมอ

## Expected Outcome

1. ไฟล์ที่ต้องการถูก restore กลับไปยัง working directory
2. ไฟล์มาจาก commit ที่ใกล้ที่สุดที่มีไฟล์นั้น
3. Working directory มีการเปลี่ยนแปลงที่สามารถตรวจสอบได้ด้วย `git status`
4. ผู้ใช้สามารถ commit ไฟล์ที่ restore ได้ด้วย `/git-commit`

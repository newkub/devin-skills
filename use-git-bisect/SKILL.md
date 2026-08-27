---
name: use-git-bisect
description: ใช้ git bisect หา commit แรกทีทำให้เกิด bug ด้วย binary search บน local หรือ remote repo
related:
  - git-debug
  - check-git-files-history
---

## Goal

ใช้ `git bisect` เพื่อหา commit แรกทีทำให้เกิด bug ด้วย binary search รองรับทั้ง local repo และ remote repo ที clone มาทดสอบ

## Scope

- ระบุ good commit และ bad commit
- ตั้งค่า bisect range
- รันคำสั่งทดสอบเพื่อตัดสิน good/bad
- หา commit แรกทีทำให้เกิด bug
- reset bisect state หลังเสร็จ

## Execute

### 1. Prepare

> Goal: ตรวจสอบ repo และสภาพ

1. ถ้าเป็น remote repo → clone ไปยัง temp directory
2. รัน `git status` เพื่อตรวจ working tree
3. ถ้ามี uncommitted changes → ถาม user ว่าจะ stash หรือไม่
4. สำรอง branch ปัจจุบันก่อนเริ่ม bisect

### 2. Identify Range

> Goal: กำหนด good commit และ bad commit

1. รับ bad commit จาก user (default `HEAD`)
2. รับ good commit จาก user (default หรือ tag)
3. รัน `git log --oneline <good>..<bad>` เพื่อดู commit ในช่วง
4. ถ้าไม่ชัดเจน → ทำ `/ask-me` ก่อนเริ่ม

### 3. Start Bisect

> Goal: เริ่ม bisect

1. รัน `git bisect start`
2. รัน `git bisect bad <bad>`
3. รัน `git bisect good <good>`
4. รัน `git bisect run <test-command>` ถ้ามี script ทดสอบอัตโนมัติ
5. ถ้าไม่มี script → ทำ manual bisect:
   - รัน `git bisect next` หรือตอบ `git bisect good`/`bad` ตามผลทดสอบ

### 4. Find Bad Commit

> Goal: ระบุ commit ทีทำให้เกิด bug

1. ถ้าใช้ `git bisect run` → รอผลและบันทึก commit hash
2. ถ้า manual → ทดสอบแต่ละ checkout จนกระทั่ง bisect จบ
3. รัน `git show <bad-commit>` เพื่อดู changes
4. บันทึก commit hash, author, date, message

### 5. Reset Bisect

> Goal: กลับสู่สภาพปกติ

1. รัน `git bisect reset`
2. คืนค่า branch เดิมถ้า detached HEAD
3. รัน `git status` ยืนยัน

### 6. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง: Good Commit, Bad Commit, First Bad Commit, Author, Date
2. แสดง diff ของ first bad commit
3. ทำ `/suggest-next-action` เช่น revert, fix, หรือ test

## Rules

### 1. Bisect Setup

- ต้องมี good commit ทีแน่ใจว่าไม่มี bug
- ต้องมี bad commit ทีแน่ใจว่ามี bug
- test command ต้อง return 0 ถ้า good, ค่าอื่น ถ้า bad

### 2. Safety

- สำรอง working tree ก่อน bisect
- ใช้ `git bisect reset` เสมอหลังเสร็จ
- ไม่ทำ `git reset --hard` ในระหว่าง bisect โดยไม่จำเป็น

### 3. Remote Repo

- ถ้า repo ไม่ได้ clone → clone ไปยัง `/create-files-in-temp` ก่อน
- ใช้ `git clone --depth=N` เฉพาะถ้า repo ใหญ่และ range ทราบแน่นอน

### 4. Integration

- ใช้ใน `/git-debug` เมื่อต้องหา commit ทีแรกทำให้เกิด bug
- ใช้ใน `/deep-debug` เมื่อต้อง tracing regression ใน code history

## Expected Outcome

- หา first bad commit ได้
- รู้ว่า commit ใดทำให้เกิด bug
- bisect state ถูก reset กลับปกติ
- รายงานพร้อมข้อเสนอแนะ

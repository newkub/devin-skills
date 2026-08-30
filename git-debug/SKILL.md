---
name: git-debug
description: Debug ปัญหาที่เกี่ยวกับ git โดยใช้ bisect, blame, reflog, log และ diff
related:
  - check-git-files-history
  - search-in-git
  - restore-from-git-log
  - deep-debug
  - ask-me
  - report-table
  - suggest-next-action
---

## Goal

หา root cause ของปัญหาที่เกี่ยวกับ git โดยใช้ git debugging tools (bisect, blame, reflog, log, diff) อย่างเป็นระบบ

## Scope

ใช้สำหรับ debug ปัญหาที่เกี่ยวกับ git เช่น หา commit ที่ทำให้เกิด bug, หาว่าใครเปลี่ยนบรรทัดไหน, กู้คืน commit ที่หายไป, หาสาเหตุของ conflict
ไม่ใช้สำหรับ debug runtime/code logic — ใช้ `/deep-debug` แทน

## Execute

### 1. Identify Git Problem

> Goal: ระบุปัญหา git ที่ต้อง debug

1. ระบุอาการของปัญหา: bug ที่เกิดหลัง commit ใด, ไฟล์หาย, commit หาย, conflict ไม่คาดคิด
2. จัดประเภทปัญหา:
   - bug introduced: หา commit ที่ทำให้เกิด bug → ไป Step 2
   - unexpected change: หาว่าใคร/เมื่อไหร่เปลี่ยน code → ไป Step 3
   - lost commit: กู้คืน commit ที่หายไป → ไป Step 4
   - lost file: กู้คืนไฟล์ที่หายไป → ไป Step 5
   - unknown cause: ไม่ทราบสาเหตุ → ไป Step 6

### 2. Find Bug Commit With Bisect

> Goal: ใช้ git bisect เพื่อหา commit ที่ทำให้เกิด bug ด้วย binary search

#### 2.1 Prepare

> Goal: ตรวจสอบ repo และสภาพ

1. ถ้าเป็น remote repo → clone ไปยัง temp directory
2. รัน `git status` เพื่อตรวจ working tree
3. ถ้ามี uncommitted changes → ถาม user ว่าจะ stash หรือไม่
4. สำรอง branch ปัจจุบันก่อนเริ่ม bisect

#### 2.2 Identify Range

> Goal: กำหนด good commit และ bad commit

1. รับ bad commit จาก user (default `HEAD`)
2. รับ good commit จาก user (default หรือ tag)
3. รัน `git log --oneline <good>..<bad>` เพื่อดู commit ในช่วง
4. ถ้าไม่ชัดเจน → ทำ `/ask-me` ก่อนเริ่ม

#### 2.3 Start Bisect

> Goal: เริ่ม bisect

1. รัน `git bisect start`
2. รัน `git bisect bad <bad>`
3. รัน `git bisect good <good>`
4. รัน `git bisect run <test-command>` ถ้ามี script ทดสอบอัตโนมัติ
5. ถ้าไม่มี script → ทำ manual bisect:
   - รัน `git bisect next` หรือตอบ `git bisect good`/`bad` ตามผลทดสอบ

#### 2.4 Find Bad Commit

> Goal: ระบุ commit ทีทำให้เกิด bug

1. ถ้าใช้ `git bisect run` → รอผลและบันทึก commit hash
2. ถ้า manual → ทดสอบแต่ละ checkout จนกระทั่ง bisect จบ
3. รัน `git show <bad-commit>` เพื่อดู changes
4. บันทึก commit hash, author, date, message

#### 2.5 Reset Bisect

> Goal: กลับสู่สภาพปกติ

1. รัน `git bisect reset`
2. คืนค่า branch เดิมถ้า detached HEAD
3. รัน `git status` ยืนยัน

#### 2.6 Report And Analyze

> Goal: สรุปผลและวิเคราะห์

1. ทำ `/report-table` แสดง: Good Commit, Bad Commit, First Bad Commit, Author, Date
2. แสดง diff ของ first bad commit
3. วิเคราะห์ว่า change ใดทีทำให้เกิด bug
4. ทำ `/suggest-next-action` เช่น revert, fix, หรือ test

### 3. Trace Change With Blame

> Goal: ใช้ git blame และ log เพื่อดูประวัติการเปลี่ยนแปลง

1. ทำ `/follow-tool-git` เพื่อดู blame ของไฟล์หรือบรรทัดที่สงสัย
2. รัน `git log -p --follow -S "<code-snippet>" -- <file-path>` เพื่อดู commit ที่เพิ่ม/ลบ code นั้น
3. ทำ `/check-git-files-history` เพื่อ trace ไฟล์ใน git log จนกว่าจะเจอเงื่อนไข หรือ `/git-file-history` ถ้าต้องการ UI viewer
4. วิเคราะห์เหตุผลของการเปลี่ยนแปลงจาก commit message และ diff

### 4. Recover Lost Commit With Reflog

> Goal: ใช้ git reflog เพื่อกู้คืน commit ที่หายไป

1. ทำ `/follow-tool-git` เพื่อดู reflog และหา commit ที่หาย
2. ระบุ commit hash ที่ต้องการกู้คืนจาก reflog
3. รัน `git cherry-pick <commit-hash>` เพื่อนำ commit กลับมา หรือ `git reset --hard <commit-hash>` ถ้าต้องการ reset HEAD
4. ตรวจสอบด้วย `git log --oneline -5` ว่า commit กลับมาแล้ว

### 5. Restore Lost File

> Goal: กู้คืนไฟล์ที่หายไปจาก commit ในประวัติ

1. ทำ `/restore-from-git-log` เพื่อกู้คืนไฟล์จาก commit ล่าสุดที่มีไฟล์นั้น
2. ถ้าไม่พบ → รัน `git log --all --diff-filter=D -- <file-path>` เพื่อหา commit ที่ลบไฟล์
3. รัน `git show <commit-hash>^:<file-path>` เพื่อดูเนื้อหาไฟล์ก่อนถูกลบ
4. รัน `git restore --source=<commit-hash>^ <file-path>` เพื่อ restore ไฟล์

### 6. Investigate Unknown Cause

> Goal: สำรวจปัญหาที่ไม่ทราบสาเหตุโดยใช้ git tools หลายตัว

1. รัน `git status` เพื่อดูสถานะ working directory
2. รัน `git log --oneline -20` เพื่อดู commits ล่าสุด
3. รัน `git diff HEAD~1` เพื่อดู changes ของ commit ล่าสุด
4. รัน `git stash list` เพื่อตรวจสอบ stashed changes ที่อาจเกี่ยวข้อง
5. ถ้ามี stash → รัน `git stash show -p stash@{n}` เพื่อดูเนื้อหา
6. ถ้ายังไม่พบสาเหตุ → ทำ `/deep-debug` เพื่อ debug แบบ general

### 7. Apply Fix

> Goal: แก้ไขปัญหาที่พบ

1. ถ้าพบ commit ที่ทำให้เกิด bug → ทำ `/follow-tool-git` เพื่อ revert commit นั้น
2. ถ้าไฟล์ถูก restore → ทำ `/git-commit` เพื่อ commit ไฟล์ที่ restore
3. ถ้า commit ถูกกู้คืน → ตรวจสอบว่า code ทำงานได้ก่อน push
4. ทำ `/update-test-everything` เพื่อสร้าง regression test สำหรับปัญหาที่พบ

## Rules

### Debug Strategy

> Goal: debug อย่างเป็นระบบ ไม่เดา

- เริ่มจากการระบุปัญหาให้ชัดเจนก่อนใช้ git tools
- ใช้ bisect เมื่อรู้ good commit และ bad commit ชัดเจน
- ใช้ blame เมื่อต้องการ trace การเปลี่ยนแปลงของบรรทัดเฉพาะ
- ใช้ reflog เมื่อ commit หายไปจาก branch ปัจจุบัน
- ถ้าไม่ทราบสาเหตุ → ใช้ Step 6 Investigate Unknown Cause

### Safety

> Goal: debug โดยไม่ทำลาย working directory

- สำรอง working directory ด้วย `git stash` ก่อน debug ถ้ามี uncommitted changes
- ไม่ใช้ `git reset --hard` โดยไม่จำเป็น — ใช้ `git restore` แทน
- ถ้าต้องใช้ `git reset --hard` → ยืนยันกับผู้ใช้ก่อนด้วย `/ask-me`
- หลัง debug → ตรวจสอบ `git status` ว่า working directory สะอาด

### Tool Selection

> Goal: เลือก git tool ที่เหมาะสมกับปัญหา

- bug introduced by commit → `git bisect`
- trace who changed what → `git blame` + `git log -S`
- lost commit → `git reflog`
- lost file → `git log --diff-filter=D` + `git restore`
- unknown cause → `git status` + `git log` + `git diff` + `git stash list`

## Expected Outcome

1. พบ root cause ของปัญหา git อย่างเป็นระบบ
2. commit ที่ทำให้เกิด bug ถูกระบุหรือ revert
3. ไฟล์หรือ commit ที่หายไปถูกกู้คืน
4. regression test สำหรับปัญหาที่พบ
5. working directory สะอาดหลัง debug
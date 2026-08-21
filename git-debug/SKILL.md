---
name: git-debug
description: Debug ปัญหาที่เกี่ยวกับ git โดยใช้ bisect, blame, reflog, log และ diff
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

หา root cause ของปัญหาที่เกี่ยวกับ git โดยใช้ git debugging tools (bisect, blame, reflog, log, diff) อย่างเป็นระบบ

## Scope

ใช้สำหรับ debug ปัญหาที่เกี่ยวกับ git เช่น หา commit ที่ทำให้เกิด bug, หาว่าใครเปลี่ยนบรรทัดไหน, กู้คืน commit ที่หายไป, หาสาเหตุของ conflict
ไม่ใช้สำหรับ debug runtime/code logic — ใช้ `/debug-issue` แทน

## Execute

### 1. Identify Git Problem

ระบุปัญหา git ที่ต้อง debug

> Goal: ทราบปัญหา git และประเภทของการ debug ที่ต้องการ

1. ระบุอาการของปัญหา: bug ที่เกิดหลัง commit ใด, ไฟล์หาย, commit หาย, conflict ไม่คาดคิด
2. จัดประเภทปัญหา:
   - bug introduced: หา commit ที่ทำให้เกิด bug → ไป Step 2
   - unexpected change: หาว่าใคร/เมื่อไหร่เปลี่ยน code → ไป Step 3
   - lost commit: กู้คืน commit ที่หายไป → ไป Step 4
   - lost file: กู้คืนไฟล์ที่หายไป → ไป Step 5
   - unknown cause: ไม่ทราบสาเหตุ → ไป Step 6

### 2. Find Bug Commit With Bisect

ใช้ git bisect เพื่อหา commit ที่ทำให้เกิด bug ด้วย binary search

> Goal: พบ commit ที่ทำให้เกิด bug พร้อมระบุ commit hash

1. ทำ `/follow-git` เพื่อรัน bisect workflow
2. ระบุ commit ล่าสุดที่รู้ว่า good และ commit แรกที่รู้ว่า bad
3. ให้ bisect หา commit ที่ทำให้เกิด bug อัตโนมัติ
4. บันทึก commit hash ที่พบ
5. รัน `git show <commit-hash>` เพื่อดู changes ของ commit นั้น
6. วิเคราะห์ว่า change ใดที่ทำให้เกิด bug

### 3. Trace Change With Blame

ใช้ git blame และ log เพื่อดูประวัติการเปลี่ยนแปลง

> Goal: ทราบใครเปลี่ยนบรรทัดใด เมื่อไหร่ และทำไม

1. ทำ `/follow-git` เพื่อดู blame ของไฟล์หรือบรรทัดที่สงสัย
2. รัน `git log -p --follow -S "<code-snippet>" -- <file-path>` เพื่อดู commit ที่เพิ่ม/ลบ code นั้น
3. ทำ `/git-file-history` เพื่อดู file history แบบ interactive
4. วิเคราะห์เหตุผลของการเปลี่ยนแปลงจาก commit message และ diff

### 4. Recover Lost Commit With Reflog

ใช้ git reflog เพื่อกู้คืน commit ที่หายไป

> Goal: กู้คืน commit ที่หายไปกลับมาได้

1. ทำ `/follow-git` เพื่อดู reflog และหา commit ที่หาย
2. ระบุ commit hash ที่ต้องการกู้คืนจาก reflog
3. รัน `git cherry-pick <commit-hash>` เพื่อนำ commit กลับมา หรือ `git reset --hard <commit-hash>` ถ้าต้องการ reset HEAD
4. ตรวจสอบด้วย `git log --oneline -5` ว่า commit กลับมาแล้ว

### 5. Restore Lost File

กู้คืนไฟล์ที่หายไปจาก commit ในประวัติ

> Goal: ไฟล์ที่หายไปถูก restore กลับมา

1. ทำ `/git-restore-file` เพื่อกู้คืนไฟล์จาก commit ล่าสุดที่มีไฟล์นั้น
2. ถ้าไม่พบ → รัน `git log --all --diff-filter=D -- <file-path>` เพื่อหา commit ที่ลบไฟล์
3. รัน `git show <commit-hash>^:<file-path>` เพื่อดูเนื้อหาไฟล์ก่อนถูกลบ
4. รัน `git restore --source=<commit-hash>^ <file-path>` เพื่อ restore ไฟล์

### 6. Investigate Unknown Cause

สำรวจปัญหาที่ไม่ทราบสาเหตุโดยใช้ git tools หลายตัว

> Goal: พบสาเหตุของปัญหาโดยใช้ git investigation tools

1. รัน `git status` เพื่อดูสถานะ working directory
2. รัน `git log --oneline -20` เพื่อดู commits ล่าสุด
3. รัน `git diff HEAD~1` เพื่อดู changes ของ commit ล่าสุด
4. รัน `git stash list` เพื่อตรวจสอบ stashed changes ที่อาจเกี่ยวข้อง
5. ถ้ามี stash → รัน `git stash show -p stash@{n}` เพื่อดูเนื้อหา
6. ถ้ายังไม่พบสาเหตุ → ทำ `/debug-issue` เพื่อ debug แบบ general

### 7. Apply Fix

แก้ไขปัญหาที่พบ

> Goal: ปัญหาถูกแก้ไขและป้องกันการเกิดซ้ำ

1. ถ้าพบ commit ที่ทำให้เกิด bug → ทำ `/follow-git` เพื่อ revert commit นั้น
2. ถ้าไฟล์ถูก restore → ทำ `/git-commit` เพื่อ commit ไฟล์ที่ restore
3. ถ้า commit ถูกกู้คืน → ตรวจสอบว่า code ทำงานได้ก่อน push
4. ทำ `/write-test` เพื่อสร้าง regression test สำหรับปัญหาที่พบ

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

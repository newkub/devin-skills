---
name: restore-from-my-dotfiles
description: กู้คืน dotfiles จาก git log ของ chezmoi repo แล้ว chezmoi apply
related:
  - restore-from-git-log
  - follow-tool-git
  - check-git-logs
  - git-debug
  - ask-me
  - report-table
  - git-commit
---

## Goal

กู้คืน dotfiles บนเครื่องจาก git log ของ chezmoi source repo แล้ว apply กลับไปยัง target path

## Scope

ใช้เมื่อ dotfiles บนเครื่องหายหรือเสียหาย และต้องการ restore จากประวัติของ dotfiles repo ทีจัดการด้วย chezmoi

## Execute

### 1. Locate Dotfiles Repo

> Goal: หา local chezmoi source repo

1. รัน `chezmoi source-path` เพื่อหา source directory
2. ถ้าไม่มี chezmoi → ลอง path ทั่วไป:
   - Windows: `$env:USERPROFILE\.local\share\chezmoi`
   - macOS/Linux: `~/.local/share/chezmoi`
3. ตรวจสอบว่าเป็น git repo ด้วย `git rev-parse --is-inside-work-tree`
4. ถ้าไม่ใช่ git repo → stop และ report

### 2. Identify Target Dotfile

> Goal: ระบุ dotfile ทีต้องการ restore

1. รับ target จาก argument (ชื่อไฟล์หรือ chezmoi target path)
2. ถ้าไม่มี → ทำ `/ask-me` ให้ user ระบุ
3. แปลง target เป็น chezmoi source path ด้วย `chezmoi source-path <target>`
4. ถ้าไม่พบ source path → แจ้งว่า target ไม่ถูกจัดการโดย chezmoi

### 3. Check Git Log

> Goal: ดูประวัติการเปลี่ยนแปลงของ target

1. รัน `git log --oneline -- <source-path>` ใน dotfiles repo
2. ถ้าไม่มีประวัติ → แจ้งว่าไฟล์ไม่เคยมีใน git
3. รัน `git log --diff-filter=D --oneline -- <source-path>` หากต้องการหา commit ทีลบไฟล์
4. แสดง 10 commit ล่าสุดพร้อม date และ message

### 4. Choose Commit

> Goal: เลือก commit ทีจะ restore

1. ถ้า user ระบุ commit hash → ใช้ hash นั้น
2. ถ้า user ระบุ keyword/date → ค้นหา commit ที match
3. ถ้าไม่ระบุ → ใช้ latest commit ทียังมีไฟล์
4. ยืนยันกับ user ก่อน restore ด้วย `/ask-me` หรือ `/suggest-next-action`

### 5. Backup Current State

> Goal: สำรองไฟล์ปัจจุบันก่อน overwrite

1. หา target path บนเครื่องด้วย `chezmoi target-path <source-path>`
2. สำรองด้วย `Copy-Item <target> <target>.<timestamp>.bak` หรือ `cp <target> <target>.<timestamp>.bak`
3. บันทึก backup path

### 6. Restore Source

> Goal: กู้คืน source file จาก commit

1. รัน `git restore --source=<commit> <source-path>` ใน dotfiles repo
2. ตรวจสอบ `git diff` ว่า source เปลี่ยนไปตามต้องการ
3. ถ้า restore หลายไฟล์ → ทำซ้ำต่อ file

### 7. Apply Dotfile

> Goal: apply กลับไปยังเครื่อง

1. รัน `chezmoi apply --dry-run <target>` เพื่อดูผลลัพธ์
2. ถ้า user ยืนยัน → รัน `chezmoi apply <target>`
3. ถ้าไม่มี chezmoi → คัดลอก source file ไปยัง target path ด้วย `Copy-Item`/`cp`
4. ตรวจสอบว่า target path มีเนื้อหาที่ restore แล้ว

### 8. Build Report

> Goal: สรุปผล

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Target
   - Source Path
   - Commit
   - Backup Path
   - Status
2. ระบุสรุปจำนวน files ที restore

## Rules

### 1. Safety

- ถาม user ก่อน overwrite ทุกครั้ง
- สำรองไฟล์ปัจจุบันก่อน apply
- ไม่ใช้ `git reset --hard`
- ใช้ `git restore --source=<commit>` เสมอ

### 2. Scope

- ใช้เฉพาะ dotfiles ที chezmoi จัดการ
- ถ้า dotfiles repo ไม่ใช่ chezmoi → ใช้ `git restore` แล้วคัดลอกเอง

### 3. Cross Platform

- Windows: ใช้ `chezmoi` หรือ `Copy-Item`
- macOS/Linux: ใช้ `chezmoi` หรือ `cp`

### 4. Verify

- ตรวจสอบ target file หลัง apply
- รัน `chezmoi diff <target>` ถ้า apply ไม่สมบูรณ์

## Expected Outcome

- Dotfile ถูก restore จาก git log ของ dotfiles repo
- Target path บนเครื่องมีเนื้อหาตาม commit ทีเลือก
- มี backup ของไฟล์เดิม
- รายงานผล restore ครบถ้วน

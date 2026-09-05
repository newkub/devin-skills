---
name: view-diff
description: แสดง git diff บน terminal พร้อม syntax highlighting และ file headers
argument-hint: "[ref-or-range]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
triggers:
  - user
  - model
related:
  - view-files
  - check-git-diff
  - report-git-diff
  - review-diff
---

## Goal

แสดง git diff บน terminal ด้วยรูปแบบ codebase: file headers, line numbers, syntax highlighting, และ hunk separation ที่ชัดเจน

## Scope

ใช้เมื่อผู้ใช้ขอดู diff เปรียบเทียบ refs หรือตรวจสอบการเปลี่ยนแปลงของ PR บน terminal รองรับ diff ของ working tree, staged, commit, branch และ PR

ดูเพิ่มเติม: /view-files, /check-git-diff, /report-git-diff, /review-diff

## Execute

### 1. Identify Diff Source

> Goal: Identify Diff Source

ระบุว่าจะ diff อะไร

1. ถ้าไม่มี argument ให้ใช้ `git diff` สำหรับ working tree
2. ถ้ามี ref หนึ่งอัน ให้ใช้ `git diff <ref>`
3. ถ้ามี ref สองอัน ให้ใช้ `git diff <ref1> <ref2>`
4. ถ้ามี PR number ให้ใช้ `gh pr diff <number>`
5. ถ้ามี file path ให้จำกัด `git diff` เฉพาะไฟล์นั้น

### 2. Check Diff Tool

> Goal: Check Diff Tool

ตรวจสอบให้มี diff viewer คุณภาพสูงพร้อมใช้งาน

1. ให้เลือก `delta` ถ้าติดตั้งไว้แล้ว: `where delta` หรือ `Get-Command delta`
2. ถ้าขาดให้ติดตั้ง `delta` ด้วย `mise use -g delta`
3. ถ้า `delta` ใช้ไม่ได้ให้กลับไปใช้ `git diff` กับ `bat` สำหรับ file rendering
4. ถ้าไม่ได้เลยให้ใช้ `git diff` ธรรมดาเป็นทางเลือกสุดท้าย

### 3. View Working Tree Diff

> Goal: View Working Tree Diff

แสดงการเปลี่ยนแปลงที่ยังไม่ได้ commit

1. รัน `git diff` สำหรับทุกการเปลี่ยนแปลง
2. รัน `git diff -- <file>` สำหรับไฟล์เฉพาะ
3. รัน `git diff --staged` หรือ `git diff --cached` สำหรับ staged changes
4. ใช้ `delta` เพื่อ syntax highlighting และ side-by-side หากต้องการ

### 4. View Ref Diff

> Goal: View Ref Diff

แสดง diff ระหว่าง refs

1. รัน `git diff <ref> -- <file>` สำหรับ ref เดียว
2. รัน `git diff <ref1> <ref2> -- <file>` สำหรับสอง refs
3. รัน `git diff <ref1>...<ref2>` สำหรับ merge-base diff
4. ใส่ `--stat` ก่อนหากผู้ใช้ต้องการสรุป

### 5. View PR Diff

> Goal: View PR Diff

แสดง diff ของ pull request

1. รัน `gh pr diff <number>`
2. ใช้ `gh pr diff <number> --patch` สำหรับ patch format
3. ใช้ `gh pr diff <number> --color=always` เพื่อให้ output มีสี
4. ถ้า PR อยู่ใน repo อื่น ให้ใช้ `gh pr diff <number> --repo <owner/repo>`

### 6. Style And Limits

> Goal: Style And Limits

จัดรูปแบบและจำกัด output

1. ใช้ `bat --style=header,numbers,grid` สำหรับ diff ของแต่ละไฟล์เมื่อเป็นไปได้
2. ใช้ `delta --line-numbers --side-by-side` สำหรับ rich output
3. ถ้า diff เกิน 500 บรรทัด ให้แสดง `--stat` ก่อนแล้วถามก่อน output ฉบับเต็ม
4. สำหรับไฟล์ขนาดใหญ่ ใช้ `git diff -U3` เพื่อควบคุม context

## Rules

### 1. Tooling

- ให้เลือก `delta` สำหรับ syntax highlighting และ side-by-side diffs
- ใช้ `gh pr diff` สำหรับ pull request diffs
- ใช้ `git diff` ธรรมดาร่วมกับ `bat` เป็นทางเลือกรอง

### 2. Formatting

- แสดง file headers และ hunk headers
- ใส่ line numbers เมื่อเป็นไปได้
- เน้นแสดงบรรทัดที่เพิ่มและลบออกให้ชัดเจน

### 3. Scope

- จำกัด output ตาม refs หรือ files ที่ขอ
- แสดง `--stat` ก่อน full diff เมื่อช่วง diff มีขนาดใหญ่
- ไม่ diff binary files เว้นแต่จะขอโดยชัดเจน

### 4. Safety

- ตรวจสอบว่า repository เป็น git repo ก่อนรัน `git diff`
- ตรวจสอบว่า `gh` ได้ authenticate แล้วก่อนใช้ `gh pr diff`
- ไม่ apply diffs เว้นแต่จะถูกขอโดยชัดเจน

## Expected Outcome

- Diffs ถูกแสดงบน terminal โดยมี file headers และ hunk headers ที่ชัดเจน
- Syntax highlighting และ line numbers ช่วยให้อ่านง่ายขึ้น
- รองรับ diff ของ working tree, ref และ PR
- Diffs ขนาดใหญ่จะถูกสรุปก่อนแสดงฉบับเต็ม

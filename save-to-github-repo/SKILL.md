---
name: save-to-github-repo
description: บันทึก local project ใหม่ขึ้น GitHub ด้วย git init, create repo, และ /git-commit-and-push
argument-hint: "[<repo-name>] [--public|--private]"
triggers: ['user']
allowed-tools: ['exec', 'read', 'write']
related:
  - git-commit-and-push
  - open-web
---

## Goal

บันทึก local project ที่ยังไม่มี remote ขึ้น GitHub repository ใหม่

## Scope

- ใช้กับ directory ปัจจุบันที่มีหรือยังไม่มี `.git`
- สร้าง GitHub repo ใหม่, add remote, commit, push
- ไม่ครอบคลุม repo ที่มี remote อยู่แล้ว (ดู `/git-push`)

## Execute

### 1. Validate Local Directory

> Goal: ตรวจสอบสภาพ local repo ก่อนดำเนินการ

1. ตรวจสอบว่าอยู่ใน project directory
2. รัน `git status` ถ้ามี `.git` เพื่อดู state
3. ถ้ามี remote อยู่แล้วให้หยุดและบอกให้ใช้ `/git-push`
4. รับ `repo-name` จาก argument หรือใช้ชื่อโฟลเดอร์ปัจจุบัน
5. รับ visibility จาก argument (ค่าเริ่มต้น `--private`)

### 2. Initialize Git Repository

> Goal: local directory มี `.git`

1. ถ้าไม่มี `.git` ให้รัน `git init`
2. ถ้ายังไม่มี `.gitignore` ให้สร้าง `.gitignore` พื้นฐานตาม project type
3. รัน `git branch -M main`

### 3. Create GitHub Repository

> Goal: มี remote repository บน GitHub

1. ตรวจสอบ `gh auth status` ถ้าไม่ login ให้หยุดและแจ้งให้ทำ `gh auth login`
2. รัน `gh repo create <repo-name> --<visibility>`
3. ดึง URL ของ repo จาก output
4. รัน `git remote add origin <repo-url>`

### 4. Commit And Push

> Goal: โค้ดทั้งหมดถูก commit และ push ไป remote

1. ทำตาม `/git-commit-and-push` เพื่อ commit และ push การเปลี่ยนแปลง
2. ถ้า `git-commit-and-push` ล้มเหลว → ตรวจ `git status`, `git log`, แล้ว retry สูงสุด 1 ครั้ง

### 5. Verify

> Goal: ยืนยันว่า repo พร้อมใช้งาน

1. ตรวจสอบ `git status` ว่า clean
2. รัน `gh repo view <repo-name> --json url,defaultBranchRef --jq .url`
3. ทำ `/open-web` เปิด repo URL

## Rules

### 1. Repository Name

- ใช้ชื่อโฟลเดอร์ปัจจุบันเป็นค่าเริ่มต้น
- ถ้ามี argument ให้ใช้ argument แทน
- ไม่ใช้ชื่อที่มีอักขระพิเศษหรือช่องว่าง

### 2. Initial State

- ถ้าไม่มี commit เลย ให้ `git-commit-and-push` จัดการ commit ครั้งแรก
- ถ้ามีไฟล์ที่ควร ignore ให้แก้ไข `.gitignore` ก่อน stage
- ไม่ใช้ `git add .` โดยตรง ให้ `git-commit` จัดการ stage

### 3. Safety

- ตรวจสอบ `gh auth status` ก่อน
- ไม่ force push
- ถ้า repo มี remote อยู่แล้วให้หยุดและบอกให้ใช้ `/git-push`

## Expected Outcome

- Local project มี `.git` และ remote `origin`
- GitHub repository ถูกสร้างด้วย visibility ที่ระบุ
- ไฟล์ทั้งหมดถูก commit และ push
- เปิดหน้า repo ใน browser ได้
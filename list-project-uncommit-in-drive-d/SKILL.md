---
name: list-project-uncommit-in-drive-d
description: สแกน project บน drive D หา git repos ทีมี uncommitted changes พร้อมสถานะ
related:
  - list-project-git-in-computer
  - report-table
  - suggest-next-action
---

## Goal

รายการ git projects บน `D:\` ทีมี uncommitted changes หรือ untracked files พร้อม branch, last commit, remote

## Scope

ใช้เมื่อต้องการหา project บน drive D ทียังไม่ได้ commit หรือมีไฟล์ใหม่ทียังไม่ track โดยไม่แก้ไข git state

## Execute

### 1. Scan For .git On Drive D

> Goal: หา git repositories บน drive D

1. รัน `Get-ChildItem -Path "D:\" -Filter ".git" -Recurse -Directory -Depth 4 -ErrorAction SilentlyContinue`
2. ถ้า scan ช้า → ลดหรือเพิ่ม depth ตาม known root paths
3. บันทึก parent directory ของแต่ละ `.git` เป็น project path
4. ตัดผลซ้ำและ hidden/system paths ทีไม่ใช่ project

### 2. Collect Per-Project Git Status

> Goal: เก็บข้อมูล status ของแต่ละ project

1. cd เข้า project path
2. รัน `git branch --show-current` → บันทึก Branch
3. รัน `git status --short` → นับ modified/staged/untracked
4. รัน `git log -1 --pretty=format:"%h|%ad|%an" --date=short` → LastCommit
5. รัน `git remote get-url origin` → RemoteUrl

### 3. Filter Uncommitted Projects

> Goal: แสดงเฉพาะ project ทีมี uncommitted หรือ untracked

1. ถ้า `git status --short` มี output ใดๆ → ถือว่ามี uncommitted/untracked
2. เก็บเฉพาะ project ทีผ่าน filter
3. บันทึกจำนวน modified, staged, untracked แยก

### 4. Build Report

> Goal: รายงานผลเป็นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Project
   - Path
   - Branch
   - Modified
   - Staged
   - Untracked
   - LastCommit
   - RemoteUrl
2. เรียงตาม Project name
3. ระบุสรุปจำนวน projects ทีมี uncommitted

### 5. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ commit, stash, diff หรือ cleanup

## Rules

### 1. Scope

- สแกนเฉพาะ `D:\` ถ้าไม่ระบุ drive อื่น
- ไม่ network drives โดย default
- ถ้า permission denied → ข้ามและ report

### 2. Read Only

- ไม่ทำ `git add`, `git commit`, `git stash`, `git switch`, `git restore`, `git checkout` โดยไม่ตั้งใจ
- ใช้ `git status`, `git log`, `git branch`, `git remote` เท่านั้น

### 3. Depth

- ใช้ `Depth 4` เป็นค่าเริ่มต้น
- ถ้า project อยู่ลึกกว่า → ขยาย depth หรือระบุ root path เฉพาะ

- ใช้ /list-project-git-in-computer ถ้าจำเป็น

## Expected Outcome

- รายการ project บน `D:\` ทีมี uncommitted changes หรือ untracked files
- ข้อมูล branch, modified/staged/untracked, last commit, remote
- ตารางที sort ตาม project name
- ข้อมูลพร้อมสำหรับตัดสินใจ commit/stash/cleanup

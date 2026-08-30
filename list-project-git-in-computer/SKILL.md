---
name: list-project-git-in-computer
description: สแกนและรายการ git projects ทั้งหมดในเครื่อง ทุก drive พร้อม status
related:
  - list-cloudflare-projects
  - report-table
  - suggest-next-action
---

## Goal

รายการ git projects ทั้งหมดในเครื่อง ทุก drive พร้อมสถานะเบื้องต้น ได้แก่ branch, uncommitted changes, untracked files, last commit, remote

## Scope

ใช้เมื่อต้องการหา git repositories ทั้งหมดในเครื่องเพื่อ match กับ remote repos, เลือก project, หรือตรวจสอบสถานะ

## Execute

### 1. List Drives

> Goal: ระบุ drives ทีตรวจสอบได้

1. บน Windows รัน `Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root`
2. บน Linux/macOS รัน `ls /` หรือ `df -h`
3. กรองเฉพาะ fixed drives หรือ local drives (ไม่รวม network/CD ถ้าไม่ต้องการ)
4. บันทึกรายการ drives

### 2. Scan For .git

> Goal: หา directories ทีมี `.git`

1. สำหรับแต่ละ drive รัน:
   ```powershell
   Get-ChildItem -Path "<drive>:\" -Filter ".git" -Recurse -Directory -Depth 4 -ErrorAction SilentlyContinue
   ```
   หรือถ้าลึกกว่า depth 4 ให้เพิ่ม depth หรือรันเฉพาะ known roots
2. ถ้า scan ช้า → รันเฉพาะ drive ทีรู้ หรือระบุ root path เฉพาะ
3. บันทึก parent directory ของแต่ละ `.git` เป็น project path
4. ตัดผลซ้ำและ hidden/system paths ทีไม่ใช่ project

### 3. Collect Per-Project Info

> Goal: เก็บข้อมูลแต่ละ project

1. cd เข้า project path
2. รัน `git branch --show-current` → บันทึก Branch
3. รัน `git status --short` → นับ modified/staged/untracked
   - `M/A/D/R` = Uncommitted
   - `??` = Untracked
4. รัน `git log -1 --pretty=format:"%h|%ad|%an" --date=short` → LastCommit
5. รัน `git remote get-url origin` → RemoteUrl
6. รัน `git rev-parse --show-toplevel` → ยืนยัน root path

### 4. Build Report

> Goal: รายงานผลด้วย table

1. ใช้ `/report-table` คอลัมน์ดังนี้:
   - No
   - Project (directory name)
   - Path (absolute)
   - Drive
   - Branch
   - Uncommitted (count or `clean`)
   - Untracked (count)
   - LastCommit (short hash | date)
   - RemoteUrl (origin)
2. เรียงตาม Drive แล้ว Project name
3. ระบุ projects ทีมี uncommitted changes หรือ diverged

### 5. Match With Remote

> Goal: เตรียมสำหรับ matching กับ remote repos

1. สร้าง list ของ `Project` name (directory name)
2. สร้าง list ของ `RemoteUrl` ถ้ามี
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. Scope

- สแกนเฉพาะ local drives ถ้าไม่ระบุ
- ไม่ network drives โดย default
- ถ้า permission denied → ข้ามและ report

### 2. Depth

- ใช้ `Depth 4` เป็นค่าเริ่มต้นเพื่อความเร็ว
- ถ้า project อยู่ลึกกว่า → ขยาย depth หรือระบุ root path เฉพาะ

### 3. Read Only

- ไม่แก้ไข git state
- ไม่ checkout, commit, reset
- ใช้ `git status`, `git log`, `git branch`, `git remote` เท่านั้น

### 4. Performance

- ถ้ามีหลาย drive หรือ project จำนวนมาก → แบ่งรัน
- ใช้ `ErrorAction SilentlyContinue` เพื่อไม่หยุดเมื่อ permission denied
- ถ้า scan นานเกินไป → ลด depth หรือ scope

- ใช้ /list-cloudflare-projects ถ้าจำเป็น

## Expected Outcome

- รายการ git projects ทั้งหมดในเครื่อง
- ข้อมูล branch, uncommitted, untracked, last commit, remote
- ตารางที sort ตาม drive และ project
- ข้อมูลพร้อมสำหรับ match กับ remote repos

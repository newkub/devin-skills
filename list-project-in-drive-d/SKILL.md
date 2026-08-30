---
name: list-project-in-drive-d
description: แสดง template shell script list projects ใน drive D ที่มี .git
argument-hint: "[filter]"
related:
  - list-project-uncommit-in-drive-d
  - create-new-project-in-drive-d
  - list-project-git-in-computer
---

## Goal

สร้าง shell script template สำหรับ list projects ใน drive D ที่มี `.git` directory

## Scope

ใช้ `list-project-in-drive-d` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Create Shell Script Template

> Goal: Create Shell Script Template

1. สร้าง shell script สำหรับ list projects
2. ใช้ `find` command หรือ PowerShell equivalent
3. Filter เฉพาะ directories ที่มี `.git`
4. แสดงผลเป็น list พร้อม path

### 2. Script Options

> Goal: Script Options

1. รองรับ PowerShell (Windows)
2. รองรับ Bash (WSL/Linux)
3. รองรับ options เพิ่มเติม (depth, pattern)
4. แสดงผลในรูปแบบที่อ่านง่าย

### 3. Save Template

> Goal: Save Template

1. บันทึก script template ไว้ใน workspace
2. แจ้งให้ user ทราบว่า script ถูกสร้างแล้ว
3. แสดงวิธีใช้งาน

## Rules

### 1. Git Detection

ตรวจสอบว่า directory เป็น git repository:

- ตรวจสอบ `.git` directory
- ใช้ `find` command กับ `-name ".git"` option
- ใช้ PowerShell `Test-Path` สำหรับ `.git`

### 2. Path Filtering

Filter เฉพาะ projects ใน drive D:

- Search เฉพาะใน `d:\` หรือ `D:\`
- Exclude hidden directories
- Exclude system directories

### 3. Output Format

แสดงผลในรูปแบบที่อ่านง่าย:

- แสดง path แบบ full path
- แสดง project name (directory name)
- รองรับ table format หรือ list format

## Expected Outcome

- Shell script template ถูกสร้างแล้ว
- Script สามารถ list projects ใน drive D ที่มี `.git`
- User สามารถ copy และ run script ได้ทันที
- Output แสดงผลในรูปแบบที่อ่านง่าย

## Script Template

### PowerShell Version

```powershell
# List all git projects in drive D
Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3 |
    Where-Object { Test-Path (Join-Path $_.FullName ".git") } |
    Select-Object FullName |
    Format-Table -AutoSize
```

### Bash Version (WSL/Linux)

```bash
# List all git projects in drive D
find /mnt/d -maxdepth 3 -type d -name ".git" -printf "%h\n" 2>/dev/null
```

### Advanced PowerShell Version

```powershell
# List git projects with details
Get-ChildItem -Path "D:\" -Directory -Recurse -Depth 3 |
    Where-Object { Test-Path (Join-Path $_.FullName ".git") } |
    Select-Object `
        @{Name="Project"; Expression={$_.Name}},
        @{Name="Path"; Expression={$_.FullName}} |
    Format-Table -AutoSize
```
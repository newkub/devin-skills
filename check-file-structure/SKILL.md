---
name: check-file-structure
description: ตรวจสอบโครงสร้างไฟล์และโฟลเดอรด้วย eza หา depth, empty dirs, naming, และ size issues
argument-hint: "[path]"
related:
  - report-file-structure
  - analyze-file-structure
  - check-code-structure
  - use-scripts
  - check-long-files
  - check-path-length
---

## Goal

ตรวจสอบโครงสร้างไฟล์และโฟลเดอรใน project ด้วย `eza` เพื่อหา issues ที่เกี่ยวข้องกับ organization, depth, empty directories, naming, และ size ก่อนปรับปรุง

## Scope

ใช้กับ project directory หรือ workspace ใด workspace หนึ่ง ครอบคลุม:

- Directory tree และ nesting depth
- Empty directories
- Directory size / file count
- Naming conventions และ consistency
- Build/cache artifacts ที่ไม่ควรอยู่ใน source tree
- Long paths ที่อาจเกิน Windows MAX_PATH
- Symlinks/junctions ที่อาจเสียหาย

ไฟล์ source code ไม่ถูกแก้ไข — อ่านและรายงานเท่านั้น

## Execute

### 1. Prepare eza

> Goal: ตรวจสอบและเตรียม eza

1. ตรวจสอบว่า `eza` พร้อมใช้ด้วย `eza --version`
2. ถ้าไม่มี:
   - ลองใช้ `mise use -g eza` หรือ package manager ที่เหมาะสม
   - fallback ใช้ `tree` หรือ `ls -R` ถ้าติดตั้งไม่ได้
3. ระบุ root path จาก argument (default: current directory)

### 2. Tree Overview

> Goal: ดูภาพรวม file structure

1. รัน `eza --tree --level 2 --icons --group-directories-first <path>`
2. ถ้า project ใหญ่ → จำกัด level ตาม `--level N` (ค่าเริ่มต้น 2-3)
3. กรอง build/cache ออกด้วย `--ignore-glob "node_modules|dist|build|target|.git"`
4. บันทึก tree output ไว้เป็นหลักฐาน
5. ถ้า `eza` ไม่พร้อม → ใช้ `tree -L 2 -I "node_modules|dist|build|target|.git" <path>`

### 3. Detailed Listing

> Goal: เก็บ metadata ของไฟล์และโฟลเดอร

1. รัน `eza -la --icons --group-directories-first --sort=size --reverse --ignore-glob "node_modules|dist|build|target|.git" <path>`
2. บันทึก top-level listing
3. ถ้าต้องการ stats ลึก → ทำ `/use-scripts` คำนวณ file count, total size, depth distribution, empty dirs
4. ใช้ `eza -la --tree --level 99` ด้วย caution สำหรับ project เล็กเท่านั้น

### 4. Detect File Structure Issues

> Goal: ระบุ issues จาก output

1. Deep nesting: ไฟล์หรือโฟลเดอรอยู่ลึกเกิน 5 levels (นับจาก root)
2. Empty directories: โฟลเดอรที่ไม่มีไฟล์ source
3. High file count: โฟลเดอรที่มีไฟล์เกิน 50 ไฟล์โดยไม่มี subdirectories
4. Mixed domains: โฟลเดอรเดียวกันมีไฟล์หลาย domain/responsibility ปนกัน
5. Naming inconsistency: ชื่อไฟล์หรือโฟลเดอรสลับระหว่าง kebab, camel, snake, Pascal
6. Build artifacts: ไฟล์ `dist`, `build`, `.cache`, `target` ปรากฏใน source tree
7. Long paths: path ยาวเกิน 260 chars (Windows) → ทำ `/check-path-length` ถ้าจำเป็น
8. Broken symlinks: ทำ `/check-broken-symlinks` ถ้าพบ junction/symlink

### 5. Validate And Report

> Goal: รายงาน findings

1. ทำ `/report` หรือ `/report-file-structure` แสดง: Issue type, Path, Severity, Evidence, Recommended action
2. ระบุ severity: Critical / High / Medium / Low
3. ทำ `/suggest-next-action` เพื่อแนะนำ `/restructure`, `/refactor`, `/cleanup-files-in-project`, หรือ `/check-code-structure`
4. ถ้าไม่พบ issues → report ว่า file structure ผ่านเกณฑ์

## Rules

### 1. Read Only

- ไม่แก้ไข ย้าย หรือลบไฟล์/โฟลเดอร
- ใช้ `eza`, `tree`, `ls` เท่านั้น
- ถ้าต้องการ script ให้เก็บใน OS temp หรือ `.devin/scripts/`

### 2. Tool Preference

- ใช้ `eza` เป็นค่าเริ่มต้น
- ถ้า `eza` ไม่พร้อม → `tree` บน macOS/Linux, `tree` หรือ PowerShell `Get-ChildItem -Recurse` บน Windows
- ไม่ติดตั้ง program global ถ้าไม่จำเป็น

### 3. Filtering

- กรอง `node_modules`, `.git`, `dist`, `build`, `.cache`, `target` ออกจาก output เสมอ
- ใช้ `--ignore-glob` ของ `eza` หรือ equivalent
- ระบุจำนวนไฟล์/โฟลเดอรที่ถูกกรอง

### 4. Thresholds

- Deep nesting: > 5 levels
- Empty directories: 0 files (ไม่นับ .gitkeep)
- High file count per directory: > 50 files
- Long paths: > 260 chars บน Windows, > 4096 บน Linux/macOS
- Large files: ทำ `/check-long-files` ถ้าเกิน 250 บรรทัด (สำหรับ source)

### 5. Cross Platform

- รองรับ Windows, macOS, Linux
- ใช้ command equivalents ถ้า `eza` ไม่พร้อม
- ระบุ OS และ tool ที่ใช้ใน report

- ใช้ `/report-file-structure` ถ้าต้องการ tree view สวยงาม
- ใช้ `/analyze-file-structure` ถ้าต้องการ JSON output สำหรับ downstream
- ใช้ `/check-code-structure` ถ้าจำเป็น

## Expected Outcome

- File structure issues ถูกระบุพร้อม path, severity, และ evidence
- Tree view จาก `eza` หรือ fallback
- รายงาน recommendations และ next actions
- ไม่มีการเปลี่ยนแปลงไฟล์/โฟลเดอร

---
name: follow-loc
description: ใช้งาน loc tool สำหรับนับ lines of code แบบเร็ว กรองไฟล์ และวิเคราะห์ขนาดไฟล์
---

## Goal

ใช้งาน `loc` tool สำหรับนับ lines of code แยกตามภาษาและไฟล์ พร้อมกรองไฟล์ตามเงื่อนไข

## Scope

ใช้สำหรับ project ที่ติดตั้ง `loc` แล้ว ครอบคลุมการนับ lines, กรองไฟล์, และวิเคราะห์ขนาดไฟล์

## Execute

### 1. Check Prerequisites

1. ตรวจสอบว่ามี `loc` ติดตั้งหรือไม่: `loc --version`
2. ถ้าไม่มี → ติดตั้งด้วย `cargo install loc` หรือดาวน์โหลด binary จาก https://github.com/cgag/loc/releases
3. ถ้าไม่มี Rust/Cargo → ติดตั้งจาก https://www.rustup.rs/

### 2. Count Lines Of Code

1. รัน `loc` เพื่อนับ lines of code ทั้ง project: `loc`
2. ระบุ path เฉพาะ: `loc src/` หรือ `loc ci benches`
3. ผลลัพธ์แสดงตารางแยกตามภาษา: Files, Lines, Blank, Comment, Code

### 3. Show Per-File Statistics

1. รัน `loc --files` เพื่อแสดงสถิติระดับไฟล์
2. ใช้ `--sort` สำหรับเรียงลำดับ:
   - `--sort Code` (default) — เรียงตามจำนวน code lines
   - `--sort Lines` — เรียงตามจำนวนบรรทัดทั้งหมด
   - `--sort Comment` — เรียงตามจำนวน comment
   - `--sort Blank` — เรียงตามจำนวน blank lines
3. ค่า `Language` และ `Files` ใช้ได้เฉพาะเมื่อไม่มี `--files`

### 4. Filter Files

1. ใช้ `--include <REGEX>` กรองเฉพาะไฟล์ที่ตรงเงื่อนไข:
   - `loc --include '\.ts$'` — เฉพาะ TypeScript files
   - `loc --include 'src/'` — เฉพาะไฟล์ใน src/
2. ใช้ `--exclude <REGEX>` ยกเว้นไฟล์ที่ตรงเงื่อนไข:
   - `loc --exclude 'sh$'` — ยกเว้น shell scripts
   - `loc --exclude 'node_modules/'` — ยกเว้น node_modules
3. ใช้หลาย `--include` หรือ `--exclude` พร้อมกันได้ (OR logic)
4. ใช้ `-u` เพื่อข้าม `.gitignore` และ `-uu` เพื่อรวม hidden files

### 5. Filter Long Files

1. รัน `loc --files --sort Lines` แล้ว pipe ไปกรองเฉพาะไฟล์ที่ > threshold:
   ```bash
   pwsh -NoProfile -Command "loc --files --sort Lines | Select-String -Pattern '^\|' | ForEach-Object { $line = $_.Line; if ($line -match '\|\s*(\S+)\s+(\d+)\s+') { if ([int]$Matches[2] -gt 250) { $line } } }"
   ```
2. เปลี่ยนตัวเลข `250` เป็น threshold ที่ต้องการ
3. ดู `/check-long-files` สำหรับ workflow เฉพาะ

## Rules

### 1. Installation

- ติดตั้งผ่าน `cargo install loc` หรือดาวน์โหลด binary จาก releases page
- ต้องมี Rust/Cargo ก่อนติดตั้งผ่าน cargo
- รองรับ Windows, macOS, และ Linux

### 2. CLI Flags

- `--files` — แสดงสถิติระดับไฟล์ (default: แสดงเฉพาะ summary ตามภาษา)
- `--sort <COLUMN>` — เรียงลำดับตามคอลัมน์: `Code`, `Comment`, `Blank`, `Lines`, `Language`, `Files` (default: `Code`)
- `--include <REGEX>` — กรองเฉพาะไฟล์ที่ตรง regex (รองรับหลาย flag, OR logic)
- `--exclude <REGEX>` — ยกเว้นไฟล์ที่ตรง regex (รองรับหลาย flag, OR logic)
- `-u` / `--unrestricted` — ข้าม `.gitignore` (ใช้ `-uu` เพื่อรวม hidden files)
- `[target]...` — ระบุ path หรือไฟล์ (default: current directory)

### 3. Output Format

- ตารางแสดง columns: Language, Files, Lines, Blank, Comment, Code
- ใช้ `--files` เพื่อแสดง per-file breakdown (ขึ้นต้นด้วย `|`)
- ผลลัพธ์เรียงจากมากไปน้อยตามคอลัมน์ที่เลือกใน `--sort`

### 4. Regex Syntax

- `--include` และ `--exclude` ใช้ Rust regex syntax
- ใช้ `\.ts$` สำหรับไฟล์ .ts (จำเป็นต้อง escape dot)
- ใช้ `src/` สำหรับไฟล์ใน directory ใดๆ ที่มี `src/` ใน path
- หลาย flag ใช้ OR logic: `--include '\.ts$' --include '\.tsx$'` ได้ทั้ง .ts และ .tsx

### 5. Performance

- `loc` เร็วกว่า `cloc` 100x และเร็วกว่า `tokei` 2-10x
- ใช้ parallel processing ผ่าน worker pool ทุก CPU cores
- ใช้ byte-level iteration สำหรับความเร็วสูง
- กรองไฟล์ด้วย `--include`/`--exclude` ก่อนนับเพื่อลดเวลา

## Expected Outcome

- ทราบจำนวน lines of code แยกตามภาษาและไฟล์
- กรองไฟล์ตามประเภทหรือ path ได้
- ระบุไฟล์ที่ยาวเกิน threshold ได้
- ผลลัพธ์เป็นตารางชัดเจน เรียงลำดับตามที่ต้องการ

---
name: check-long-files
description: ตรวจสอบและรายงานไฟล์ที่ยาวกว่า threshold ด้วย Rust CLI
argument-hint: "[threshold]"
related:
  - check-code-structure
  - refactor
  - report-scan-todo
---
## Goal

ตรวจสอบและรายงานไฟล์ source code ที่มีจำนวนบรรทัดเกิน threshold ที่กำหนด

## Scope

ใช้สำหรับตรวจสอบไฟล์ `.ts`, `.tsx`, `.js`, `.jsx` ใน workspace โดยไม่แก้ไขไฟล์ต้นฉบับ
Skill นี้ใช้ Rust CLI แทน Bun/TS CLI เพราะต้องการ performance สูงและ binary ไม่มี dependencies

## Execute

### 1. Build CLI

> Goal: build Rust CLI จาก source ใน skill directory

1. ตรวจสอบว่ามี `Cargo.toml` และ `src/main.rs` ใน skill directory
2. รันคำสั่ง `cargo build --release` ใน skill directory
3. ตรวจสอบว่ามี binary ที่ `target/release/check-long-files` (หรือ `.exe` บน Windows)

### 2. Run CLI

> Goal: รัน CLI ใน target workspace

1. เปลี่ยน working directory ไปยัง root ของ target workspace
2. รันคำสั่ง `<skill-dir>/target/release/check-long-files [threshold]`
3. รับผลลัพธ์: รายการไฟล์ที่เกิน threshold เรียงจากมากไปน้อย

## Rules

### 1. File Discovery

- ใช้ `ignore` crate เพื่อ walk files และเคารพ `.gitignore` โดยอัตโนมัติ ทั้งใน git repo และ non-git repo
- กรองเฉพาะไฟล์ที่มี extension `.ts`, `.tsx`, `.js`, `.jsx`
- ไม่กำหนด skip directories แบบ hardcoded เอง

### 2. Line Counting

- ใช้ `BufReader::lines()` สำหรับนับจำนวนบรรทัด
- ข้ามไฟล์ที่หาไม่เจอหรืออ่านไม่ได้
- ไม่ modify ไฟล์ต้นฉบับ

### 3. Threshold And Output

- รับ threshold จาก argument แรก ค่าเริ่มต้น 250
- กรองเฉพาะไฟล์ที่มากกว่า threshold
- เรียงลำดับตามจำนวนบรรทัดจากมากไปน้อย
- แสดงชื่อไฟล์และจำนวนบรรทัด
- แสดงจำนวนไฟล์ทั้งหมดที่เกิน threshold

## Expected Outcome

- CLI binary ถูก build สำเร็จ
- รายงานไฟล์ที่ยาวกว่า threshold
- แสดงชื่อไฟล์และจำนวนบรรทัด
- เรียงลำดับจากมากไปน้อย
- แสดงจำนวนไฟล์ทั้งหมดที่เกิน threshold
- ไม่แก้ไขไฟล์ใด ๆ ใน target workspace

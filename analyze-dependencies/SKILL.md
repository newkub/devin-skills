---
name: analyze-dependencies
description: วิเคราะห์ dependencies ของ project ผ่าน Rust CLI รองรับ Cargo, NPM, Go, Python
related:
  - research-dependencies
  - follow-my-tech-stack
  - report-table
  - follow-create-rust-cli
---

## Goal

วิเคราะห์ dependencies ของ project จาก manifest files ต่างๆ พร้อมเช็ค latest version และ outdated packages

## Scope

ใช้สำหรับ `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml` โดยสแกนด้วย Rust CLI

## Execute

### 1. Install

> Goal: ติดตั้ง CLI

1. `cargo install --git https://github.com/newkub/analyze-dependencies`
2. หรือ clone แล้ว build ด้วย `cargo build --release` ถ้าต้องการ dev build

### 2. Analyze Dependencies

> Goal: รวบรวม dependencies

1. รันคำสั่ง `analyze-dependencies <path>`
2. CLI จะตรวจพบ manifest ทีมีอยู่: `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
3. ใช้ `--json` สำหรับ machine-readable output
4. ใช้ `--latest` เพื่อดึง latest version จาก registry
5. ใช้ `--outdated` (คู่กับ `--latest`) เพื่อแสดงเฉพาะ dependencies ทีเก่ากว่า

### 3. Report

> Goal: รายงานผล

1. ใช้ `--json` แล้วส่งไปยัง `/report-table`
2. สรุปจำนวน dependencies, จำนวน outdated, แยกตาม source
3. ถ้าต้องการเปรียบเทียบทางเลือก → ใช้ `/research-dependencies`

## Rules

- ไม่แก้ไข manifest files — อ่านอย่างเดียว
- รองรับทั้ง Rust, JavaScript/Bun, Go, Python
- ถ้า ecosystem ไม่อยู่ใน list → ใช้ `/research-dependencies` หา tool เพิ่มเติม
- ใช้ `--latest` เฉพาะเมื่อมี network และไม่ต้องการส่ง request มากเกินไป

- ใช้ /follow-my-tech-stack ถ้าจำเป็น
- ใช้ /follow-create-rust-cli ถ้าจำเป็น
## Expected Outcome

- รายการ dependencies พร้อม version และ source
- สถิติรวมและจำนวน outdated
- JSON output สำหรับ downstream tools
- Recommendation สำหรับ dependencies ทีควร update

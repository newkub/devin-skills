---
name: analyze-file-structure
description: วิเคราะห์โครงสร้างไฟล์และโฟลเดอรของ project ด้วย Rust CLI
related:
  - report-file-structure
  - report-table
  - follow-create-rust-cli
  - follow-my-tech-stack
---

## Goal

สแกน project และวิเคราะห์โครงสร้างไฟล์/โฟลเดอร พร้อมสถิติและกรองไฟล์ build/cache

## Scope

ใช้สำหรับดู file tree, สถิติจำนวนไฟล์, ประเภท, ขนาด โดยสแกนด้วย Rust CLI ที่ build เป็น binary เดียว

## Execute

### 1. Install

> Goal: ติดตั้ง CLI

1. ถ้าต้องการ global install: `cargo install --git https://github.com/newkub/analyze-file-structure`
2. ถ้าต้องการ dev build:  clone แล้ว `cargo build --release`
3. binary อยู่ที่ `target/release/analyze-file-structure` ถ้า build จาก source

### 2. Analyze Structure

> Goal: วิเคราะห์โครงสร้างไฟล์

1. รันคำสั่ง `analyze-file-structure <path>`
2. กรอง `node_modules`, `.git`, `dist`, `build`, `target` โดย default
3. กำหนด depth ด้วย `--depth <N>`
4. ดูสถิติด้วย `--stats`
5. ดูผลลัพธ์ JSON ด้วย `--json`

### 3. Report

> Goal: รายงานผล

1. ใช้ `--json` แล้วส่งไปยัง `/report-table` หรือ `/report-file-structure`
2. กรณี simple output ใช้ `--stats` แล้วอ่านค่าผ่าน terminal
3. ถ้าต้องการ visualize ใน browser → ใช้ `/report-in-html`

## Rules

- ไม่แก้ไขไฟล์ source ใน project ทีสแกน — อ่านอย่างเดียว
- default กรอง build/cache ออก
- ระบุ depth สำหรับ project ใหญ่
- ถ้า CLI ยังไม่ถูกต้องตาม tech stack → ทำ `/follow-my-tech-stack` ก่อน

## Expected Outcome

- รายการไฟล์และโฟลเดอรทีอ่านง่าย
- สถิติพื้นฐาน (จำนวนไฟล์, ประเภท, ขนาด)
- ไฟล์ build/cache ถูกกรอง
- รองรับ JSON output สำหรับ downstream tools

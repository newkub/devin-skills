---
name: report-cleanup-files-in-project
description: รายงานไฟล์และโฟลเดอร์ใน project workspace ที่สามารถลบหรือทำความสะอาดได้
allowed-tools:
- read
- write
- edit
- grep
- glob
- exec
- ask_user_question
triggers:
- user
- model
related:
- report-format-table
- suggest-next-action
---

## Goal

วิเคราะห์และรายงานไฟล์/โฟลเดอร์ใน project workspace ที่สามารถลบหรือทำความสะอาดได้ เพื่อช่วยตัดสินใจก่อน cleanup จริง

## Scope

ใช้กับ project workspace ปัจจุบันหรือ workspace ที่ระบุ
- เป็น **report-only** ไม่ลบอัตโนมัติ
- ครอบคลุม build artifacts, dependency caches, framework cache, logs, coverage, และ temp files
- ไม่รวม source code, lock files, config, .env

## Execute

### 1. Prepare Workspace

เตรียมข้อมูล workspace และขอบเขต

> Goal: รู้ว่า project ประเภทอะไร และอะไรลบได้

1. ระบุ workspace root
2. อ่าน package manifest (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, etc.)
3. ตรวจสอบ `.gitignore` และ `git status`
4. ยืนยัน report-only ไม่ลบอัตโนมัติ

### 2. Scan Project Directories

ค้นหา candidates ตาม ecosystem ที่ตรวจพบ

> Goal: มีรายการ build artifacts, caches, logs, dependencies เก่า

1. ค้นหา build artifacts:
   - `dist`, `build`, `out`, `.output`
   - `.next`, `.nuxt`, `.svelte-kit`, `.astro`
2. ค้นหา dependency caches:
   - `node_modules` (ถ้าอยู่นอก .gitignore หรือมีหลายตัว), `.bun/install/cache`
   - `target` (Rust), `__pycache__`, `.venv`
   - `.turbo`, `.cache`, `.parcel-cache`, `.eslintcache`
3. ค้นหา test/coverage outputs:
   - `coverage`, `.nyc_output`, `test-results`
4. ค้นหา logs และ temp:
   - `*.log`, `*.tmp`, `.DS_Store`, `Thumbs.db`, `*.swp`, `*.swo`
5. ถ้าพบมากกว่า 50 candidates หรือต้อง aggregate ให้ทำ `/use-scripts`

### 3. Analyze Candidates

ประเมินความปลอดภัยและผลกระทบของแต่ละรายการ

> Goal: รู้ว่าอะไรลบได้ปลอดภัย

1. จัดกลุ่มตาม category: build output, cache, log, test output, temp
2. คำนวณขนาดโดยประมาณของแต่ละ group
3. เช็คว่าอยู่ใน `.gitignore` หรือไม่
4. กำหนด safety:
   - `safe` = build output/cache ที่สร้างใหม่ได้
   - `review` = ไฟล์ที่ไม่ชัดว่าเป็น cache
   - `risky` = อาจมี config หรือ generated ที่แก้ไขด้วยมือ
5. ระบุ suggested command เช่น `cargo clean`, `bun pm cache clean`, `Remove-Item -Recurse -Force dist`

### 4. Format Report

สร้าง report ที่อ่านง่าย

> Goal: ผู้ใช้ตัดสินใจ cleanup ได้

1. ทำ `/report-format-table` ด้วย columns:
   - `#`, `Category`, `Path/Pattern`, `Size`, `In .gitignore`, `Safety`, `Suggested Command`, `Notes`
2. ทำ `/report-format-file-structure` สำหรับ top-level cleanup candidates
3. สรุป:
   - จำนวน candidates
   - ขนาดรวมประหยัดได้
   - รายการ safe ที่ลบได้ทันที

### 5. Suggest Next Actions

นำเสนอ action ถัดไป

> Goal: ผู้ใช้รู้ทางเลือกถัดไป

1. ทำ `/suggest-next-action`
2. แนะนำ workflows:
   - `/run-cleanup` สำหรับลบ build artifacts และ caches
   - `/run-clean` สำหรับ clean ทั้งหมดแล้ว reinstall
   - `/remove-unnecessary` สำหรับลบสิ่งที่ไม่จำเป็น
3. ถ้าผู้ใช้ตอบตกลงจึงค่อยรัน cleanup จริง

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Report-Only

- ห้ามลบ ย้าย หรือแก้ไขไฟล์อัตโนมัติ
- แสดง suggested commands ให้ผู้ใช้เห็นก่อน
- ต้องได้รับ explicit confirmation ก่อนลบจริง

### 2. Source Safety

- ไม่ลบ source code, lock files, config files, `.env`, `AGENTS.md`, `README.md`
- ไม่ลบไฟล์ที่ไม่ได้อยู่ใน `.gitignore` โดยไม่ถามก่อน
- ใช้ `git status` เช็ค untracked files ก่อนแนะนำลบ

### 3. Ecosystem-Aware

- ใช้คำสั่ง cleanup เฉพาะ ecosystem:
  - JavaScript: `bun pm cache clean`, `npm cache clean`
  - Rust: `cargo clean`
  - Python: `rmdir /s /q .venv` หรือ `rm -rf __pycache__`
  - Go: `go clean -cache`
- ถ้าไม่แน่ใจ ให้ระบุ `manual review required`

### 4. Accuracy

- ระบุขนาดโดยประมาณและวิธีคำนวณ
- ระบุสาเหตุที่เป็น candidate
- ใช้ `/scan-codebase` เพื่อไม่ให้พลาด references

## Expected Outcome

- ตารางรายงาน cleanup candidates ใน project
- ขนาดรวมประหยัดได้
- ระดับความปลอดภัยของแต่ละรายการ
- ecosystem-specific cleanup commands
- next actions ชัดเจน

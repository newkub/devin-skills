---
name: test-usage
description: ทดสอบ usage examples จาก README และ docs เพื่อยื่นยันว่าทำงานได่จริงก่อน ship
---

## Goal

ทดสอบ usage examples ใน `README.md`, เอกสารประกอบ และ `package.json` scripts เพื่อยื่นยันว่าทำงานได่จริงก่อน ship

## Scope

ใช้กับ CLI commands, SDK code examples, package scripts และ instructions ที่ปรากฏใน docs ก่อน release

## Execute

### 1. Discover Usage Examples

> Goal: ค้นหา usage examples ทั้งหมด

1. หา `README.md` ทั้งหมดใน project (root และ workspaces)
2. ดึง code blocks จาก `## Usage` และ `### Usage via ...` sections
3. แยกประเภท: `bash` (CLI commands), `typescript`/`javascript` (SDK examples), `json` (scripts)
4. บันทึกรายการ examples พร้อมตำแหน่งไฟล์

### 2. Test CLI Commands

> Goal: ทดสอบ CLI commands ที่ไม่ทำลายข้อมูล

1. ทดสอบ commands ที่ปลอดภัย (`--help`, `--version`, `help`, `version`)
2. ถ้ามี custom directory → ทดสอบด้วย directory ที่มี markdown files อยู่จริง
3. ถ้า command ต้องรัน server → ใช้ `--no-open` และ `--port=0` หรือ kill หลังจากทดสอบ
4. บันทึกผลลัพธ์ของแต่ละ command

### 3. Test SDK Examples

> Goal: ทดสอบ SDK code examples

1. สร้างไฟล์ชั่วคราว (`tmp/test-usage-<ts|js>`) จาก code example
2. แก้ไข relative paths ให้ตรงกับ test environment
3. รันด้วย `bun` หรือ `node`
4. ถ้าต้องการ build ก่อน → ทำ `resolve-errors` แล้วลอง `build`
5. บันทึกผลลัพธ์

### 4. Test Package Scripts

> Goal: ทดสอบ package.json scripts ที่เกี่ยวข้องกับ usage

1. ระบุ scripts ที่มีอยู่ใน `package.json` (root และ workspaces)
2. ทดสอบ scripts ที่ไม่เสี่ยง: `build`, `typecheck`, `lint`, `test`
3. ถ้า `dev` หรือ server scripts ไม่จำเป็นต้องทดสอบ → skip และบันทึก
4. บันทึกผลลัพธ์

### 5. Report And Fix

> Goal: รายงานผลและจัดการ issues

1. รวบรวมผลการทดสอบเป็นตาราง (example, expected, actual, status)
2. ถ้ามี failures → แสดงรายการและถาม user ว่าจะ fix หรือ skip
3. ถ้า fix → แก้ไข README หรือ code ตามความเหมาะสม
4. ทดสอบซ้ำจนกว่าจะผ่าน (max 3 → stop/report)

## Rules

### 1. Safety

- ไม่รัน commands ที่อาจทำลายข้อมูล (`clean`, `rm -rf`, `push`, `deploy`)
- ไม่รัน `bun run dev` หรือ `tauri dev` โดยไม่มี `--no-open` และ timeout
- ถ้า command ต้องรัน server ให้ set timeout แล้ว kill
- ถาม user ก่อนรัน commands ที่มี side effects

### 2. Scope

- ทดสอบเฉพาะ examples ที่อยู่ใน docs ที่จะ ship
- ไม่ต้องทดสอบ examples ที่เป็น pseudo-code หรือต้องการ external setup
- ข้าม examples ที่ require network, API keys, หรือ hardware จริง

### 3. Environment

- ใช้ `bun` เป็นหลักถ้า project ใช้ Bun
- ถ้าไม่มี `bun` ให้ใช้ `node`
- ตรวจสอบ `package.json` เพื่อเลือก runtime และ package manager
- สร้างไฟล์ชั่วคราวใน `temp` แล้วลบหลังทดสอบ

### 4. Reporting

- รายงาน status ของแต่ละ example: ✅ ผ่าน, ❌ ไม่ผ่าน, ⏭️ ข้าม
- เก็บ error output ไว้ใช้ debug
- ถ้าไม่มี examples ให้ report ว่าไม่มีอะไรต้อง test

## Expected Outcome

- ทุก usage example ใน docs ถูกทดสอบ
- ไม่มี broken examples ก่อน ship
- มี report สรุปสถานะทดสอบ
- ผู้ใช้ทราบก่อน ship หากมี examples ที่ยังไม่ทำงาน

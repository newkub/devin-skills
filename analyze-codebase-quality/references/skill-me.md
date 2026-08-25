---
name: skill-me
description: Core workflow for analyze-codebase-quality
---

## Goal

วิเคราะห์คุณภาพของ codebase ด้วย `analyze-codebase-quality` CLI หรือ SDK

## Scope

ใช้กับ TypeScript/JavaScript projects ทีต้องการประเมิน quality 8 มิติ

- ไม่ execute code
- ไม่แก้ source ของ target project
- รองรับ output formats: `table`, `json`, `markdown`, `plain`

## Execute

### 1. Prepare Project

> Goal: ยืนยัน project ทีจะ analyze

1. ตรวจสอบ `package.json` ว่าเป็น TypeScript/JavaScript project
2. ถ้าไม่ใช่ → stop และ report
3. ทำ `/scan-codebase` เพื่อดู structure และ config หลัก

### 2. Choose Mode

> Goal: เลือกรูปแบบวิเคราะห์ทีเหมาะสม

1. ถ้า user ไม่ได้ระบุ → analyze ทั้งหมด 8 categories
2. ถ้า user ระบุ `--category` → วิเคราะห์ category เดียว
3. ถ้า user ระบุ `--severity` → กรองเฉพาะระดับทีสูงกว่า
4. เลือก output format: `table` (default), `json`, `markdown`, `plain`

### 3. Run Analysis

> Goal: ได้ report ทีถูกต้อง

1. อ่าน `src/SKILL.md` เพื่อ build และ run CLI
2. ถ้า CLI ไม่พร้อม → build เอง: `bun run --cwd src build` แล้ว `bun run --cwd src start -- [path] [options]`
3. รอผลลัพธ์และบันทึกไฟล์ถ้ามี `--output`

### 4. Report

> Goal: สรุปผลให้ user เข้าใจ

1. ใช้ `/report-table` สรุป categories, severity counts, status
2. จัดลำดับ findings ตาม impact
3. แนะนำ next action ด้วย `/suggest-next-action`

## Rules

### 1. Safety

- ไม่รัน commands ที destructive โดยไม่ได้ user confirm
- ไม่แก้ source ของ target project
- ถ้า `--output` ทับไฟล์เดิม → ถามก่อน

### 2. Accuracy

- ทุก finding ต้องมาจาก analyzer ไม่ใช่ assumption
- แยก category และ severity ตาม output
- ถ้า analyzer ไม่สามารถ build ได้ → report เป็นปัญหา build ก่อน

### 3. Output

- default ใช้ table format
- ถ้า user ต้องการ integrate → แนะนำ `json`
- ถ้า user ต้องการสั้น → แนะนำ `quiet`

## Expected Outcome

- รายงานคุณภาพ codebase ครบ 8 categories หรือ category ทีระบุ
- ตารางสรุป severity counts
- คำแนะนำ next action

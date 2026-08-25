---
name: follow-plan
description: อ่านแผนจาก AGENTS.md หรือเอกสาร plan แล้วทำตามทีละ step จนครบ พร้อม track ใน todo list
argument-hint: "[plan-file]"
---

## Goal

อ่านแผน (plan) จาก `AGENTS.md`, ไฟล์ plan หรือ context แล้วทำตามทีละ step จนครบ พร้อม track ความคืบหน้าใน todo list

## Scope

ใช้สำหรับ execute plan ที่มีรายการ workflows, skills, หรือ tasks เช่นจาก `deep-plan` หรือ `follow-agents-md`

## Execute

### 1. Load Plan

> Goal: โหลด plan เข้ามา

1. อ่าน `AGENTS.md` ใน project root
2. ถ้าไม่พบ plan ใน `AGENTS.md` → ค้นหาไฟล์ `PLAN.md`, `plan.md`, `TODO.md` หรือ context ที่ผู้ใช้ให้มา
3. ระบุรายการ steps จาก headings, bullets, หรือ numbered list
4. ถ้าไม่มี plan → stop และ report

### 2. Parse Steps

> Goal: แยก plan ออกเป็น executable steps

1. แปลงแต่ละ step เป็นหนึ่งใน:
   - workflow: ชื่อ workflow เช่น `report`
   - skill: ชื่อ skill เช่น `test-usage`
   - command: คำสั่ง shell
   - decision: เงื่อนไขที่ต้องถาม user
2. ระบุลำดับความสำคัญและ dependencies
3. ถ้า step ไม่ชัดเจน → ถาม user ก่อนดำเนินการ

### 3. Execute Steps

> Goal: ทำตาม plan ทีละ step

1. สร้าง todo list จาก steps ทั้งหมด
2. ทำ step แรก → mark `in_progress`
3. อ่าน workflow/skill file จริงก่อน invoke
4. ทำตาม `## Execute` ของ workflow/skill นั้น
5. ตรวจสอบ `## Expected Outcome` ก่อน mark `completed`
6. ทำ step ถัดไปจนครบ

### 4. Handle Failures

> Goal: จัดการ step ทีไม่ผ่าน

1. ถ้า step ไม่ผ่าน → ทำ `resolve-errors` หรือถาม user
2. ทำซ้ำ step นั้น (max 3 ครั้ง)
3. ถ้ายังไม่ผ่าน → stop และ report สิ่งที่ค้าง
4. ถ้า user อนุญาตให้ข้าม → mark `⏭️ ข้าม` และไป step ถัดไป

### 5. Validate And Report

> Goal: ตรวจสอบและรายงานผล

1. ตรวจสอบว่าทุก step เป็น `completed` หรือ `ข้าม`
2. รวบรวมผลลัพธ์เป็น table
3. รายงาน status ด้วย symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⏭️ ข้าม
4. ทำ `suggest-next-action` ถ้ามีงานค้าง

## Rules

### 1. Read Before Invoke

- ทุก workflow ต้องอ่านไฟล์ `global_workflows/<name>.md` ก่อนดำเนินการ
- ทุก skill ต้องอ่านไฟล์ `skills/<name>/SKILL.md` ก่อนดำเนินการ
- ถ้าไฟล์ไม่มีอยู่จริง → stop หรือถาม user

### 2. Track Progress

- ใช้ `todo_write` สร้างและอัปเดต todo list ตาม steps
- มีเพียงหนึ่ง step `in_progress` ในเวลาเดียวกัน
- mark `completed` ทันทีหลัง verify expected outcome

### 3. Scope And Safety

- ไม่ทำ step ที่ไม่ได้ระบุใน plan โดยไม่ได้รับอนุญาต
- ถ้า step เป็น high-risk (deploy, push, delete) → ใช้ `ask_user_question` ก่อน
- ไม่ force push หรือ force merge

### 4. Nested Plans

- ถ้า workflow ที่เรียกมี sub-workflows ต้องทำ recursive ตาม `## Execute`
- ไม่ตีความ “ทำ `xxx`” เป็น concept — ต้องอ่านไฟล์และทำจริง

## Expected Outcome

- Plan ถูกโหลดและแยก steps ได้ครบถ้วน
- ทุก step ถูก execute ตามลำดับ
- Failures ถูกจัดการหรือรายงาน
- รายงานสรุปสถานะ plan ชัดเจน

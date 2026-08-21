---
name: skills-type-run
description: Template สำหรับ run-* skills execute commands
allowed-tools:
  - read
  - exec
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `run-*` skills ที่ execute commands พร้อม prerequisites check, error handling และ result reporting

## Scope

ใช้สำหรับ skills ที่รัน commands เช่น `run-build`, `run-test`, `run-lint`, `run-dev`, `run-deploy`

## Execute

### 1. Check Prerequisites

ตรวจสอบ prerequisites ก่อนรัน

> Goal: รันได้แน่น ไม่เสียเวลา fail จากของขาด

1. ตรวจสอบว่า target มีอยู่จริง (file, directory, package)
2. ตรวจสอบ dependencies, ตรวจสอบ tools ที่จำเป็น, ทำ `/run-check`
3. ถ้าขาด prerequisites → stop และ report พร้อมวิธีติดตั้ง
4. ทำ `/check-should-update` ถ้า target อาจเป็น stale

### 2. Execute Command

รัน command หลัก

> Goal: รัน command สำเร็จหรือได้ error ที่ชัดเจน

1. รัน command พร้อม timeout ที่เหมาะสม
2. ใช้ non-blocking สำหรับ long-running processes (dev server, watch mode)
3. ใช้ blocking สำหรับ short tasks (build, test, lint)
4. จับ output และ error แยกกัน
5. ถ้าเป็น monorepo → รันใน workspace ที่กำหนดเท่านั้น หรือใช้ turbo/bun filter

### 3. Handle Errors

จัดการ errors ถ้า command ล้มเหลว

> Goal: Error ถูก resolve หรือ report ด้วย root cause

1. ถ้ามี errors → ทำ `/resolve-errors`
2. ถ้า error เป็น dependency issue → ทำ `/run-install` แล้ว retry (max 1 ครั้ง)
3. ถ้า error เป็น config issue → ทำ `/follow-config`
4. ถ้า error ซ้ำ 3 ครั้ง → stop และ report พร้อม error log

### 4. Report Results

รายงานผลลัพธ์

> Goal: ผู้ใช้รู้ผลลัพธ์และ next action

1. สรุปผล: success/fail, duration, key metrics
2. ถ้าสำเร็จ → ทำ `/report-agents-session-status`, `/suggest-next-action`
3. ถ้ามี warnings → รายงานพร้อมคำแนะนำ
4. ถ้าเป็น watch mode → รายงาน errors ต่อเนื่องและ fix อัตโนมัติ

## Rules

### 1. Safety

- อย่ารัน commands ที่ destructive โดยไม่ confirm
- ใช้ `SafeToAutoRun` เฉพาะ commands ที่ปลอดภัย
- ถ้า command มี side effects → แจ้งผู้ใช้ก่อนรัน

### 2. Error Handling

- จับ error ทุกกรณี ไม่ปล่อยให้ crash
- แยกประเภท error: dependency, config, syntax, runtime
- ถ้า error ซ้ำ 3 ครั้ง → stop และ report

### 3. Output

- รายงานสั้นกระชับ เน้นผลลัพธ์และ next action
- ไม่ dump output ทั้งหมด — เฉพาะส่วนสำคัญ
- ถ้ามีตัวเลข (tests passed, coverage) → แสดง

## Expected Outcome

- Command รันสำเร็จหรือมี error report ที่ชัดเจน
- Errors ถูก resolve หรือมี root cause ระบุ
- ผู้ใช้รู้ผลลัพธ์และ next action

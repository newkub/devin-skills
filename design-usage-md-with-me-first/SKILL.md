---
name: design-usage-md-with-me-first
description: Draft USAGE-<workspace>.md กับ user ใน OS temp ก่อน — iterate จนตกลงแล้วค่อยเขียนจริง
argument-hint: "[workspace]"
related:
  - update-usage-md
  - update-docs
  - report-usage
  - ask-me
  - suggest-me
  - report
  - move-to
  - suggest-next-action
---

## Goal

ออกแบบและ draft `USAGE-<workspace>.md` กับ user ใน OS temp directory แบบ interactive — iterate จน user ตกลงก่อน แล้วค่อยส่งต่อ `/update-usage-md` เขียน `USAGE.md` จริงที่ workspace

## Scope

ใช้เมื่อต้องการลองวางโครง usage documentation ก่อนเขียนจริง — draft-first, user ใน loop ทุก iteration

- สร้าง `USAGE-<workspace>.md` ชั่วคราวใน `%TEMP%` เท่านั้น — ไม่แตะไฟล์จริงใน workspace
- โครงเนื้อหาตามมาตรฐาน `/update-usage-md` — code เป็น source of truth
- เริ่มจาก `/ask-me` และ `/suggest-me` เพื่อเข้าใจความต้องการ
- ไม่ commit — ต้อง user confirm ก่อนส่งต่อเขียนจริง

## Execute

### 1. Clarify Intent

> Goal: เข้าใจว่า USAGE doc ต้อง cover อะไร

1. ทำ `/suggest-me` ดูตัวเลือกทั่วไปสำหรับ usage docs (library API / CLI / service / internal tool)
2. ทำ `/ask-me` ถาม: audience (dev/ops/end-user), depth (quick-start vs full reference), sections พิเศษที่ต้องการ
3. สรุป requirements ด้วย `/report table` คอลัมน์: `No.`, `Requirement`, `Priority`

### 2. Detect Usage Surface

> Goal: ได้ API/CLI surface จริงจาก code

1. ทำตาม step 2 ของ `/update-usage-md` — อ่าน manifest, public API, bin targets, examples จาก code จริง
2. ห้ามเดา API — ทุก entry ต้องมาจาก code หรือ user ระบุชัด
3. ถ้ามี `USAGE.md` เดิม → ดึงเป็น baseline เปรียบเทียบ

### 3. Setup Temp Workspace

> Goal: draft อยู่ใน temp เท่านั้น

1. สร้าง temp dir `%TEMP%\usage-md-<workspace>-<timestamp>`
2. ไฟล์หลัก: `USAGE-<workspace>.md`
3. ถ้ามี existing temp → ถาม user ว่าล้างหรือใช้ต่อ

### 4. Draft Iterations

> Goal: ร่างไปทีละรอบจน user ตกลง

1. เขียน draft `USAGE-<workspace>.md` ด้วย sections มาตรฐาน: `## Overview`, `## Installation`, `## Usage`, `## API Reference`/`## Commands`, `## Examples`, `## Configuration`
2. แสดง diff/preview ใน chat ทุก iteration
3. ถาม feedback ผ่าน `/ask-me` — เก็บเป็น checklist ก่อนแก้
4. ปรับตาม feedback → ทำซ้ำจนตกลง
5. ถ้ามีหลายทางเลือก → ใช้ `/choose-and-apply`

### 5. Handoff

> Goal: draft ที่ตกลงไปสู่ไฟล์จริง

1. ทำ `/report table` สรุป: `No.`, `Section`, `Source`, `Status`
2. ถาม user: เขียน `USAGE.md` จริงที่ workspace เลยไหม
3. ถ้า confirm → ทำ `/update-usage-md` โดยใช้ draft เป็น spec หรือ `/move-to` ย้ายไฟล์
4. ทำ `/suggest-next-action`

## Rules

- draft อยู่ใน OS temp เท่านั้นจนกว่า user confirm
- เริ่มด้วย `/ask-me` และ `/suggest-me` เสมอ
- code เป็น source of truth — ห้ามเขียน API/commands ที่ไม่มีใน code (ยกเว้น user ระบุเป็น planned feature และ mark ชัด)
- ไม่ commit/push โดยอัตโนมัติ
- `<workspace>` ใน filename = ชื่อ directory/package จริงของ workspace
- ใช้ `/update-docs` ถ้าจำเป็น
- ใช้ `/report-usage` ถ้าจำเป็น


## Expected Outcome

- `USAGE-<workspace>.md` draft ใน temp ที่ user ตกลงแล้ว
- Feedback log พร้อม iterations
- Path สู่การเขียนจริงชัดเจน (`/update-usage-md` หรือ `/move-to`)

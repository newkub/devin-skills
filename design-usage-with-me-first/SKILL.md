---
name: design-usage-with-me-first
description: ออกแบบ USAGE.md กับ user ในแชทก่อนเขียนจริง — iterate จนตกลงแล้วส่งต่อ /update-usage-md
argument-hint: "[workspace]"
related:
  - update-usage-md
  - ask-me
  - suggest-me
  - choose-and-apply
  - report
  - suggest-next-action
  - update-docs
  - report-usage
---

## Goal

ออกแบบโครงและเนื้อหา `USAGE.md` ร่วมกับ user `ในแชทเท่านั้น` — iterate จน user ตกลงก่อน แล้วค่อยส่งต่อ `/update-usage-md` เขียน `USAGE.md` จริงที่ workspace

## Scope

ใช้เมื่อต้องการลองวางโครง usage documentation ก่อนเขียนจริง — discussion-first, user ใน loop ทุก iteration

- คุยและร่างในแชทเท่านั้น — `ห้ามสร้างไฟล์ใดๆ` (ไม่มี temp file, ไม่แตะ workspace) จนกว่า user confirm
- โครงเนื้อหาตามมาตรฐาน `/update-usage-md` — code เป็น source of truth
- เริ่มจาก `/ask-me` และ `/suggest-me` เพื่อเข้าใจความต้องการเสมอ
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
3. ถ้ามี `USAGE.md` เดิม → ดึงเป็น baseline เปรียบเทียบในแชท

### 3. Draft In Chat

> Goal: ร่างโครงและเนื้อหาในแชทจน user ตกลง — ไม่สร้างไฟล์

1. แสดง draft outline ในแชทด้วย sections มาตรฐาน: `## Overview`, `## Installation`, `## Usage`, `## API Reference`/`## Commands`, `## Examples`, `## Configuration`
2. ขยายเป็น full draft ในแชท (markdown block) ตาม requirements + code surface
3. ถาม feedback ผ่าน `/ask-me` — เก็บเป็น checklist ก่อนแก้
4. ปรับ draft ในแชทตาม feedback → ทำซ้ำจนตกลง — แสดง diff/ส่วนที่เปลี่ยนทุก iteration
5. ถ้ามีหลายทางเลือก → ใช้ `/choose-and-apply`

### 4. Handoff

> Goal: draft ที่ตกลงไปสู่ไฟล์จริง

1. ทำ `/report table` สรุป: `No.`, `Section`, `Source`, `Status`
2. ถาม user: เขียน `USAGE.md` จริงที่ workspace เลยไหม
3. ถ้า confirm → ทำ `/update-usage-md` โดยใช้ draft ในแชทเป็น spec
4. ทำ `/suggest-next-action`

## Rules

- คุยและร่างในแชทเท่านั้น — ห้ามสร้างไฟล์ใดๆ จนกว่า user confirm
- เริ่มด้วย `/ask-me` และ `/suggest-me` เสมอ
- code เป็น source of truth — ห้ามเขียน API/commands ที่ไม่มีใน code (ยกเว้น user ระบุเป็น planned feature และ mark ชัด)
- ไม่ commit/push โดยอัตโนมัติ
- ใช้ `/update-docs` ถ้าจำเป็น
- ใช้ `/report-usage` ถ้าจำเป็น

## Expected Outcome

- draft ในแชทที่ user ตกลงแล้ว — พร้อมเป็น spec สำหรับ `/update-usage-md`
- Feedback log พร้อม iterations
- Path สู่การเขียนจริงชัดเจน (`/update-usage-md`)

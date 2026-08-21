---
name: convert-my-global-cli-to-skills
description: แปลง global CLI tools ทีติดตั้งไว้เป็น Devin skills
triggers:
  - user
  - model
related:
  - follow-my-global-cli
  - report-my-global-cli
  - use-my-global-cli
  - convert-cli-to-skills
  - write-skills-md
---

## Goal

แปลง CLI tools ที่ติดตั้ง global บนเครื่อง user เป็น set ของ Devin skills

## Scope

ใช้หลังจาก `report-my-global-cli` เพื่อสร้าง skills สำหรับ commands ที่ใช้บ่อย

## Execute

### 1. Select Tool

1. ดูรายการจาก `report-my-global-cli`
2. เลือก 1 tool ต่อรอบ
3. ตรวจสอบว่า tool มี command ที่ซับซ้อนพอให้เป็น skill

### 2. List Commands

1. รัน `<tool> --help`
2. รัน `<tool> <command> --help` สำหรับ subcommands
3. บันทึก flags, arguments, examples, exit codes

### 3. Group Commands

1. รวม commands ที่เกี่ยวข้อง
2. แยก commands ที่ซับซ้อนออกเป็น skill เดียว
3. ตั้งชื่อ skill เป็น `<tool>-<command>`

### 4. Draft And Validate

1. ใช้ `/write-skills-md` สร้าง `SKILL.md`
2. ระบุ `allowed-tools`, `triggers`, `related`
3. ทำ `/validate` ก่อน finalize

## Rules

- 1 skill ต่อ 1 concern
- ใช้ชื่อ skill สะท้อน command
- ระบุ global installation ใน prerequisites
- ใช้ `related` เชื่อม skill ใน ecosystem เดียวกัน

## Expected Outcome

- มีชุด skills ครอบคลุม commands ของ tool
- ทุก skill ผ่าน validation
- References ถูกต้อง

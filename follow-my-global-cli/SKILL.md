---
name: follow-my-global-cli
description: Run installed global CLI tools correctly based on context and environment
---

## Goal

เรียก global CLI tools ที่ติดตั้งไว้ให้ถูกต้องตาม context

## Scope

ใช้เมื่อ user ต้องการรัน global tool เช่น `mise`, `bun`, `git`, `gh`, `kubectl`

## Execute

### 1. Detect Tool
> Goal: Detect Tool

1. ระบุ tool จาก user request หรือ context
2. ตรวจสอบว่า tool ติดตั้งด้วย `which`, `where`, หรือ `Get-Command`
3. ถ้าไม่มีให้ทำ `/follow-my-global-cli` หรือ `/install-*` ก่อน

### 2. Build Command
> Goal: Build Command

1. รวบรวม subcommand, flags, และ arguments
2. ใช้ตัวเลือกที่เหมาะสมกับ environment (Windows/PowerShell/macOS/Linux)
3. validate ว่า command ไม่ dangerous

### 3. Execute
> Goal: Execute

1. รันผ่าน `exec` หรือ MCP ที่เหมาะสม
2. capture output ด้วย `get_output` ถ้ารัน background
3. ตรวจสอบ exit code

### 4. Report
> Goal: Report

1. สรุปผลลัพธ์กระชับ
2. ถ้ามี error ให้วิเคราะห์และแนะนำแก้ไข
3. เสนอ next action ถ้าจำเป็น

## Rules

- ตรวจสอบว่า command ไม่ destructive ก่อนรัน
- ใช้ absolute path ถ้า tool ไม่อยู่ใน PATH
- หลีกเลี่ยง secret ใน command line
- ถ้าไม่แน่ใจให้ถาม user ก่อน

## Expected Outcome

- CLI command รันได้ตามที่ขอ
- Output/result สรุปถูกต้อง
- ไม่เกิด side effect ที่ไม่ต้องการ

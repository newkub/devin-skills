---
name: list-devin-global-hooks
description: List global and project-level devin hooks from common config paths
---

## Goal

แสดงรายการ global hooks ที่ตั้งค่าไว้สำหรับ devin จาก config paths ทั่วไป

## Scope

- ค้นหา hook configs ใน global paths
- ค้นหา hook configs ใน project `.devin/hooks/`
- รายงาน hook names, events, และ commands
- รองรับรูปแบบ JSON, YAML, และ TypeScript

## Execute

### 1. Search Hook Configs

> Goal: หาไฟล์ hook ที่มีอยู่

1. ค้นหาใน global paths:
   - `C:\Users\Veerapong\.config\devin\hooks.json`
   - `C:\Users\Veerapong\.config\devin\hooks.yaml`
   - `C:\Users\Veerapong\.codeium\windsurf\hooks.json`
   - `C:\Users\Veerapong\.codeium\windsurf\hooks.yaml`
2. ค้นหาใน project:
   - `.devin/hooks/*.ts`
   - `.devin/hooks/*.js`
   - `.devin/hooks/*.json`
   - `.devin/hooks.yaml`
3. ถ้าไม่พบ → ระบุว่าไม่มี hooks ตั้งค่า

### 2. Parse Hooks

> Goal: อ่านและแยกรายละเอียด

1. ถ้าเป็น JSON/YAML → ใช้ `read` แล้ว parse
2. ถ้าเป็น TypeScript/JavaScript → ใช้ `read` และวิเคราะห์ event mapping
3. ระบุแต่ละ hook:
   - `event` (เช่น `user-prompt-submit`, `tool-call`, `session-start`)
   - `command` หรือ `script`
   - `enabled`

### 3. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ตรวจ JSON/YAML syntax
2. ตรวจ event ที่รองรับ
3. ตรวจ command path มีอยู่จริง
4. บันทึก hooks ที่ไม่ถูกต้อง

### 4. Report

> Goal: สรุปผล

1. ทำ `/report-markdown-table` แสดง path, event, command, enabled
2. ถ้าไม่มี hooks → report ว่าไม่มี global hooks ตั้งค่า
3. ทำ `/suggest-next-action` ถ้าต้องแก้ไขหรือสร้าง

## Rules

### 1. Read-Only

- ไม่แก้ไข hook config
- ถ้าต้องแก้ → ใช้ `/edit-devin-global-hooks` หรือแก้ไฟล์โดยตรงตาม permission

### 2. Scope

- ตรวจทั้ง global และ project hooks
- ถ้า project ไม่มี `.devin/hooks/` → ระบุ global only

### 3. Privacy

- ไม่ expose secrets หรือ sensitive commands
- ถ้า hook command มี token → redact

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ paths, events, commands
- รายงานเป็นตารางด้วย `/report-markdown-table`

## Expected Outcome

- รายการ hooks ทั้งหมดที่ตั้งค่าไว้
- รายละเอียด event, command, path
- รายงาน hooks ที่ไม่ถูกต้อง
- รายงานในรูปแบบตารางพร้อม action ถัดไป

---
name: capture
description: Capture หลักฐานภาพ/วิดีโอ — component, web page, terminal หรือ app screenshot
argument-hint: "<web|component|terminal|app> [target]"
related:
  - capture-bug-context

---

## Goal

Capture ภาพหรือวิดีโอหลักฐานตาม target ที่ระบุ — หน้าเว็บ, component, terminal output หรือ app window — สำหรับ documentation, debugging และ testing

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: capture-web, capture-component, capture-terminal, capture-image-app-to-screenshot)
- `web` → screenshot/PDF หน้าเว็บด้วย `agent-browser` CLI
- `component` → capture UI component เฉพาะส่วน
- `terminal` → บันทึก terminal output/session
- `app` → screenshot หน้าต่าง app ที่รันอยู่

## Execute

### 1. Select Target

> Goal: ระบุ capture target และ tool

1. อ่าน target type จาก argument — ถ้าไม่ระบุ → ถาม user
2. เลือก tool ตาม target:
   - `web`/`component` → `agent-browser` CLI (ดู `references/` ที่ merge มา)
   - `terminal` → terminal capture ตาม OS
   - `app` → OS screenshot tool

### 2. Capture

> Goal: ได้ภาพ/วิดีโอตาม target

1. เตรียม target: เปิด URL/app/terminal ที่ต้องการ
2. Capture ตาม tool ที่เลือก พร้อมตั้งชื่อไฟล์สื่อความหมาย
3. บันทึกไปที่ตำแหน่งที่เหมาะสม (`docs/`, `screenshots/` หรือตาม context)

### 3. Verify And Report

> Goal: ภาพใช้ได้จริงและถูกอ้างถึง

1. ตรวจว่าไฟล์สร้างสำเร็จและไม่ว่าง
2. รายงาน path และขนาดไฟล์
3. ถ้าใช้เป็น bug evidence → ผูกกับ `/capture-bug-context`

## Rules

- ตั้งชื่อไฟล์สื่อความหมาย มีวันที่ถ้าเป็น evidence
- ไม่ capture หน้าจอที่มี secrets/credentials โดยไม่จำเป็น
- แจ้ง path ของไฟล์ที่ capture เสมอ

## Expected Outcome

- ไฟล์ภาพ/วิดีโอหลักฐานพร้อมใช้ ตาม target ที่ระบุ

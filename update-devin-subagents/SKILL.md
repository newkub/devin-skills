---
name: update-devin-subagents
description: อัปเดต subagent ที่มีอยู่ใน devin agents repo ตามมาตรฐาน AGENT.md
---

## Goal

อัปเดต subagent ที่มีอยู่ใน `%APPDATA%\devin\agents` ให้ตรงมาตรฐาน `AGENT.md` โดยไม่ทำลายของเดิม

## Scope

ใช้เมื่อต้องแก้ไข `AGENT.md` ของ subagent ที่มีอยู่ เช่น เพิ่ม tools, เปลี่ยน model, แก้ description, ปรับ Execute steps

## Execute

### 1. Identify Target Subagent

> Goal: ระบุ subagent ที่ต้องอัปเดต

1. รับชื่อ subagent ที่ต้องอัปเดตจาก user
2. ทำ `/list-devin-subagents` เพื่อยืนยันว่า subagent มีอยู่จริง
3. ถ้าไม่พบ → สร้าง subagent ใหม่ตาม `?follow-devin-subagents/templates/` หรือใช้ `/follow-devin-subagents`
4. อ่าน `AGENT.md` เดิมเพื่อทำความเข้าใจ

### 2. Identify Changes

> Goal: ระบุสิ่งที่ต้องเปลี่ยน

1. รับรายการการเปลี่ยนแปลงจาก user
2. ระบุว่าเป็นการเปลี่ยน: frontmatter, prompt body, หรือทั้งสองส่วน
3. ถ้าไม่ชัด → ทำ `/ask-me`

### 3. Apply Changes

> Goal: แก้ไข `AGENT.md`

1. สำรองไฟล์เดิมถ้าจำเป็น
2. แก้ไข frontmatter ตามที่กำหนด
3. แก้ไข prompt body ตามที่กำหนด
4. รักษาโครงสร้าง 5 sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
5. ใช้ backticks สำหรับ `tools`, `commands`, `file paths`

### 4. Validate

> Goal: ตรวจสอบคุณภาพ

1. ตรวจสอบว่า `AGENT.md` ไม่เกิน 250 บรรทัด
2. ตรวจสอบว่า frontmatter มี `name`, `description`, `model`, `allowed-tools` ครบ
3. ตรวจสอบว่า prompt body มี 5 sections ครบ
4. ตรวจสอบว่าไม่มี TODO/MOCK/placeholder
5. ทำ `/validate` ถ้ามี

### 5. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Target Location

- อัปเดต subagent ใน `%APPDATA%\devin\agents`
- ห้ามเปลี่ยน directory name ถ้าไม่ได้รับอนุญาต
- ถ้าเปลี่ยน directory name → อัปเดต `name` ใน frontmatter ให้ตรง

### 2. Preserve Existing

- รักษาส่วนที่ไม่เกี่ยวข้องกับการเปลี่ยนแปลง
- ไม่ทำลาย `allowed-tools` หรือ `permissions` เดิม ถ้าไม่ได้ระบุให้ลบ
- รักษาโครงสร้าง 5 sections

### 3. Safety

- สำรองไฟล์เดิมก่อนแก้ไขถ้าการเปลี่ยนแปลงใหญ่
- ถ้ามีการ overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย subagents อื่น

### 4. Content Standard

- `description` ไม่เกิน 100 ตัวอักษร
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`
- ไม่เกิน 250 บรรทัด

## Expected Outcome

- subagent ที่อัปเดตถูกต้องตามมาตรฐาน `AGENT.md`
- การเปลี่ยนแปลง minimal และตรงตามที่กำหนด
- `AGENT.md` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- frontmatter ครบ: `name`, `description`, `model`, `allowed-tools`
- prompt body มี 5 sections ครบ
- ส่วนที่ไม่เกี่ยวข้องยังเหมือนเดิม

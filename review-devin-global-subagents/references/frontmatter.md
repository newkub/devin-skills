---
title: Frontmatter Validation
description: กฎตรวจสอบ frontmatter ของ subagent
---

# Frontmatter Validation

## Required Fields

ตรวจว่า frontmatter มี fields ครบทั้ง 4 ตัว:

1. `name` — ชื่อ subagent ต้องตรงกับ directory name
2. `description` — คำอธิบายสั้น ไม่เกิน 100 ตัวอักษร
3. `model` — ระบุ model ที่ใช้
4. `allowed-tools` — รายการ tools ที่อนุญาต

## Validation Rules

### Name

- ต้องตรงกับ directory name ของ subagent
- ใช้ lowercase และ kebab-case
- ห้ามมี space หรืออักขระพิเศษ

### Description

- ความยาวไม่เกิน 100 ตัวอักษร
- อธิบายหน้าที่ของ subagent ชัดเจน
- ภาษาไทยหรืออังกฤษก็ได้

### Model

- ต้องระบุ model ที่รองรับ
- ห้ามเว้นว่าง

### Allowed-Tools

- ต้องระบุ tools ที่ subagent ใช้
- ใช้ backticks สำหรับ tool names
- ต้องเหมาะสมกับ scope ของ subagent

### Permissions

- ต้องมี `permissions` section
- ต้องระบุ `deny` สำหรับ system paths ที่เสี่ยง
- ดู `references/safety.md` สำหรับ risky paths เพิ่มเติม

## Severity Mapping

| Finding | Severity |
|---|---|
| ขาด `name`, `description`, `model`, `allowed-tools` | Critical |
| `name` ไม่ตรง directory | Critical |
| `description` เกิน 100 ตัวอักษร | Low |
| ขาด `permissions` หรือ `deny` | High |

## Evidence Format

บันทึก finding พร้อม:

- file path ของ `AGENT.md`
- field ที่มีปัญหา
- ค่าจริงที่พบ
- action ที่แนะนำ

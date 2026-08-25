---
title: Style Conventions
description: กฎตรวจสอบ style conventions ของ AGENT.md
---

# Style Conventions

## Backticks

ใช้ backticks สำหรับ:

- `tools` — tool names เช่น `grep`, `edit`
- `commands` — command names เช่น `/list-devin-subagents`
- `file paths` — paths เช่น `AGENT.md`
- `skill names` — skill names เช่น `update-devin-subagents`

### Rules

- ห้ามใช้ backticks กับ prose ทั่วไป
- ใช้ backticks เฉพาะ identifiers เท่านั้น

## Bold Markers

- ห้ามใช้ `**` bold markers ทั้งหมด
- ใช้ backticks สำหรับ emphasis แทน bold
- ถ้าพบ `**` → flag เป็น Medium

## Heading Format

### English Headings

- ใช้ Title Case เช่น `## Check Frontmatter`
- ห้ามใช้ ALL CAPS หรือ all lowercase
- ถ้าพบ heading ไม่ Title Case → flag เป็น Low

### Thai Content

- เนื้อหาภาษาไทยใช้ปกติ
- heading ที่เป็นภาษาอังกฤษต้อง Title Case เท่านั้น

## Severity Mapping

| Finding | Severity |
|---|---|
| ไม่ใช้ backticks สำหรับ `tools`/`commands`/`paths` | Medium |
| ใช้ `**` bold markers | Medium |
| heading ไม่ Title Case | Low |

## Evidence Format

บันทึก finding พร้อม:

- file path ของ `AGENT.md`
- line number ที่พบ
- เนื้อหาที่ผิด
- สิ่งที่ควรแก้เป็นอย่างไร

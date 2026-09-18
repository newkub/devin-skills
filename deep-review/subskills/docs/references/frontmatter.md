# Frontmatter Check

ตรวจ frontmatter ในทุก markdown ไฟล์ใน `docs/`

## Required Fields

- `title` — Page title ใช้ Title Case
- `description` — Short description ไม่เกิน 120 ตัวอักษร

## Validation Rules

1. ทุก markdown ไฟล์ต้องมี frontmatter block `---`
2. `title` ต้องเป็น Title Case (English)
3. `description` ต้องไม่เกิน 120 ตัวอักษร
4. ห้ามใช้ `**` bold markers ใน frontmatter

## Example

```yaml
---
title: Getting Started
description: ขั้นตอนติดตั้งและเริ่มใช้งาน project
---
```

## Scoring

- High: ขาด frontmatter, ขาด `title` หรือ `description`
- Medium: `description` เกิน 120 ตัวอักษร
- Low: `title` ไม่ Title Case

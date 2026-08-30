---
name: check-conflicts
description: ตรวจสอบความขัดแย้งของชื่อ
---

# Check Conflicts

## Goal

ตรวจสอบความขัดแย้งของชื่อ

## Checks

1. ตรวจสอบว่าไม่ซ้ำกับ existing skills หรือ reserved words
2. ตรวจสอบว่าไม่มี shadowing ระหว่าง nested scopes
3. ตรวจสอบว่า file name ตรงกับ content หรือ main export
4. ตรวจสอบว่า directory name ตรงกับ skill `name` ใน frontmatter

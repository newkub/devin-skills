---
name: check-structure-consistency
description: ตรวจสอบโครงสร้าง skill files
---

# Check Structure Consistency

## Goal

ตรวจสอบโครงสร้าง skill files

## Checks

1. ตรวจสอบลำดับ sections (`## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`)
2. ตรวจสอบ frontmatter มี `name`, `description`, และ `description` ไม่เกิน 100 ตัวอักษร
3. ตรวจสอบ Execute headings เป็น English Title Case และรายการภาษาไทย
4. ตรวจสอบไฟล์ไม่เกิน 250 บรรทัด


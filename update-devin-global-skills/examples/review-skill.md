# Example: review Skill

ตัวอย่าง skill แบบสั้น สำหรับ review staged changes

```markdown
---
name: review
description: Review staged changes for issues
argument-hint: "[file]"
allowed-tools: [read, grep, find_file_by_name, exec]
permissions: { allow: [Exec(git diff), Exec(git log)] }
triggers: [user]
---
## Goal
Review the current git diff and provide feedback

## Scope
ใช้ก่อน commit เพื่อตรวจสอบความถูกต้อง

## Execute
### 1. Get Diff

> Goal: รู้สิ่งที่เปลี่ยนแปลง
1. รัน `git diff --staged` หรือ `git diff` ถ้ายังไม่ได้ stage. บันทึก files ที่เปลี่ยน

### 2. Review Changes

> Goal: หาปัญหาที่อาจเกิดขึ้น
1. ตรวจ logic errors, security issues, style inconsistencies. สรุป findings พร้อม line references

## Rules
### 1. Review Focus
- ตรวจ correctness, security, performance, style. ให้ specific line references. ไม่แก้ source โดยไม่ได้รับอนุญาต

## Expected Outcome
- สรุป findings พร้อม specific line references. แนะนำ improvements ที่ actionable
```
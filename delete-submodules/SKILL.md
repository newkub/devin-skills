---
name: delete-submodules
description: Steps to delete a git submodule
---

## Goal

ลบ Submodules

## Scope

ใช้ `delete-submodules` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

1. เข้า folder submodules
2. ลบออกจาก .gitmodules และถ้าในนั้นเหลือเป็นอันสุดท้ายให้ลบ .gitmodule
3. cd .git/modules/ และลบ module นั้นๆ
5. git gc

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

Completed `delete-submodules` workflow with correct output

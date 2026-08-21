---
name: delete-submodules
description: Steps to delete a git submodule
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---
## Goal

Delete Submodules

## Scope

Use `delete-submodules` for the specific tasks and workflows it covers

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

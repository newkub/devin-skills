---
name: search-by-astgrep
description: (merged into /use-astgrep) ค้นหา code patterns ด้วย ast-grep โดยใช้ AST-based patterns
argument-hint: "[pattern]"
related:
  - use-astgrep
  - use-astgrep-programmatic
  - replace
---

## Goal

ค้นหา code patterns ด้วย `ast-grep` โดยใช้ AST-based patterns ที่แม่นยำกว่า regex

## Scope

ทำงานนี้ผ่าน `/use-astgrep` ได้เลย ตั้งแต่ทีถูก merge เข้าด้วยกัน ใช้สำหรับ one-off search บน codebase โดยไม่ต้องตั้งค่า `sgconfig.yml`

## Execute

### 1. Redirect

> Goal: ใช้ `/use-astgrep` แทน

1. ทำ `/use-astgrep` แล้วเลือก mode ตาม use case
2. สำหรับ ad-hoc search ดู Step 5 "Scan And Run" ใน `/use-astgrep`
3. ถ้าต้องการ batch/integrate ใน scripts → ทำ `/use-astgrep-programmatic`
4. ถ้าต้องการ rewrite → ทำ `/replace`

## Rules

- ใช้ `/use-astgrep` เป็น entry หลักสำหรับ ast-grep
- ไม่ต้องสร้าง `sgconfig.yml` สำหรับ ad-hoc search
- ถ้าต้องการ reusable rules → ทำ `/update-project-rules`
- ถ้า pattern ซับซ้อน → ทำ `/use-astgrep-programmatic`

## Expected Outcome

- ได้รายการ matches ครบถ้วนพร้อม `file`, `line`, `snippet`
- pattern ที่ใช้ถูกต้องและสามารถนำไป reuse ได้
- ไม่มี broken syntax หรือ invalid ast-grep pattern

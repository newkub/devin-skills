---
name: deep-analyze-by-use-scripts
description: (merged into /deep-analyze) วิเคราะห์ codebase ลึกด้วย scripts และ CLI
argument-hint: "[scope]"
related:
  - deep-analyze
  - use-scripts
  - use-astgrep-programmatic
  - follow-create-cli
---

## Goal

วิเคราะห์ codebase อย่างลึกซึ้งด้วย `tools/review-codebase` CLI, `tools/analyze` CLI, `@ast-grep/napi` และ scripts

## Scope

ทำงานนี้ผ่าน `/deep-analyze` ได้เลย ตั้งแต่ทีถูก merge เข้าด้วยกัน ดู Step 2 "Quick Scan Phase" และ Step 6 "Code Quality Analysis" ใน `/deep-analyze`

## Execute

### 1. Redirect

> Goal: ใช้ `/deep-analyze` และ sub-skills แทน

1. ทำ `/deep-analyze` แทน
2. ถ้าต้องการ custom scripts → ทำ `/use-scripts`
3. ถ้าต้องการ AST analysis ใน scripts → ทำ `/use-astgrep-programmatic`
4. ถ้าต้องการสร้าง `tools/analyze` → ทำ `/follow-create-cli`

## Rules

- ใช้ `/deep-analyze` เป็น entry หลัก
- ใช้ `/use-scripts` สำหรับ metrics calculation และ complex processing
- ใช้ `/use-astgrep-programmatic` สำหรับ AST analysis ใน scripts

## Expected Outcome

- Review CLI JSON report พร้อม metrics
- `tools/analyze` CLI พร้อมใช้งาน
- Structural overview ด้วย `ast-grep outline`
- Deep report 7 columns พร้อม evidence

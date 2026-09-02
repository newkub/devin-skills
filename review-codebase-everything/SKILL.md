---
name: review-codebase-everything
description: (Deprecated) เนื้อหา CLI-driven review ถูก merge เข้า /deep-review-codebase
allowed-tools:
  - read
  - write
  - edit
  - grep
  - skill
related:
  - deep-review
  - deep-review-codebase
  - run-review
  - update-create-analyze-cli
triggers:
  - user
  - model
---

## Goal

เนื้อหาและ 10 ขั้นตอนของ `tools/review-codebase` CLI ถูก merge เข้า `/deep-review-codebase` Step 3.5 และ `deep-review/references/cli-review-steps.md` แล้ว

## Scope

ใช้สำหรับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase` CLI แต่ไม่ควรใช้ skill นี้โดยตรงสำหรับงานใหม่

## Execute

1. ถ้าต้องการ review แบบ comprehensive ให้ใช้ `/deep-review` หรือ `/deep-review-codebase` โดยตรง
2. ถ้าต้องการรายละเอียด 10 ขั้นตอน CLI review ให้อ่าน `deep-review/references/cli-review-steps.md`
3. ถ้าต้องการ extra checklists ให้อ่าน `review-codebase-everything/references/`

## Rules

- ไม่ใช้ skill นี้โดยตรงสำหรับ workflow ใหม่ — ใช้ `/deep-review-codebase` แทน
- ถ้า skill อื่นอ้างอิง `/review-codebase-everything` Step X ให้ map ไปยัง `/deep-review-codebase` Step 3.5 และ `deep-review/references/cli-review-steps.md`
- `tools/review-codebase` ยังคงสร้างที่ project root เท่านั้น

## Expected Outcome

- ไม่มี duplicate workflow ระหว่าง `review-codebase-everything` กับ `/deep-review-codebase`
- CLI-driven review ถูก merge เข้า `/deep-review-codebase` เป็นหลัก

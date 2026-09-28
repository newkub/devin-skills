---
name: review-devin-global-harness-check-hooks
description: Check hooks layer — trigger events, command existence, no loops, non-blocking
argument-hint: "[all]"
related:
  - update-devin
  - report
---

## Goal

Run the `hooks` layer of `/review-devin-global-harness` แบบ focused — hooks config trigger ถูก event ไม่ block workflow

## Scope

- ใช้เมื่อ `/review-devin-global-harness` dispatch มาที่ `hooks` หรือเรียก standalone
- ไม่มี script — manual เท่านั้น

## Execute

### 1. Hooks Checks

> Goal: ครอบคลุมทุก hooks dimension

ทำตาม `../../references/hooks.md`

1. trigger event ถูกต้อง — hook ไม่ fire ผิดจังหวะ
2. command path มีจริง — script/binary ที่ hook เรียก exists และ executable
3. ไม่ infinite loop — hook ที่ trigger ตัวเองหรือกันและกัน
4. ไม่ duplicate hooks — event เดียวกัน hook ซ้ำหลายตัว
5. ไม่ block workflow — hook ที่ช้า/ล้มเหลวไม่ควรหยุดงานหลักทั้งหมด

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Hook`, `Category`, `Severity`, `Finding`, `Evidence`, `Action`

## Rules

- Review เท่านั้น ไม่แก้ไข hooks config ระหว่าง check
- ทุก finding มี config location + evidence
- broken command path / infinite loop = High; style issues = Low

## Expected Outcome

- Hooks findings แยกตาม category (trigger, command, loop, duplicate, blocking)
- Dead hooks identified พร้อม action

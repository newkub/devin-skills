---
name: resolve-errors-verify-resolved
description: ยืนยัน errors หายจริง — re-run command เดิม, ไม่มี error ใหม่, ไม่มี ignore patterns
argument-hint: "[original-command-or-scope]"
related:
  - run-until-pass
  - run-check
  - report
---

## Goal

ยืนยันหลัง `/resolve-errors` ว่า error หายจริงและ fix ไม่สร้าง side effects — เรียก standalone เมื่อต้อง re-verify resolution

## Scope

- ใช้เมื่อ parent dispatch มาที่ `verify` หรือเรียกหลัง fix เสร็จ
- ครอบคลุม: original error gone, no new errors, no suppression, tests still green
- Read-only: ตรวจสอบ — ไม่แก้ไข

## Execute

### 1. Re-Run Original Command

> Goal: error เดิมหายจริง

1. รัน command เดียวกับที่ทำให้เกิด error — output ต้อง clean
2. ถ้า error เดิมยังอยู่ → verdict `not-resolved` report ทันที
3. เปรียบเทียบ output กับ error capture เดิม — errors ที่ claim fixed ต้องหายทั้งหมด

### 2. Check For Side Effects

> Goal: fix ไม่พังอย่างอื่น

1. รัน `bun run check` (lint + typecheck + scan) หรือเทียบเท่า
2. รัน tests ที่เกี่ยวข้อง — ไม่มี test ที่เคยผ่าน fail
3. ตรวจไม่มี warning/error ใหม่ในไฟล์อื่น

### 3. Check No Suppression

> Goal: fix แก้ที่ source ไม่ใช่ suppress

1. `rg '(biome-ignore|ts-ignore|ts-nocheck|type: ignore|eslint-disable)'` ใน diff ของ fix
2. flag ignore comments ที่เพิ่มมาจาก fix นี้ — ถ้าพบ verdict `suppressed` ไม่ใช่ resolved

### 4. Report

> Goal: สรุป resolution status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `resolved` / `not-resolved` / `suppressed` / `regressed`

## Rules

- `resolved` เมื่อ original command clean + ไม่มี side effects + ไม่มี suppression เท่านั้น
- ถ้า `not-resolved`/`regressed` → report กลับให้ `/resolve-errors` loop ต่อ — ไม่แก้เอง
- ใช้ `/run-until-pass` ถ้าต้องรันซ้ำจน stable (flaky checks)

## Expected Outcome

- Verdict ชัดเจนว่า resolution สำเร็จจริงหรือไม่ พร้อม evidence

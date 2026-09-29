---
name: review-devin-global-harness-check-mcp
description: Check MCP layer — server config, enabled, env vars, no duplicates, no dead config
argument-hint: "[server-name|all]"
related:
  - update-devin
  - report
---

## Goal

Run the `mcp` layer of `/review-devin-global-harness` แบบ focused — MCP server configs ใช้งานจริง ไม่ซ้ำ ไม่ตาย

## Scope

- ใช้เมื่อ `/review-devin-global-harness` dispatch มาที่ `mcp` หรือเรียก standalone
- ไม่มี script — manual เท่านั้น

## Execute

### 1. MCP Checks

> Goal: ครอบคลุมทุก MCP dimension

ทำตาม `../../SKILL.md` (`## Checklists → Mcp`)

1. enabled — server ที่ config ไว้ยังใช้งานจริง, disabled ที่ควรลบ
2. env vars ครบ — required env มีจริง ไม่ missing
3. ไม่ซ้ำ server — server เดียวกัน config ซ้ำหลายที่
4. tool names ไม่ชน — overlapping tool names ระหว่าง servers
5. ไม่ dead config — server ที่ไม่มีใน runtime หรือ package ถูกลบไปแล้ว

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Server`, `Category`, `Severity`, `Finding`, `Evidence`, `Action`

## Rules

- Review เท่านั้น ไม่แก้ไข MCP config ระหว่าง check
- ทุก finding มี config location + evidence
- ห้าม log/คัดลอก secrets จาก env config เข้า report — ระบุแค่ missing/present

## Expected Outcome

- Per-server findings พร้อม severity
- Dead/duplicate configs identified พร้อม action

---
name: review-mcp
description: Review MCP servers — tool naming, descriptions, input schemas, safety annotations, config, auth
argument-hint: "[scope]"
related:
  - review-api
  - review-security
  - review-config
  - follow-create-mcp
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review MCP (Model Context Protocol) servers — tool surface design, input schemas, descriptions, safety annotations, auth/config hygiene — report-only

## Scope

ใช้เมื่อ project มี MCP server (custom server หรือ MCP config) — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

## Execute

### 1. Inventory MCP Surface

> Goal: รู้ว่ามี servers/tools/resources อะไรบ้าง

1. ตรวจ MCP configs (`.devin/`, `mcp.json`, client configs) — installed servers, transports, env
2. list tools/resources/prompts แต่ละ server expose — ตาราง inventory

### 2. Check Tool Design

> Goal: tool surface ใช้งานได้และชัดเจน

1. naming: `verb-noun` consistent, ไม่ชนกัน, scope ชัด
2. descriptions: action + params + return ชัดเจน, ไม่มี vague docs
3. input schemas: types ถูก, required/optional สมเหตุ, enums/defaults ครบ
4. output format: structured, errors เป็น tool errors ไม่ใช่ text dumps

### 3. Check Safety And Auth

> Goal: ไม่มี destructive/secret surface ที่ไม่ปลอดภัย

1. destructive tools → confirmation/dry-run guard
2. secrets/credentials ใน config → env refs เท่านั้น ห้าม inline
3. scope/permissions — least privilege ต่อ tool
4. unsafe input → validation ที่ boundary ก่อน execute

### 4. Check Config And Docs

> Goal: install/ใช้งานได้จริง

1. server config valid — command/args/env ตรง runtime จริง
2. docs: setup instructions, examples, version pinning
3. health/liveness — tools list ได้, errors สื่อสารชัด

### 5. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ server/tool พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /review-api สำหรับ API surface conventions
- ใช้ /review-config สำหรับ config/env hygiene deep-dive
- ใช้ /review-security สำหรับ auth/secrets deep-dive
- ใช้ /follow-create-mcp เป็น implementation reference

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. tool naming/descriptions → consistent + documented
2. schemas → types/enums/defaults ครบ + validation
3. safety → confirmation guards, least privilege, secrets ย้าย env
4. verify: `list tools` ผ่าน + tool calls จริงทำงาน

## Expected Outcome

- MCP surface inventory ครบ — servers/tools/resources
- design/safety/config findings พร้อม severity + evidence

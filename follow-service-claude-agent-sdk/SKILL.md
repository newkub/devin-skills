---
name: follow-service-claude-agent-sdk
description: ใช้ @anthropic-ai/claude-agent-sdk สร้าง AI agents — query, tools, MCP, sessions
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ @anthropic-ai/claude-agent-sdk สร้าง AI agents — query, tools, MCP, sessions

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (service claude agent sdk)

## Execute

### Subskills

| Topic  | Subskill |
|--------|----------|
| Setup  | `subskills/setup-claude-agent-sdk/SKILL.md` — SDK install, `ANTHROPIC_API_KEY` |
| Config | `subskills/config-claude-agent-sdk/SKILL.md` — model, tools, permissions, sessions config |
| Verify | `subskills/verify-connection/SKILL.md` — API key valid, minimal query ตอบกลับ |

อ่าน `subskills/<name>/SKILL.md` ตาม topic แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

Latest: `@anthropic-ai/claude-agent-sdk@0.3.273` (verified 2026-09-16) — renamed จาก `claude-code` SDK, entry point คือ `query()`

1. ใช้ `query()` function เป็น entry point — streaming async iterator
1. กำหนด `options`: model, allowedTools, mcpServers, systemPrompt
1. ใช้ `tool()` + `createSdkMcpServer` สำหรับ in-process custom tools
1. จัดการ sessions ด้วย `sessionId`/`resume` สำหรับ multi-turn

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (service claude agent sdk)

## Rules

- ต้องการ ANTHROPIC_API_KEY ใน env — ห้าม hardcode
- control tools ด้วย `allowedTools`/`disallowedTools` explicitly
- ทำงานฝั่ง server เท่านั้น — ห้าม bundle เข้า client
- set `maxTurns`/`permissionMode` เหมาะสมกับ use case

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (service claude agent sdk)
- ไม่มี security/performance pitfalls ที่รู้จัก (service claude agent sdk)
- Lint, typecheck, tests ผ่าน
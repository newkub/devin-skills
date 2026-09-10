---
name: follow-service-claude-agent-sdk
description: ใช้ @anthropic-ai/claude-agent-sdk สร้าง AI agents — query, tools, MCP, sessions
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ @anthropic-ai/claude-agent-sdk สร้าง AI agents — query, tools, MCP, sessions

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (service claude agent sdk)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `query()` function เป็น entry point — streaming async iterator
1. กำหนด `options`: model, allowedTools, mcpServers, systemPrompt
1. ใช้ `tool()` + `createSdkMcpServer` สำหรับ in-process custom tools
1. จัดการ sessions ด้วย `sessionId`/`resume` สำหรับ multi-turn

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
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
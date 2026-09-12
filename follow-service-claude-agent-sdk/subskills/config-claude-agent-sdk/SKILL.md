---
name: follow-service-claude-agent-sdk-config-claude-agent-sdk
description: ตั้งค่า model, tools, permissions และ sessions ของ claude-agent-sdk
argument-hint: "[target-or-scope]"
related:
  - follow-secret-manager
  - check-config-drift
  - run-verify
  - run-test
---

## Goal

ตั้งค่า/แก้ไข `query()` options ของ `@anthropic-ai/claude-agent-sdk` — model, tools, permissions, MCP servers และ sessions — โดย merge กับ config เดิม

## Scope

- ครอบคลุม `options` object, custom tools (`tool()` + `createSdkMcpServer`) และ session resume
- ถ้ายังไม่ได้ install/API key → ทำ `subskills/setup-claude-agent-sdk/SKILL.md` ก่อน

## Execute

### 1. Read Current Config

> Goal: รู้ options ปัจจุบันก่อนแก้

1. อ่าน call sites ของ `query()` และ options ที่ส่งอยู่
2. ทำ `/check-config-drift` ถ้ามี config แยกในไฟล์อื่น
3. ถ้าไม่พบ `query()` → ทำ `subskills/setup-claude-agent-sdk/SKILL.md` ก่อน

### 2. Configure Model And Prompt

> Goal: model/system prompt ตรง use case

1. ระบุ `options.model` ตาม use case — ตรวจชื่อ model ล่าสุดจาก official docs ก่อนใช้
2. ตั้ง `options.systemPrompt` สำหรับ behavior ของ agent
3. ตั้ง `options.maxTurns` และ `options.cwd` ให้เหมาะกับงาน

### 3. Configure Tools And Permissions

> Goal: agent เข้าถึงเฉพาะ tools ที่ต้องการ

1. กำหนด `allowedTools`/`disallowedTools` explicitly — ห้ามเปิดทุก tool โดยไม่จำเป็น
2. ตั้ง `permissionMode` ให้ตรง use case (`default`, `acceptEdits`, `bypassPermissions` ฯลฯ — ดู official docs)
3. custom tools → ใช้ `tool()` + `createSdkMcpServer` แล้วส่งผ่าน `options.mcpServers`
4. external MCP servers → ระบุใน `options.mcpServers` ตาม schema ของ SDK

### 4. Configure Sessions

> Goal: multi-turn conversation ทำงานถูกต้อง

1. ใช้ `sessionId`/`resume` ใน options สำหรับ resume session เดิม
2. จัดการ session lifecycle — เก็บ session id ต่อ user/conversation

### 5. Verify

> Goal: config ทำงานกับ agent จริง

1. รัน `query()` ทดสอบกับ options ใหม่ — ตรวจ tools ถูก allow/deny ตามที่ตั้ง
2. ทำ `/run-verify` และ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

## Rules

- control tools ด้วย `allowedTools`/`disallowedTools` explicitly — least privilege
- set `maxTurns`/`permissionMode` เหมาะสมกับ use case — ห้าม `bypassPermissions` ถ้าไม่จำเป็น
- secrets ใน `mcpServers` config ผ่าน `/follow-secret-manager`
- ใช้ official docs https://docs.claude.com/en/api/agent-sdk สำหรับ options ที่ไม่แน่ใจ

## Expected Outcome

- model, tools, permissions ถูกต้องตาม least privilege
- custom tools/MCP servers ทำงานได้
- session resume ใช้ได้ — lint, typecheck, tests ผ่าน

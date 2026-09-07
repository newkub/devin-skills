---
name: follow-lib-mcp-sdk
description: ใช้ @modelcontextprotocol/sdk สร้าง MCP servers/clients — tools, resources, prompts
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ @modelcontextprotocol/sdk สร้าง MCP servers/clients — tools, resources, prompts

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new McpServer({name,version})` แล้ว register `server.tool()`, `resource()`, `prompt()`
1. ใช้ `StdioServerTransport` สำหรับ local หรือ `StreamableHTTPServerTransport` สำหรับ remote
1. define tool schemas ด้วย zod — name, description, inputSchema
1. client side ใช้ `Client` + transport เดียวกัน — ทดสอบด้วย MCP Inspector

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- ทุก tool ต้องมี description ชัดเจน — LLM ใช้เลือก tool
- return `{content:[{type:text,text}]}` format เสมอ
- handle errors เป็น `isError: true` response ไม่ throw
- version server ให้ตรง spec

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน
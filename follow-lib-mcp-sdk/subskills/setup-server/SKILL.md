---
name: follow-lib-mcp-sdk-setup-server
description: Setup MCP server — McpServer, tools/resources/prompts registration
argument-hint: "[server-name]"
related:
  - follow-lib-mcp-sdk
  - run-install
  - run-verify
  - run-test
  - resolve-errors
---

## Goal

สร้าง MCP server ด้วย `@modelcontextprotocol/sdk` — `McpServer` instance, tools/resources/prompts registration พื้นฐาน

## Scope

ใช้เมื่อต้อง setup MCP server ครั้งแรก — ครอบคลุม install, server instance, `registerTool`/`registerResource`/`registerPrompt` และ smoke test ด้วย MCP Inspector

## Execute

### 1. Install SDK

> Goal: ติดตั้ง SDK และเตรียม project

1. ติดตั้ง `bun add @modelcontextprotocol/sdk` และ `zod` สำหรับ input schemas
2. ถ้ามีอยู่แล้ว → verify version เท่านั้น (idempotent)
3. สร้าง entry file เช่น `src/server.ts` หรือ `src/index.ts`
4. ถ้าไม่แน่ใจ API → ดู official docs ที่ `https://modelcontextprotocol.io` หรือ GitHub repo ของ SDK

### 2. Create McpServer Instance

> Goal: สร้าง server instance พื้นฐาน

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const server = new McpServer({
  name: 'my-server',
  version: '1.0.0',
})
```

1. ระบุ `name` และ `version` ชัดเจน — version ให้ตรง spec
2. instance เดียวต่อ server — register capabilities ทั้งหมดบน instance นี้

### 3. Register Tools And Resources

> Goal: register tools, resources, prompts

1. `server.registerTool(name, { description, inputSchema }, handler)` — inputSchema เป็น Zod raw shape; คืน handle สำหรับ `.update()`/`.remove()` (shorthand `server.tool()` ยังใช้ได้)
2. Handler return `{ content: [{ type: 'text', text }] }` format เสมอ — errors เป็น `{ isError: true, content: [...] }` ไม่ throw
3. `server.registerResource(name, uri, { description }, handler)` สำหรับ resources
4. `server.registerPrompt(name, { description, argsSchema }, handler)` สำหรับ prompts
5. ทุก tool/prompt ต้องมี `description` ชัดเจน — LLM ใช้เลือก tool

### 4. Connect Transport

> Goal: เชื่อม transport ให้ server รันได้

1. Local: `StdioServerTransport` — `await server.connect(new StdioServerTransport())`
2. Remote: `StreamableHTTPServerTransport` — HTTP+SSE transport deprecated (backward compat เท่านั้น)
3. รายละเอียด transport/deploy → ทำ subskill `deploy-mcp`

### 5. Verify With Inspector

> Goal: ทดสอบ server ด้วย MCP Inspector

1. รัน `bunx @modelcontextprotocol/inspector <command>` ชี้ไปที่ server entry
2. ทดสอบ list tools, call tool, read resource ใน Inspector UI
3. ทำ `/run-verify` และ `/run-test` สำหรับ lint/typecheck/unit tests
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ทุก tool ต้องมี `description` ชัดเจน — LLM ใช้เลือก tool
- return `{ content: [{ type: 'text', text }] }` format เสมอ
- handle errors เป็น `isError: true` response ไม่ throw
- define inputSchema ด้วย zod raw shape เสมอ
- ใช้ `/follow-lib-mcp-sdk` สำหรับ full reference และ elicitation

## Expected Outcome

- MCP server รันได้ผ่าน stdio transport
- Tools/resources/prompts register ครบและเรียกผ่าน Inspector ได้
- Errors return `isError` responses ถูก format
- Lint/typecheck/tests ผ่าน

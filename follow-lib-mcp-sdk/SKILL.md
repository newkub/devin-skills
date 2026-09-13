---
name: follow-lib-mcp-sdk
description: ใช้ @modelcontextprotocol/sdk สร้าง MCP servers/clients — tools, resources, prompts
argument-hint: "[target-or-scope]"
related:
  - follow-lib-zod
  - follow-create-mcp
  - use-mcp
  - run-verify
  - run-test
---

## Goal

ใช้ @modelcontextprotocol/sdk สร้าง MCP servers/clients — tools, resources, prompts

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ `@modelcontextprotocol/sdk` — สร้าง/แก้ MCP server หรือ client ด้วย TypeScript SDK (lib mcp sdk)

- Scaffold MCP project ใหม่จากศูนย์ → `/follow-create-mcp` ก่อน แล้วกลับมาที่ skill นี้สำหรับ SDK details
- Consume/configure MCP servers ฝั่ง Devin (ไม่ได้เขียน server) → `/use-mcp`
- Tool input schemas ใช้ zod — validation เชิงลึก → `/follow-lib-zod`

- Latest: `@modelcontextprotocol/sdk@1.30.0` (verified 2026-09-13)
- References: [apis](references/apis.md) | [cli](references/cli.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Setup | `subskills/setup-server/SKILL.md` — `McpServer`, tools/resources/prompts registration |
| Deploy | `subskills/deploy-mcp/SKILL.md` — transport options, remote hosting, client config |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new McpServer({name,version})` แล้ว register ด้วย `server.registerTool()`, `registerResource()`, `registerPrompt()` — คืน handle สำหรับ `.update()`/`.remove()` (shorthand `server.tool()` ยังใช้ได้)
1. ใช้ `StdioServerTransport` สำหรับ local หรือ `StreamableHTTPServerTransport` สำหรับ remote — HTTP+SSE transport deprecated (backward compat เท่านั้น)
1. define tool schemas ด้วย zod — name, description, inputSchema (Zod raw shape)
1. client side ใช้ `Client` + transport เดียวกัน — ทดสอบด้วย MCP Inspector
1. ใช้ elicitation เมื่อ tool ต้องการ input เพิ่มจาก user ระหว่าง execute — `mode: 'form'` สำหรับ non-sensitive data, `mode: 'url'` สำหรับ secrets/OAuth

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib mcp sdk)

## Rules

- ทุก tool ต้องมี description ชัดเจน — LLM ใช้เลือก tool
- return `{content:[{type:text,text}]}` format เสมอ
- handle errors เป็น `isError: true` response ไม่ throw
- version server ให้ตรง spec

- ใช้ `/follow-lib-zod` ถ้าต้องเขียน input schemas ซับซ้อน
- ใช้ `/follow-create-mcp` ถ้าต้อง scaffold MCP project ใหม่
- ใช้ `/use-mcp` ถ้าต้อง consume MCP servers ฝั่ง client
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib mcp sdk)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib mcp sdk)
- Lint, typecheck, tests ผ่าน

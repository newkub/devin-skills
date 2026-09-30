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

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-claude-agent-sdk/SKILL.md` — SDK install, `ANTHROPIC_API_KEY` |
| Config | `workflows/config-claude-agent-sdk/SKILL.md` — model, tools, permissions, sessions config |
| Verify | `workflows/verify-connection/SKILL.md` — API key valid, minimal query ตอบกลับ |

อ่าน `workflows/<name>/SKILL.md` ตาม topic แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

Latest: `@anthropic-ai/claude-agent-sdk@0.3.283` (verified 2026-09-26) — renamed จาก `claude-code` SDK, entry point คือ `query()`

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

## Merged Details

### config-claude-agent-sdk

##### Goal

ตั้งค่า/แก้ไข `query()` options ของ `@anthropic-ai/claude-agent-sdk` — model, tools, permissions, MCP servers และ sessions — โดย merge กับ config เดิม

##### Scope

- ครอบคลุม `options` object, custom tools (`tool()` + `createSdkMcpServer`) และ session resume
- ถ้ายังไม่ได้ install/API key → ทำ `workflows/setup-claude-agent-sdk/SKILL.md` ก่อน

##### Execute

###### 1. Read Current Config

> Goal: รู้ options ปัจจุบันก่อนแก้

1. อ่าน call sites ของ `query()` และ options ที่ส่งอยู่
2. ทำ `/check-config-drift` ถ้ามี config แยกในไฟล์อื่น
3. ถ้าไม่พบ `query()` → ทำ `workflows/setup-claude-agent-sdk/SKILL.md` ก่อน

###### 2. Configure Model And Prompt

> Goal: model/system prompt ตรง use case

1. ระบุ `options.model` ตาม use case — ตรวจชื่อ model ล่าสุดจาก official docs ก่อนใช้
2. ตั้ง `options.systemPrompt` สำหรับ behavior ของ agent
3. ตั้ง `options.maxTurns` และ `options.cwd` ให้เหมาะกับงาน

###### 3. Configure Tools And Permissions

> Goal: agent เข้าถึงเฉพาะ tools ที่ต้องการ

1. กำหนด `allowedTools`/`disallowedTools` explicitly — ห้ามเปิดทุก tool โดยไม่จำเป็น
2. ตั้ง `permissionMode` ให้ตรง use case (`default`, `acceptEdits`, `bypassPermissions` ฯลฯ — ดู official docs)
3. custom tools → ใช้ `tool()` + `createSdkMcpServer` แล้วส่งผ่าน `options.mcpServers`
4. external MCP servers → ระบุใน `options.mcpServers` ตาม schema ของ SDK

###### 4. Configure Sessions

> Goal: multi-turn conversation ทำงานถูกต้อง

1. ใช้ `sessionId`/`resume` ใน options สำหรับ resume session เดิม
2. จัดการ session lifecycle — เก็บ session id ต่อ user/conversation

###### 5. Verify

> Goal: config ทำงานกับ agent จริง

1. รัน `query()` ทดสอบกับ options ใหม่ — ตรวจ tools ถูก allow/deny ตามที่ตั้ง
2. ทำ `/run-verify` และ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff

##### Rules

- control tools ด้วย `allowedTools`/`disallowedTools` explicitly — least privilege
- set `maxTurns`/`permissionMode` เหมาะสมกับ use case — ห้าม `bypassPermissions` ถ้าไม่จำเป็น
- secrets ใน `mcpServers` config ผ่าน `/follow-secret-manager`
- ใช้ official docs https://docs.claude.com/en/api/agent-sdk สำหรับ options ที่ไม่แน่ใจ

##### Expected Outcome

- model, tools, permissions ถูกต้องตาม least privilege
- custom tools/MCP servers ทำงานได้
- session resume ใช้ได้ — lint, typecheck, tests ผ่าน

### setup-claude-agent-sdk

##### Goal

ติดตั้ง `@anthropic-ai/claude-agent-sdk` และเตรียม `ANTHROPIC_API_KEY` ให้ `query()` เรียก agent ได้ — first-time setup

##### Scope

- ติดตั้ง package และทำ minimal `query()` call ฝั่ง server
- ตั้งค่า API key ผ่าน secret manager
- ถ้า setup แล้ว → verify เท่านั้น; model/tools/permissions config → `workflows/config-claude-agent-sdk/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `@anthropic-ai/claude-agent-sdk` แล้วหรือยัง — ถ้ามี → skip ไป verify
2. ตรวจ env/secrets ว่ามี `ANTHROPIC_API_KEY` หรือยัง
3. ถ้าขาด key → ทำ `/open-web-for-config-secret` ชี้ user ไป Anthropic Console

###### 2. Install SDK

> Goal: ติดตั้ง SDK ฝั่ง server

1. รัน `bun add @anthropic-ai/claude-agent-sdk` (หรือ package manager ของ project)
2. ยืนยัน import ได้ด้วย `import { query } from '@anthropic-ai/claude-agent-sdk'`
3. ยืนยันรันเฉพาะ server-side — ห้าม bundle เข้า client

###### 3. Configure API Key

> Goal: key ปลอดภัย ไม่ commit

1. เก็บ `ANTHROPIC_API_KEY` ผ่าน `/follow-secret-manager` — ห้าม hardcode หรือ commit
2. SDK อ่าน env อัตโนมัติ — ไม่ต้องส่ง key ใน code

###### 4. Smoke Test

> Goal: `query()` ทำงานได้จริง

1. รัน minimal call:
   ```typescript
   for await (const msg of query({ prompt: 'Say hi', options: { maxTurns: 1 } })) {
     console.log(msg)
   }
   ```
2. ตรวจว่าได้ assistant message กลับมาโดยไม่ error auth

###### 5. Verify

> Goal: SDK พร้อมใช้

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

##### Rules

- ต้องการ `ANTHROPIC_API_KEY` ใน env — ห้าม hardcode
- ทำงานฝั่ง server เท่านั้น — ห้าม bundle เข้า client
- ใช้ official docs https://docs.claude.com/en/api/agent-sdk ถ้าไม่แน่ใจ API

##### Expected Outcome

- SDK ติดตั้งและ `query()` ทำงานได้ฝั่ง server
- API key อยู่ใน secret manager
- พร้อมไป `workflows/config-claude-agent-sdk/SKILL.md`

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Claude Agent SDK เชื่อมต่อ Anthropic API ได้จริง — key valid, model พร้อม, query ตอบกลับ

##### Scope

- ใช้เมื่อ `/follow-service-claude-agent-sdk` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ config

##### Execute

###### 1. Check API Key

> Goal: `ANTHROPIC_API_KEY` มีและ format ถูก

1. ตรวจ env var มีค่า (ไม่ print ค่า)
2. ตรวจ key ไม่ใช่ placeholder (`sk-ant-...` format)

###### 2. Smoke Test Query

> Goal: API ตอบกลับจริง

1. รัน minimal SDK call — เช่น query สั้นๆ หรือ model list ถ้า SDK รองรับ
2. ตรวจ response ไม่ใช่ 401/403 (auth) หรือ 429 (rate limit)
3. บันทึก latency คร่าวๆ เป็น baseline

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `rate-limited` / `unreachable`

##### Rules

- ใช้ minimal query เท่านั้น — ควบคุม token cost
- ไม่ print API key
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

##### Expected Outcome

- Verdict connection พร้อม model/latency evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `@anthropic-ai/claude-agent-sdk` |
| Registry | `npm` |
| Latest Version | `0.3.273` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Anthropic |
| License | `SEE LICENSE IN README.md` |
| Repository | `https://github.com/anthropics/claude-agent-sdk-typescript` |
| Website | `https://www.anthropic.com/` |
| Documentation | `https://docs.claude.com/en/api/agent-sdk/overview` |
| Releases / Changelog | `https://github.com/anthropics/claude-agent-sdk-typescript/releases` |

##### Install

```bash
bun add @anthropic-ai/claude-agent-sdk
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `claude-code` | `npm` | `unknown` | Legacy package name — SDK was renamed to `@anthropic-ai/claude-agent-sdk` |

##### Notes

- Breaking changes in latest major: still `0.x` — API surface may change between minor releases; entry point is `query()`
- Version pinned in SKILL.md: `0.3.273`

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (service claude agent sdk)
- ไม่มี security/performance pitfalls ที่รู้จัก (service claude agent sdk)
- Lint, typecheck, tests ผ่าน
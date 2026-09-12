---
name: follow-service-claude-agent-sdk-setup-claude-agent-sdk
description: ติดตั้ง @anthropic-ai/claude-agent-sdk และตั้งค่า API key ให้ query() ใช้ได้
argument-hint: "[project-path]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

ติดตั้ง `@anthropic-ai/claude-agent-sdk` และเตรียม `ANTHROPIC_API_KEY` ให้ `query()` เรียก agent ได้ — first-time setup

## Scope

- ติดตั้ง package และทำ minimal `query()` call ฝั่ง server
- ตั้งค่า API key ผ่าน secret manager
- ถ้า setup แล้ว → verify เท่านั้น; model/tools/permissions config → `subskills/config-claude-agent-sdk/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน project พร้อมและยังไม่ได้ setup

1. ตรวจ `package.json` ว่ามี `@anthropic-ai/claude-agent-sdk` แล้วหรือยัง — ถ้ามี → skip ไป verify
2. ตรวจ env/secrets ว่ามี `ANTHROPIC_API_KEY` หรือยัง
3. ถ้าขาด key → ทำ `/open-web-for-config-secret` ชี้ user ไป Anthropic Console

### 2. Install SDK

> Goal: ติดตั้ง SDK ฝั่ง server

1. รัน `bun add @anthropic-ai/claude-agent-sdk` (หรือ package manager ของ project)
2. ยืนยัน import ได้ด้วย `import { query } from '@anthropic-ai/claude-agent-sdk'`
3. ยืนยันรันเฉพาะ server-side — ห้าม bundle เข้า client

### 3. Configure API Key

> Goal: key ปลอดภัย ไม่ commit

1. เก็บ `ANTHROPIC_API_KEY` ผ่าน `/follow-secret-manager` — ห้าม hardcode หรือ commit
2. SDK อ่าน env อัตโนมัติ — ไม่ต้องส่ง key ใน code

### 4. Smoke Test

> Goal: `query()` ทำงานได้จริง

1. รัน minimal call:
   ```typescript
   for await (const msg of query({ prompt: 'Say hi', options: { maxTurns: 1 } })) {
     console.log(msg)
   }
   ```
2. ตรวจว่าได้ assistant message กลับมาโดยไม่ error auth

### 5. Verify

> Goal: SDK พร้อมใช้

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report
3. สำเร็จ → ทำ `/suggest-next-action`

## Rules

- ต้องการ `ANTHROPIC_API_KEY` ใน env — ห้าม hardcode
- ทำงานฝั่ง server เท่านั้น — ห้าม bundle เข้า client
- ใช้ official docs https://docs.claude.com/en/api/agent-sdk ถ้าไม่แน่ใจ API

## Expected Outcome

- SDK ติดตั้งและ `query()` ทำงานได้ฝั่ง server
- API key อยู่ใน secret manager
- พร้อมไป `subskills/config-claude-agent-sdk/SKILL.md`

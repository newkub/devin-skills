---
name: follow-lib-openai
description: ใช้ openai SDK — chat completions, structured output, streaming, embeddings
argument-hint: "[target-or-scope]"
related:
  - follow-lib-zod
  - follow-secret-manager
  - run-verify
  - run-test
---

## Goal

ใช้ openai SDK — chat completions, structured output, streaming, embeddings

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ `openai` SDK — OpenAI API client ฝั่ง server บน Node.js 22+/Bun (lib openai)

- Compatible providers (Azure, OpenRouter, Ollama, local LLMs) ผ่าน `baseURL` → `subskills/config-providers/SKILL.md`
- Vendor อื่น (Anthropic/Claude ฯลฯ) อยู่นอก scope — ใช้ skill ของ vendor นั้น
- API keys/org/project จัดการผ่าน `/follow-secret-manager` — ห้ามเรียก API จาก client-side
- Structured output schemas ใช้ zod — validation เชิงลึก → `/follow-lib-zod`

- Latest: `openai@7.15.0` (verified 2026-09-13) — v7 requires Node.js 22+
- References: [apis](references/apis.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Config | `subskills/config-providers/SKILL.md` — `baseURL`, compatible endpoints, org/project keys |
| Optimize | `subskills/optimize-tokens/SKILL.md` — prompt sizing, caching, model routing |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new OpenAI({apiKey})` — key จาก env `OPENAI_API_KEY`
1. ใช้ `chat.completions.create` หรือ Responses API (`client.responses.create`) — ตั้ง `model` และ system prompt ชัดเจน
1. ใช้ `zodResponseFormat` จาก `openai/helpers/zod` กับ `client.responses.parse`/`chat.completions.parse` สำหรับ structured output
1. stream ด้วย `stream: true` + iterate chunks — handle tool calls ถ้าใช้ function calling

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib openai)

## Rules

- ห้ามเรียก OpenAI จาก client — proxy ผ่าน server เสมอ
- ตั้ง timeout + retry + rate-limit handling (429 backoff)
- `openai@7.x` ต้อง Node.js 22+ — ตรวจ runtime ก่อน upgrade
- validate structured output ด้วย zod schema
- log token usage สำหรับ cost control

- ใช้ `/follow-lib-zod` ถ้าต้องเขียน structured output schemas ซับซ้อน
- ใช้ `/follow-secret-manager` ถ้าต้องจัดการ API keys
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib openai)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib openai)
- Lint, typecheck, tests ผ่าน

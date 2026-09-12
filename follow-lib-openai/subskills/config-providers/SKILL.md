---
name: follow-lib-openai-config-providers
description: Config openai SDK — baseURL, compatible providers, org/project keys
argument-hint: "[provider]"
related:
  - follow-lib-openai
  - follow-secret-manager
  - check-env-vars
  - run-verify
  - resolve-errors
---

## Goal

ตั้งค่า `openai` SDK กับ providers ต่างๆ — `baseURL` สำหรับ OpenAI-compatible endpoints, org/project keys และ env config

## Scope

ใช้เมื่อต้อง config `openai` client — ครอบคลุม `baseURL` override สำหรับ compatible providers (Azure, OpenRouter, Together, local LLMs), `organization`/`project` keys และ secrets handling

## Execute

### 1. Read Current Config

> Goal: ตรวจ client config และ env vars ปัจจุบัน

1. ตรวจว่ามี `new OpenAI(...)` อยู่แล้วหรือไม่ — merge เดิม ห้าม overwrite
2. ทำ `/check-env-vars` — ดู `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_ORG_ID`, `OPENAI_PROJECT_ID` ที่ตั้งไว้
3. ระบุ provider ที่ใช้จริง — OpenAI official หรือ compatible endpoint

### 2. Configure Client Options

> Goal: ตั้งค่า client options ตาม provider

```ts
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,   // default: env OPENAI_API_KEY
  baseURL: process.env.OPENAI_BASE_URL, // override สำหรับ compatible providers
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
  timeout: 60_000,
  maxRetries: 2,
})
```

1. `apiKey` — อ่านจาก env `OPENAI_API_KEY` (default) หรือ env ของ provider นั้น
2. `baseURL` — ตั้งสำหรับ OpenAI-compatible providers เช่น OpenRouter `https://openrouter.ai/api/v1`, Azure endpoint, local LLM servers (Ollama `http://localhost:11434/v1`, LM Studio) — ดู provider docs สำหรับ URL ที่ถูกต้อง
3. `organization`/`project` — จำเป็นสำหรับ OpenAI accounts ที่มีหลาย orgs/projects; ใช้ env `OPENAI_ORG_ID`/`OPENAI_PROJECT_ID`
4. ตั้ง `timeout` และ `maxRetries` เสมอ — default อาจไม่พอสำหรับ long requests
5. บาง providers ต้องการ extra headers (เช่น OpenRouter `HTTP-Referer`) — ใช้ `defaultHeaders` option; ดู provider docs

### 3. Verify Provider Compatibility

> Goal: ยืนยันว่า endpoint รองรับ API ที่ใช้

1. Compatible providers รองรับ Chat Completions API เกือบทั้งหมด — แต่ Responses API, structured output, tools อาจไม่รองรับทุก provider
2. ทดสอบ call ง่ายๆ ก่อน: `client.chat.completions.create({ model, messages })`
3. ตรวจ model name ตรงกับ provider — model names ต่างกันระหว่าง providers
4. ถ้า provider ไม่รองรับ feature ที่ต้องการ → report ข้อจำกัดให้ user

### 4. Verify

> Goal: smoke test client call จริง

1. ทดสอบ request จริง 1 ครั้ง — response ถูกต้องไม่มี auth/URL errors
2. ทำ `/run-verify` สำหรับ lint/typecheck
3. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ห้าม hardcode API keys — env vars เท่านั้น; secrets ผ่าน `/follow-secret-manager`
- ห้ามเรียก provider จาก client-side code — proxy ผ่าน server เสมอ
- ตั้ง `timeout` + `maxRetries` เสมอ — handle 429 backoff
- `openai@7.x` ต้อง Node.js 22+ — ตรวจ runtime ก่อน
- ใช้ `/follow-lib-openai` สำหรับ full reference

## Expected Outcome

- Client config ชี้ provider ที่ถูกต้องผ่าน `baseURL`/env
- Org/project keys และ timeout/retry ตั้งครบ
- Smoke test call ผ่าน — ไม่มี auth/URL errors
- Secrets ไม่ leak ใน code

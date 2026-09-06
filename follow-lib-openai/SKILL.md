---
name: follow-lib-openai
description: ใช้ openai SDK — chat completions, structured output, streaming, embeddings
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ openai SDK — chat completions, structured output, streaming, embeddings

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new OpenAI({apiKey})` — key จาก env `OPENAI_API_KEY`
1. ใช้ `chat.completions.create` หรือ Responses API — ตั้ง `model` และ system prompt ชัดเจน
1. ใช้ `zodResponseFormat`/`response_format` สำหรับ structured output
1. stream ด้วย `stream: true` + iterate chunks — handle tool calls ถ้าใช้ function calling

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- ห้ามเรียก OpenAI จาก client — proxy ผ่าน server เสมอ
- ตั้ง timeout + retry + rate-limit handling (429 backoff)
- validate structured output ด้วย zod schema
- log token usage สำหรับ cost control

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน
---
name: follow-lib-tanstack-ai
description: ใช้ TanStack AI ครบวงจร — provider adapters, chat streaming, tools, client hooks, MCP
argument-hint: "[framework] [provider]"
related:
  - follow-lib-tanstack-ecosystem
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack AI ครบ — provider-agnostic AI SDK: `chat()` server-side + adapters, tool calling, streaming, `useChat` client hooks, agent loops

## Scope

ใช้สำหรับ AI features ที่ไม่ผูก provider เดียว (chat, tools, agents, streaming UI) — **0.x**: API เปลี่ยนเร็ว ตรวจ `https://tanstack.com/ai/latest` ก่อน implement เสมอ

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/ai @tanstack/ai-client @tanstack/ai-react
bun add @tanstack/ai-openai        # หรือ ai-anthropic / ai-ollama / adapter อื่น
```

### 2. Server Chat Endpoint

> Goal: `chat()` + adapter ฝั่ง server เท่านั้น

```ts
import { chat, toStreamResponse, toolDefinition } from '@tanstack/ai'
import { openaiText } from '@tanstack/ai-openai'

const getWeather = toolDefinition({
  name: 'get_weather',
  description: 'Get weather for a city',
  inputSchema: z.object({ city: z.string() }),
}).server(async ({ city }) => fetchWeather(city))   // execute ฝั่ง server

export const POST = async ({ request }) => {
  const { messages } = await request.json()
  const stream = chat({ adapter: openaiText(), messages, tools: [getWeather] })
  return toStreamResponse(stream)
}
```

1. วางใน Start server function (`createServerFn` → `follow-start`) หรือ API route ของ framework
2. API keys อยู่ env ฝั่ง server เท่านั้น — ห้าม leak เข้า client bundle

### 3. Client Chat

> Goal: streaming chat UI

```tsx
import { useChat } from '@tanstack/ai-react'

const { messages, sendMessage, isLoading, stop } = useChat({
  connection: fetchServerSentEvents('/api/chat'),
})
```

- `messages` มี `parts` — text, tool-call, tool-result — render ตาม part type
- Approval flows: tools ที่ต้องยืนยัน → client-side approval UI ก่อน execute
- สลับ provider = เปลี่ยน adapter import ฝั่ง server เท่านั้น — client ไม่แตะ

### 4. Advanced

> Goal: ครอบ use cases จริง

1. **Tools**: `toolDefinition` — server tools (`.server(fn)`), client tools (interactive UI), approval-required tools
2. **Structured output**: `outputSchema` บน chat options → typed JSON response
3. **Agent loop**: tools + maxIterations — model เรียก tool หลายรอบจนจบ
4. **MCP**: เชื่อม MCP servers เป็น tool sources (ตรวจ API ล่าสุด — 0.x เปลี่ยนเร็ว)
5. **Headless**: `@tanstack/ai-client` ใช้นอก framework UI — custom chat state management

### 5. Verify

1. `/run-typecheck` — message/tool types ผ่าน
2. Streaming จริง: tokens มาครบ, `stop()` ยกเลิกได้, tool round-trip สำเร็จ
3. ทดสอบ adapter อีกตัวเพื่อยืนยัน provider-agnostic
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Adapter + `chat()` อยู่ server เสมอ — client เห็นแค่ connection/stream
- Tool schemas ใช้ standard schema — types ไหลถึง model response
- Tools ที่ side effects → `.server()` execution เท่านั้น
- Message `parts` = source of truth — ห้าม parse raw text เอง
- 0.x API — pin exact version; verify examples ตรง docs ล่าสุดทุกครั้ง

## Expected Outcome

- Chat stream end-to-end ทำงาน (server adapter → client UI)
- Tools execute + approval flows ถูกต้อง
- Provider swap ไม่กระทบ client code

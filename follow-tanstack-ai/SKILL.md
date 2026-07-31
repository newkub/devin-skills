---
name: follow-tanstack-ai
description: ตั้งค่าและใช้งาน TanStack AI สำหรับ type-safe AI chat และ tool calling
---

## Goal

ตั้งค่า TanStack AI สำหรับ type-safe AI chat, streaming responses และ isomorphic tool calling

## Scope

ใช้สำหรับ TanStack AI ใน React, Solid, Next.js, TanStack Start, Express, React Router v7 projects

## Execute

### 1. Setup And Adapters

1. ติดตั้งด้วย `bun add @tanstack/ai` และ adapter เช่น `@tanstack/openrouter`
2. ใช้ activity-specific adapter functions: `openaiText()`, `openaiSummarize()`, `openaiImage()`
3. ส่ง model name ตรงที่ adapter factory: `openaiText('gpt-5.2')`
4. รองรับ multiple providers: OpenRouter, OpenAI, Anthropic, Gemini, Ollama

### 2. Chat And Streaming

1. ใช้ `chat()` สำหรับ streaming chat responses
2. ใช้ `stream: false` สำหรับ one-shot responses
3. ใช้ `outputSchema` พร้อม Zod สำหรับ structured responses
4. ใช้ `summarize()` สำหรับ text summarization
5. ใช้ `generateImage()` สำหรับ image generation

### 3. Isomorphic Tools

1. ใช้ `toolDefinition()` สำหรับ define tool schema ครั้งเดียว
2. ใช้ `.server()` สำหรับ server implementation
3. ใช้ `.client()` สำหรับ client implementation
4. ใช้ Zod schemas สำหรับ input/output validation (recommended)
5. ใช้ `mergeAgentTools(serverTools, clientTools)` สำหรับ merge tools

### 4. Tool Execution And States

1. ใช้ `maxIterations()` สำหรับ agentic loop control
2. ใช้ `needsApproval` สำหรับ sensitive operations
3. ใช้ `emitCustomEvent` สำหรับ stream progress จาก server tools
4. ใช้ `context` สำหรับ request-scoped dependencies (auth, DB)
5. Tool states: `awaiting-input`, `input-streaming`, `input-complete`, `approval-requested`, `approval-responded`

### 5. Framework Integration

1. ใช้ `useChat` hook สำหรับ React และ Solid chat interfaces
2. ใช้ `InferChatMessages` สำหรับ type-safe message handling
3. ใช้ `chatParamsFromRequest()` สำหรับ parse HTTP request body
4. ใช้ `toServerSentEventsStream()` สำหรับ SSE streaming

## Rules

### 1. Tool Design

- Single Responsibility: แต่ละ tool ทำหนึ่งอย่างให้ดี
- Clear Descriptions: ช่วย LLM เข้าใจเมื่อใช้ tool
- Type Safety: ใช้ Zod schemas สำหรับ input/output
- Error Handling: return meaningful errors ไม่ throw
- Idempotency: tools ต้องปลอดภัยเมื่อเรียกซ้ำ

### 2. Security

- Server vs Client: sensitive operations ไว้บน server
- Approval Flow: ใช้ `needsApproval` สำหรับ destructive actions
- Input Validation: validate tool inputs เสมอ
- Rate Limiting: implement rate limits สำหรับ expensive tools
- Audit Logs: log tool executions

### 3. Performance

- Caching: cache tool results เมื่อเหมาะสม
- Parallel Execution: enable parallel tool calls
- Streaming: ใช้ streaming สำหรับ long-running operations
- Timeouts: ตั้ง timeouts สำหรับ external API calls
- Lazy Loading: load tools เฉพาะเมื่อจำเป็น

## Expected Outcome

- TanStack AI ติดตั้งพร้อม type-safe chat และ streaming
- Isomorphic tools ทำงานได้ทั้ง server และ client
- Tool calling พร้อม approval flow สำหรับ sensitive operations
- Multi-provider support (OpenRouter, OpenAI, Anthropic, Gemini, Ollama)
- Framework integration กับ React, Solid, TanStack Start

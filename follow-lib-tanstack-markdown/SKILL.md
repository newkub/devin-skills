---
name: follow-lib-tanstack-markdown
description: ใช้ TanStack Markdown ครบวงจร — document model, streaming-safe parsing, AI output, custom renderers
argument-hint: "[use-case]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Markdown ครบ — parse markdown → serializable document model → render: streaming-safe (partial docs จาก AI), transportable (JSON), custom node renderers

## Scope

ใช้เมื่อต้อง render markdown โดยเฉพาะ **streaming AI output** (append-safe incremental parse) หรือ docs ที่ transport เป็น JSON — static markdown ธรรมดา `marked`/`remark` เพียงพอ

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/markdown
```

### 2. Document Model

> Goal: markdown → serializable tree → UI

1. Parse markdown string → document tree of typed nodes (headings, paragraphs, lists, code, tables) — JSON-serializable
2. Render nodes → map node types เป็น UI components ของตัวเอง (headless-style)
3. Transport: model serialize ผ่าน JSON ได้ — RSC/SSR payload ปลอดภัย
4. ตรวจ export names ล่าสุดที่ `https://tanstack.com/markdown/latest` — v1 ใหม่ API อาจ refine

### 3. Streaming Pattern

> Goal: AI chat output render ขณะ stream

1. Append chunk → incremental parse — model รองรับ partial documents
2. Unclosed blocks (code fence, table กลางท่อน) render เป็น pending state ไม่พัง layout
3. Pair กับ `follow-ai` — pipe `message.parts` เข้า renderer ต่อเนื่อง

### 4. Custom Rendering

> Goal: render ตาม design system

1. Node-type map: `code` → `follow-highlight` syntax highlighting; `table` → `follow-table` component
2. Sanitize: raw HTML nodes ต้อง sanitize ก่อน render (trust boundary)
3. Link handling: intercept `link` nodes → `follow-router` `<Link>` (SPA nav ไม่ reload)

### 5. Verify

1. `/run-typecheck` + `/run-test`
2. Edge cases: unclosed fence mid-stream, nested lists, tables, inline code ใน heading
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Model = data เท่านั้น — ห้ามฝัง component/function ใน nodes (serialize พัง)
- Raw HTML → sanitize เสมอ — XSS boundary ของ app
- Streaming ต้อง handle incomplete blocks — เทส partial states
- เลือก lib ให้ถูก: stream/serialize → TanStack Markdown; static render → `marked` เบากว่า

## Expected Outcome

- Markdown parse → doc model transport ได้
- Streaming render ไม่ flicker/error
- Custom renderers เข้า design system

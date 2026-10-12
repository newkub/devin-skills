---
name: follow-lib-tanstack-highlight
description: ใช้ TanStack Highlight ครบวงจร — syntax highlighting, themes, languages, SSR กับ markdown integration
argument-hint: "[language-scope]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Highlight ครบ — syntax highlighter ที่ produce compact themeable HTML tokens: languages, theming ผ่าน CSS, SSR/precompute, integration กับ markdown/doc tools

## Scope

ใช้เมื่อต้อง syntax highlighting — code blocks, docs, diff viewers, markdown fences (`follow-markdown`) — v1 ใหม่: ตรวจ `https://tanstack.com/highlight/latest` ก่อน implement

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/highlight
```

### 2. Highlight To Tokens

> Goal: source → themed HTML/token output

1. Highlight source string ด้วย language param → output เป็น token stream/HTML พร้อม semantic classes
2. Output structure compact — tokens แยกตาม type (keyword, string, comment, number, fn ฯลฯ)
3. ตรวจ export/API names ล่าสุดใน docs — package v1 ใหม่ API อาจ refine

### 3. Theme And Render

> Goal: สีตรง design system + render ปลอดภัย

1. Theme ผ่าน CSS classes/custom properties — map token classes → design tokens (เช่น UnoCSS semantic colors)
2. Render: highlighter output เป็น escaped HTML — `dangerouslySetInnerHTML` ใช้ได้แต่ verify escape ก่อนเสมอ (XSS boundary)
3. Dark mode: theme classes ควรสลับตาม `.dark` — ผูกกับ theme system ของ app

### 4. Patterns

> Goal: ใช้งานจริง

1. **SSR/precompute**: static content → highlight ตอน build/server ลด client work + bundle
2. **Markdown fences**: ต่อ `code` nodes จาก `follow-markdown` doc model
3. **Line features**: line numbers/diff highlights ผ่าน wrapper markup บน token output
4. **Language scope**: register/lazy-load เฉพาะ languages ที่ใช้จริง — bundle size

### 5. Verify

1. `/run-typecheck` + `/run-test`
2. Languages ที่ project ใช้จริง — token coverage + theme colors ทั้ง light/dark
3. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Theme ผ่าน CSS — ห้าม inline color config ใน highlighter options
- SSR/precompute static content — client highlight เฉพาะ dynamic
- Verify escaped output ก่อน `dangerouslySetInnerHTML`
- Lazy-load grammars เฉพาะที่ใช้ — อย่า bundle ทุก language
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ library selection

## Expected Outcome

- Code blocks highlighted themeable ทั้ง light/dark
- Integration กับ markdown/docs ทำงาน
- Bundle เบา — เฉพาะ languages ที่ใช้

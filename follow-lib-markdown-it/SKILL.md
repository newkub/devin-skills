---
name: follow-lib-markdown-it
description: ใช้ markdown-it + plugins — render markdown, syntax highlight ด้วย shiki
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ markdown-it + plugins — render markdown, syntax highlight ด้วย shiki

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib markdown it)

- Latest: `markdown-it@15.0.1` (verified 2026-09-11)
- References: [apis](references/apis.md) | [cli](references/cli.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง instance `new MarkdownIt()` หรือ `markdown-it` แล้ว `.use(plugin)`
1. ใช้ `@shikijs/markdown-it` สำหรับ code highlight (async — ต้อง await setup)
1. customize render rules ผ่าน `md.renderer.rules` เมื่อต้องเปลี่ยน output
1. sanitize output ด้วย DOMPurify เมื่อ render user content

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib markdown it)

## Rules

- ปิด `html: true` เมื่อ render untrusted content หรือ sanitize หลัง render
- preload highlighter ด้วย `@shikijs/markdown-it/async` pattern
- cache rendered output สำหรับ content ซ้ำ

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib markdown it)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib markdown it)
- Lint, typecheck, tests ผ่าน

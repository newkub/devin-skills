---
name: follow-lib-markdown-it
description: ใช้ markdown-it + plugins — render markdown, syntax highlight ด้วย shiki
argument-hint: "[target-or-scope]"
related:
  - follow-lib-dompurify
  - run-verify
  - run-test
---

## Goal

ใช้ markdown-it + plugins — render markdown, syntax highlight ด้วย shiki

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ markdown-it — parser/renderer, plugin ecosystem, CLI render (lib markdown it)

- ใช้ skill นี้สำหรับ markdown-it pipeline (`parse` → tokens → `render`) — ถ้าต้องการ full markdown pipeline ที่มี AST/unist (remark/rehype) หรือ framework integration (เช่น VitePress, Slidev) → ใช้ skill ของ framework นั้นแทน
- Sanitize rendered HTML จาก untrusted content → `/follow-lib-dompurify`
- มี CLI ในตัว (`markdown-it <file>`) — ดู [cli](references/cli.md)

- Latest: `markdown-it@15.0.2` (verified 2026-09-13) — v15: ESM+CJS dual, types รวมใน package (ไม่ต้อง `@types/markdown-it`)
- References: [apis](references/apis.md) | [cli](references/cli.md) | [package-manifest](references/package-manifest.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ติดตั้ง `bun add markdown-it` — v15 bundle types ในตัว ไม่ต้อง `@types/markdown-it`
1. สร้าง instance `new MarkdownIt()` หรือ `markdown-it()` พร้อม preset ตามต้องการ: `default` (extras), `commonmark` (strict spec), `zero` (minimal) — แล้ว `.use(plugin)`
1. ใช้ `@shikijs/markdown-it` สำหรับ code highlight (async — ต้อง await setup)
1. customize render rules ผ่าน `md.renderer.rules` เมื่อต้องเปลี่ยน output; toggle rules ด้วย `md.enable`/`md.disable`
1. sanitize output ด้วย DOMPurify เมื่อ render user content — ดู `/follow-lib-dompurify`

### 2. Plugins And CLI

> Goal: ใช้ plugin ecosystem และ CLI อย่างถูกต้อง

1. Plugin ecosystem ผ่าน `md.use(plugin, opts)` — เช่น `markdown-it-anchor`, `markdown-it-toc-done-right`, `markdown-it-footnote` (ดู list ที่ npm keyword `markdown-it-plugin`)
1. CLI สำหรับ render ไฟล์เร็ว: `bunx markdown-it README.md` หรือ stdin — options `--html`, `--linkify`, `--typographer` (ดู [cli](references/cli.md))
1. ต้องการ token-level control → `md.parse(src, env)` คืน token stream ก่อน render

### 3. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib markdown it)

## Rules

- ปิด `html: true` เมื่อ render untrusted content หรือ sanitize หลัง render
- preload highlighter ด้วย `@shikijs/markdown-it/async` pattern
- cache rendered output สำหรับ content ซ้ำ

- ใช้ `/follow-lib-dompurify` ถ้าต้อง sanitize HTML output
- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib markdown it)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib markdown it)
- Lint, typecheck, tests ผ่าน

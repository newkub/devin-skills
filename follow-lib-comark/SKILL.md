---
name: follow-lib-comark
description: ใช้ Comark parse และ render Markdown ได้ทุกที่ — HTML, ANSI, Vue, React, Svelte, Angular
argument-hint: "[scope]"
related:
  - improve-uxui
  - follow-lib-shiki
  - follow-lib-vue
  - follow-lib-react
  - follow-create-web-docs
  - follow-lib-dompurify
---

## Goal

ใช้ Comark parse CommonMark/GFM เป็น `MarkdownDocument` ที่ serializable แล้ว render ไปยัง HTML, ANSI, Vue, React, Svelte, Angular — รองรับ streaming, components, attributes และ plugins

## Scope

ใช้สำหรับ JS/TS projects ที่ render Markdown content — docs sites, blogs, CMS content, AI chat streaming output, RSS/email/CLI output

- Boundary: Comark คือ markdown parse+render pipeline; syntax highlighting ของ code blocks ผ่าน plugin `comark/plugins/shiki` (ดู `/follow-lib-shiki`) หรือ `comark/plugins/rangi` (lightweight, ไม่ใช้ shiki); full docs site generation → `/follow-create-web-docs`
- Parse/render แยกกัน — parse ฝั่ง server/build แล้ว serialize ข้ามไป render ที่ framework ใดก็ได้
- ใช้ใน `/improve-uxui` เมื่อ finding เกี่ยวกับ markdown content rendering, docs UX, streaming chat output
- Latest: `comark@0.7.0` (verified 2026-10-03)

## Execute

### 1. Install Renderer Package

> Goal: ติดตั้งตาม output target

1. Core parse: `bun add comark`
2. เลือก renderer ตาม target: `@comark/html`, `@comark/ansi`, `@comark/vue`, `@comark/react`, `@comark/svelte`, `@comark/angular`, `@comark/nuxt`
3. ดู packages/API ทั้งหมดใน [API reference](references/apis.md)

### 2. Parse And Render

> Goal: render markdown แรกได้

1. String renderers — `renderHtml`/`renderAnsi` รับ markdown string คืน output:

   ```ts
   import { renderHtml } from '@comark/html'

   const html = await renderHtml('# Hello **World**')
   ```

2. Framework renderers — ใช้ `Markdown` component ของ package นั้น (Vue ต้องอยู่ใน `<Suspense>`; React ใช้ `<Markdown>{content}</Markdown>`)
3. Manual pipeline — `parseMarkdown` จาก `comark` คืน `MarkdownDocument` ที่ inspect/transform/cache/serialize ได้ก่อน render

### 3. Components, Attributes, Frontmatter

> Goal: ใช้ opt-in syntax เมื่อต้องการ richer content

1. Components — `::alert{type="info"}` blocks และ `:badge[text]` inline พร้อม props/slots/nested markdown; register เฉพาะ components ที่ระบุ
2. Attributes — `**bold**{.highlight}`, `[link](url){.button target="_blank"}`, `![img](src){width="800"}`
3. Frontmatter — YAML block นำหน้า parse เป็น metadata ผูก component props ได้
4. Plain CommonMark/GFM ทำงานโดยไม่เปิด syntax เหล่านี้ — opt-in ทั้งหมด

### 4. Plugins And Highlighting

> Goal: ต่อ plugin ตามความต้องการ

1. `comark/plugins/shiki` — syntax highlighting พร้อม multi-theme + on-demand languages (ดู `/follow-lib-shiki`)
   - `comark/plugins/rangi` — lightweight alternative (~13kB, sync, zero-dep) เมื่อต้องการ highlight โดยไม่เอา shiki; `bun add rangi` (peer dep) แล้ว `plugins: [rangi({ theme: github })]` theme จาก `rangi/themes`; HTML renderer import จาก `@comark/html/plugins/rangi`
2. Official plugins: mermaid diagrams, math, table of contents, json-render (declarative UI specs)
3. เขียน plugin เองตาม plugin API; markdown-it plugins ใช้ร่วมได้ (Comark สร้างบน markdown-exit)
4. ดู plugin registry ที่ https://comark.dev/plugins

### 5. Streaming Output

> Goal: render AI/chat streaming content ถูกต้อง

1. Auto-close parser ปิด syntax ที่ยังไม่จบ (bold, code fences, components) — ทุก frame render เป็น markup สมบูรณ์
2. Framework renderers มี streaming prop — chunks ที่มา mid-token render ได้ทันทีพร้อม caret
3. เหมาะสำหรับ AI chat interfaces และ live content feeds

## Rules

### 1. Serializable Document

- `MarkdownDocument` คือ serializable data — parse ครั้งเดียว cache/serialize ได้; ไม่ผูกกับ framework หรือ build step
- ห้าม embed executable framework code ใน content — components resolve เฉพาะที่ register

### 2. Renderer Choice

- เลือก renderer ตาม output target จริง — HTML string สำหรับ SSG/RSS/email, ANSI สำหรับ CLI, framework component สำหรับ apps
- Vue `<Markdown>` ต้องอยู่ใน `<Suspense>` — async parse ภายใน

### 3. Trust Boundary

- Renderer ใช้เฉพาะ components ที่ register — content เป็น data ไม่ใช่ code; ยังคง sanitize HTML output ถ้ารับ untrusted content (ดู `/follow-lib-dompurify`)

- ใช้ /improve-uxui ถ้าจำเป็น
- ใช้ /follow-lib-shiki ถ้าจำเป็น
- ใช้ /follow-lib-vue ถ้าจำเป็น
- ใช้ /follow-lib-react ถ้าจำเป็น
- ใช้ /follow-create-web-docs ถ้าจำเป็น

## References

- [API reference](references/apis.md)

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- Comark renderer ติดตั้งตาม target และ render markdown แรกได้
- Components/attributes/frontmatter ใช้เป็น opt-in เมื่อต้องการ
- Plugins (shiki/rangi, mermaid, toc) ต่อได้ถูกต้อง
- Streaming output render สมบูรณ์ทุก frame
- พร้อมใช้ใน `/improve-uxui` fixes สำหรับ markdown/content UX

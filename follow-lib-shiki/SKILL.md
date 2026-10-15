---
name: follow-lib-shiki
description: ใช้ Shiki syntax highlighter — TextMate grammars, zero runtime, integrations และ transformers
argument-hint: "[scope]"
related:
  - improve
  - follow-lib-comark
  - follow-lib-markdown-it
  - follow-tool-vitepress
---

## Goal

ใช้ Shiki เป็น syntax highlighter ของ project — TextMate grammar เดียวกับ VS Code, highlight ล่วงหน้า (zero runtime JS), ปรับแต่งผ่าน transformers และ integrations

## Scope

ใช้สำหรับ JS/TS projects ที่ต้อง highlight code blocks ใน UI, docs, markdown หรือ editor — ทุก runtime (Node, Bun, browser, Cloudflare Workers)

- Boundary: Shiki ทำ syntax highlighting เท่านั้น; markdown rendering ทั้ง pipeline → `/follow-lib-comark` หรือ `/follow-lib-markdown-it`; live editor → `@shikijs/monaco`
- ใช้ใน `/improve uxui` เมื่อ finding เกี่ยวกับ code blocks/readability ของ code ใน UI
- Latest: `shiki@4.5.0` (verified 2026-10-03)

## Execute

### 1. Install And First Highlight

> Goal: ได้ highlighted HTML แรก

1. ติดตั้ง `bun add -D shiki`
2. ใช้ shorthand `codeToHtml` — load themes/langs on-demand และ cache ให้เอง:

   ```ts
   import { codeToHtml } from 'shiki'

   const html = await codeToHtml('const a = 1', { lang: 'javascript', theme: 'vitesse-dark' })
   ```

3. Intermediate outputs: `codeToTokens`, `codeToHast` สำหรับ render เอง
4. ดู API ทั้งหมดใน [API reference](references/apis.md)

### 2. Long-Lived Highlighter

> Goal: highlight ซ้ำอย่างมีประสิทธิภาพ

1. ใช้ `createHighlighter({ themes, langs })` ครั้งเดียว เก็บเป็น singleton — ห้ามสร้างใน hot path
2. ระบุ themes/langs แบบ explicit — v1+ ต้องโหลดก่อนใช้ (`loadTheme`, `loadLanguage` เติมทีหลังได้)
3. Sync usage → `createHighlighter` แล้วเรียก `codeToHtml` แบบ sync ได้

### 3. Bundle Control

> Goal: คุม bundle size และ runtime compat

1. Fine-grained imports: `shiki/core`, `@shikijs/langs/<lang>`, `@shikijs/themes/<theme>`
2. RegExp engines: `shiki/engine/oniguruma` (WASM, accurate) vs `shiki/engine/javascript` (pure JS, no WASM)
3. Cloudflare Workers ไม่รองรับ WASM init จาก binary — ใช้ fine-grained bundle + `loadWasm(import('shiki/onig.wasm'))` หรือ JS engine
4. ใช้ `@shikijs/codegen` generate bundle เฉพาะที่ใช้

### 4. Dual Themes And Transformers

> Goal: theme ตาม light/dark และปรับ output

1. ใช้ `themes: { light, dark }` option → CSS variables (`--shiki-light`/`--shiki-dark`) สลับตาม media/class โดยไม่ render ซ้ำ
2. `@shikijs/transformers`: `transformerNotationDiff`, `transformerNotationHighlight`, `transformerNotationFocus`, `transformerNotationErrorLevel`, `transformerMetaHighlight`, `transformerCompactLineOptions`, `transformerRemoveLineBreak`
3. เขียน transformer เองได้ — hooks บน `pre`/`code`/`line`/`span`/`post`

### 5. Integrations

> Goal: เลือก integration ตาม stack

1. Markdown pipelines: `@shikijs/markdown-it`, `markdown-exit`, `@shikijs/rehype` — หรือผ่าน Comark plugin `comark/plugins/shiki` (ดู `/follow-lib-comark`)
2. Frameworks: `@shikijs/vitepress`, `@shikijs/nuxt`, `@shikijs/next`, `@shikijs/astro`
3. Editor/runtime: `@shikijs/monaco`, `@shikijs/twoslash` (TypeScript hover info), `@shikijs/magic-move` (animated transitions), `@shikijs/stream` (streaming highlight)
4. CLI สำหรับ one-off/file → html/svg: ดู [CLI reference](references/cli.md)

## Rules

### 1. Zero Runtime Preference

- Highlight ล่วงหน้า (build/SSR) — ship HTML ไม่ ship highlighter ไป client เว้นแต่จำเป็น (dynamic user input)
- Inline styles ใน output — ไม่ต้องการ CSS เพิ่มเว้นแต่ใช้ dual themes/transformers

### 2. Explicit Loading

- ระบุ themes/langs explicit เสมอ — ห้าม `Object.keys(bundledLanguages)` โหลดทั้งหมดใน production
- Highlighter เป็น singleton อายุยาว — reuse ข้าม renders

### 3. Engine Choice

- Default oniguruma (WASM) = accurate; JS engine เมื่อ WASM ใช้ไม่ได้ (บาง edge runtimes)
- Workers/Edge → เช็ค WASM constraints ก่อนเลือก engine

- ใช้ /improve uxui ถ้าจำเป็น
- ใช้ /follow-lib-comark ถ้าจำเป็น
- ใช้ /follow-lib-markdown-it ถ้าจำเป็น
- ใช้ /follow-tool-vitepress ถ้าจำเป็น

## References

- [API reference](references/apis.md)
- [CLI reference](references/cli.md)

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `shiki` ติดตั้งและ highlight ได้ทั้ง async shorthand และ singleton highlighter
- Themes/langs โหลด explicit, bundle คุมขนาดได้ด้วย fine-grained imports
- เลือก integration ถูกตาม stack (markdown-it, rehype, VitePress, Nuxt, Next, Astro, Comark)
- พร้อมใช้ใน `/improve uxui` fixes สำหรับ code highlighting

# Shiki — Best Practices

TextMate-grammar syntax highlighter — highlight ล่วงหน้า ship zero runtime JS

## Recommended Patterns

- Highlight ที่ build/SSR time — ship HTML + inline styles ไม่ ship highlighter ไป browser
- Shorthand (`codeToHtml`) สำหรับ Node/scripts — auto-cache + on-demand loading
- `createHighlighter` singleton สำหรับ repeated renders — ระบุ `themes`/`langs` explicit
- Dual themes `{ light, dark }` → CSS vars — dark mode toggle ไม่ต้อง re-highlight
- `@shikijs/transformers` สำหรับ `// [!code highlight]`, `// [!code ++]`, focus, error levels — notation comments เป็น DX มาตรฐาน
- Fine-grained bundles (`shiki/core` + `@shikijs/langs/*` + `@shikijs/themes/*`) เมื่อ bundle size สำคัญ

## Common Pitfalls

- `createHighlighter` ใน request handler/loop = memory + WASM init ทุกครั้ง — hoist เป็น module singleton
- โหลด `Object.keys(bundledLanguages)` ทั้งหมด = bundle บวม — explicit lists เสมอ
- v1+ themes/langs ไม่ auto-load — เรียก `codeToHtml` ด้วย lang ที่ยังไม่ load → throw
- Cloudflare Workers: WASM binary init ไม่ได้ → `loadWasm(import('shiki/onig.wasm'))` หรือ `shiki/engine/javascript`
- Dual themes + transformers ต้อง CSS ประกอบ (`.line`, `.highlighted` classes) — ไม่ใช่ inline-style-only เหมือน single theme

## UX/UI Integration

- ใช้ใน `/improve-uxui` เมื่อ code blocks ขาด highlight, theme ไม่ตรง dark/light, หรือไม่มี line highlights/focus
- Pair กับ `/follow-lib-comark` — plugin `comark/plugins/shiki` highlight code fences ใน markdown pipeline
- Code blocks ใน docs site → prefer VitePress/Nuxt/Next/Astro integrations มากกว่า manual wiring

## Do / Don't

| Do | Don't |
|----|-------|
| highlight ล่วงหน้า build/SSR | ship highlighter ไป client โดยไม่จำเป็น |
| singleton `createHighlighter` | สร้าง highlighter ใหม่ทุก render |
| explicit `themes`/`langs` lists | load bundled catalogs ทั้งหมด |
| dual themes CSS vars สำหรับ dark mode | render ซ้ำเมื่อ toggle theme |
| JS engine บน runtimes ที่ WASM จำกัด | assume WASM ใช้ได้ทุกที่ |

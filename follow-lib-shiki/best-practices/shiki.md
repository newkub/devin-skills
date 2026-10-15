# Shiki — Best Practices

TextMate-grammar syntax highlighter — highlight ahead of time, ship zero runtime JS

## Recommended Patterns

- Highlight at build/SSR time — ship HTML + inline styles, don't ship the highlighter to the browser
- Shorthand (`codeToHtml`) for Node/scripts — auto-cache + on-demand loading
- `createHighlighter` singleton for repeated renders — specify `themes`/`langs` explicitly
- Dual themes `{ light, dark }` → CSS vars — dark mode toggle needs no re-highlight
- `@shikijs/transformers` for `// [!code highlight]`, `// [!code ++]`, focus, error levels — notation comments are the standard DX
- Fine-grained bundles (`shiki/core` + `@shikijs/langs/*` + `@shikijs/themes/*`) when bundle size matters

## Common Pitfalls

- `createHighlighter` in a request handler/loop = memory + WASM init every time — hoist it to a module singleton
- Loading all of `Object.keys(bundledLanguages)` = bloated bundle — always use explicit lists
- v1+ themes/langs don't auto-load — calling `codeToHtml` with a lang that isn't loaded → throw
- Cloudflare Workers: can't init the WASM binary → use `loadWasm(import('shiki/onig.wasm'))` or `shiki/engine/javascript`
- Dual themes + transformers need supporting CSS (`.line`, `.highlighted` classes) — not inline-style-only like a single theme

## UX/UI Integration

- Use in `/improve uxui` when code blocks lack highlighting, the theme doesn't match dark/light, or there are no line highlights/focus
- Pair with `/follow-lib-comark` — the `comark/plugins/shiki` plugin highlights code fences in the markdown pipeline
- Code blocks in a docs site → prefer VitePress/Nuxt/Next/Astro integrations over manual wiring

## Do / Don't

| Do | Don't |
|----|-------|
| highlight ahead of time at build/SSR | ship the highlighter to the client unnecessarily |
| singleton `createHighlighter` | create a new highlighter every render |
| explicit `themes`/`langs` lists | load the entire bundled catalogs |
| dual themes CSS vars for dark mode | re-render when toggling the theme |
| JS engine on runtimes where WASM is restricted | assume WASM works everywhere |

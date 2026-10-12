| key | value |
|---|---|
| package | `shiki` |
| install | `bun add -D shiki` |
| stable version | 4.5.0 (verified 2026-10-03) |
| license | MIT |
| docs | https://shiki.style |
| repository | https://github.com/shikijs/shiki |

| api | description | signature/example |
|---|---|---|
| `codeToHtml` | shorthand highlight → HTML string (auto-cache, on-demand load) | `await codeToHtml(code, { lang: 'ts', theme: 'vitesse-dark' })` |
| `codeToTokens` | shorthand → tokens สำหรับ render เอง | `await codeToTokens(code, { lang, theme })` |
| `codeToHast` | shorthand → HAST tree | `await codeToHast(code, { lang, theme })` |
| `createHighlighter` | สร้าง singleton highlighter (async init, sync render) | `await createHighlighter({ themes: ['nord'], langs: ['ts'] })` |
| `highlighter.codeToHtml` | sync highlight หลัง init | `highlighter.codeToHtml(code, { lang, theme })` |
| `loadTheme`/`loadLanguage` | โหลดเพิ่มหลังสร้าง instance | `await highlighter.loadLanguage('css')` |
| `createHighlighterCore` | fine-grained, ไม่ auto-bundle | `await createHighlighterCore({ themes: [nord], langs: [js], engine })` |
| `shiki/core` | core entry สำหรับ custom bundles | `import { createHighlighterCore } from 'shiki/core'` |
| `bundledLanguages`/`bundledThemes` | catalogs ของ lang/theme built-in | `import { bundledLanguages } from 'shiki'` |
| `shiki/engine/oniguruma` | Oniguruma WASM engine (default, accurate) | `createOnigurumaEngine(import('shiki/wasm'))` |
| `shiki/engine/javascript` | pure-JS RegExp engine (no WASM) | `createJavaScriptRegexEngine()` |
| `loadWasm` | โหลด WASM manual (Workers/Edge) | `await loadWasm(import('shiki/onig.wasm'))` |
| dual themes | render CSS vars สำหรับ light/dark | `{ themes: { light: 'vitesse-light', dark: 'vitesse-dark' } }` |
| `transformers` option | array ของ transformers ต่อ render | `{ transformers: [transformerNotationDiff()] }` |
| `@shikijs/transformers` | notation/meta transformers pack | `transformerNotationDiff()`, `transformerNotationHighlight()`, `transformerNotationFocus()`, `transformerMetaHighlight()` |
| `@shikijs/markdown-it` | markdown-it plugin | `markdownIt().use(await markdownItShiki(opts))` |
| `@shikijs/rehype` | rehype plugin | `rehype().use(rehypeShiki, opts)` |
| `@shikijs/twoslash` | TypeScript twoslash hover info | `transformerTwoslash()` |
| `@shikijs/monaco` | ใช้ Shiki highlight ใน Monaco editor | `monacoHighlighter()` |
| `@shikijs/vitepress` | VitePress theme/config integration | ดู https://shiki.style/packages/vitepress |
| `@shikijs/magic-move` | animated transitions ระหว่าง code states | `MagicMoveRenderer` |
| `@shikijs/stream` | incremental highlight ของ streaming text | `codeToHtml` streaming variant |
| `@shikijs/codegen` | generate bundle เฉพาะ langs/themes ที่ใช้ | codegen CLI/API |
| `@shikijs/colorized-brackets` | bracket pair colorization | `transformerColorizedBrackets()` |
| `@shikijs/langs/<lang>` | per-language grammar package | `import js from '@shikijs/langs/javascript'` |
| `@shikijs/themes/<theme>` | per-theme package | `import nord from '@shikijs/themes/nord'` |

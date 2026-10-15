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
| `codeToTokens` | shorthand → tokens for custom rendering | `await codeToTokens(code, { lang, theme })` |
| `codeToHast` | shorthand → HAST tree | `await codeToHast(code, { lang, theme })` |
| `createHighlighter` | create a singleton highlighter (async init, sync render) | `await createHighlighter({ themes: ['nord'], langs: ['ts'] })` |
| `highlighter.codeToHtml` | sync highlight after init | `highlighter.codeToHtml(code, { lang, theme })` |
| `loadTheme`/`loadLanguage` | load more after creating the instance | `await highlighter.loadLanguage('css')` |
| `createHighlighterCore` | fine-grained, no auto-bundle | `await createHighlighterCore({ themes: [nord], langs: [js], engine })` |
| `shiki/core` | core entry for custom bundles | `import { createHighlighterCore } from 'shiki/core'` |
| `bundledLanguages`/`bundledThemes` | catalogs of built-in langs/themes | `import { bundledLanguages } from 'shiki'` |
| `shiki/engine/oniguruma` | Oniguruma WASM engine (default, accurate) | `createOnigurumaEngine(import('shiki/wasm'))` |
| `shiki/engine/javascript` | pure-JS RegExp engine (no WASM) | `createJavaScriptRegexEngine()` |
| `loadWasm` | load WASM manually (Workers/Edge) | `await loadWasm(import('shiki/onig.wasm'))` |
| dual themes | render CSS vars for light/dark | `{ themes: { light: 'vitesse-light', dark: 'vitesse-dark' } }` |
| `transformers` option | array of transformers per render | `{ transformers: [transformerNotationDiff()] }` |
| `@shikijs/transformers` | notation/meta transformers pack | `transformerNotationDiff()`, `transformerNotationHighlight()`, `transformerNotationFocus()`, `transformerMetaHighlight()` |
| `@shikijs/markdown-it` | markdown-it plugin | `markdownIt().use(await markdownItShiki(opts))` |
| `@shikijs/rehype` | rehype plugin | `rehype().use(rehypeShiki, opts)` |
| `@shikijs/twoslash` | TypeScript twoslash hover info | `transformerTwoslash()` |
| `@shikijs/monaco` | use Shiki highlighting in Monaco editor | `monacoHighlighter()` |
| `@shikijs/vitepress` | VitePress theme/config integration | see https://shiki.style/packages/vitepress |
| `@shikijs/magic-move` | animated transitions between code states | `MagicMoveRenderer` |
| `@shikijs/stream` | incremental highlight of streaming text | `codeToHtml` streaming variant |
| `@shikijs/codegen` | generate a bundle with only the langs/themes used | codegen CLI/API |
| `@shikijs/colorized-brackets` | bracket pair colorization | `transformerColorizedBrackets()` |
| `@shikijs/langs/<lang>` | per-language grammar package | `import js from '@shikijs/langs/javascript'` |
| `@shikijs/themes/<theme>` | per-theme package | `import nord from '@shikijs/themes/nord'` |

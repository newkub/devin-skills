# Use Case — Highlight at Build Time with One Singleton

> Render code blocks to HTML during the build so the client never downloads a highlighter. Source: https://shiki.style/guide/ (accessed 2026-10-20)

## 1. Create the highlighter once

```ts
// src/lib/highlighter.ts
import { createHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

export function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["vitesse-dark", "vitesse-light"],
    langs: ["ts", "tsx", "bash", "json"],
  });
  return highlighterPromise;
}
```

One promise, cached at module scope — creating a highlighter per request pays grammar and theme loading every time.

## 2. Highlight synchronously after init

```ts
export async function renderCode(code: string, lang: string) {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages();
  if (!loaded.includes(lang)) await highlighter.loadLanguage(lang as never);

  return highlighter.codeToHtml(code, { lang, theme: "vitesse-dark" });
}
```

Reading `getLoadedLanguages()` before `loadLanguage` avoids the throw for a language outside the initial set.

## 3. Do it in the build, not in the browser

```ts
// scripts/build-docs.ts
import { writeFileSync } from "node:fs";
import { renderCode } from "../src/lib/highlighter";

const html = await renderCode("const a: number = 1", "ts");
writeFileSync("public/snippet.html", html);
```

Styles are inlined on the spans, so the emitted HTML needs no stylesheet — the zero-runtime claim only holds if the call happens at build/SSR time.

## 4. Keep the client bundle free of grammars

```ts
// server-only entry — never imported by a client component
import "server-only";
export { renderCode } from "./highlighter";
```

A single import from a client component pulls the whole grammar set into the bundle; the `server-only` guard fails the build instead of shipping it silently.

## 5. Use fine-grained imports when the bundle must shrink

```ts
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import ts from "@shikijs/langs/ts";
import vitesseDark from "@shikijs/themes/vitesse-dark";

export const highlighter = await createHighlighterCore({
  themes: [vitesseDark],
  langs: [ts],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});
```

Explicit `@shikijs/langs/*` and `@shikijs/themes/*` imports drop every grammar you do not name.

## Pitfalls

- Calling `codeToHtml` (the shorthand) inside a render loop reloads themes each time — use the singleton highlighter for repeated work.
- Importing the highlighter into a client component ships hundreds of KB of grammars to the browser.
- Forgetting `await highlighter.loadLanguage()` for a language outside the initial set throws at render time.
- Loading every bundled language "just in case" is the single biggest bundle regression in docs sites.
- Using the JS engine by default changes output for some grammars — prefer oniguruma unless the runtime blocks WASM.
- Expecting extra CSS for single-theme output: styles are inlined already.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/shiki.md`
- `usecases/dual-theme-and-transformers.md`

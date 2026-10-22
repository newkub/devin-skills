# Use Case — Highlight on an Edge Runtime

> A Worker has no filesystem, a tight CPU budget, and a WASM loader that behaves differently from Node — so the highlighter must be core-only, initialized once per isolate, and given an engine it can actually start. Source: https://shiki.style/guide/bundles (accessed 2026-10-20)

## 1. Start from the core bundle

```ts
// src/highlight.ts
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighterPromise: ReturnType<typeof createHighlighterCore> | undefined;

export function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [import("@shikijs/themes/vitesse-dark")],
    langs: [import("@shikijs/langs/ts"), import("@shikijs/langs/json")],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}
```

`shiki/core` pulls only the engine plus the grammars you name; the default `shiki` entry ships the full catalog, which is the wrong trade-off for a function with a size and cold-start budget.

## 2. Pick an engine the runtime can initialize

```ts
engine: createJavaScriptRegexEngine()
```

The JavaScript engine is pure RegExp — no WASM compilation step, so it starts on any runtime. Oniguruma (the default elsewhere) is more faithful for a few grammars but needs the WASM binary initialized; use it only after confirming the runtime supports the pattern (`createOnigurumaEngine(import("shiki/wasm"))` locally, or a bundled `onig.wasm` on Workers). If a grammar fails under the JS engine, that is the signal to move that one language back to Oniguruma rather than switching everything.

## 3. Keep the instance per isolate, not per request

```ts
export default {
  async fetch(request: Request): Promise<Response> {
    const lang = new URL(request.url).searchParams.get("lang") ?? "ts";
    const highlighter = await getHighlighter();
    const code = await request.text();

    if (!highlighter.getLoadedLanguages().includes(lang)) {
      return new Response(`Unsupported language: ${lang}`, { status: 400 });
    }

    const html = highlighter.codeToHtml(code, { lang, theme: "vitesse-dark" });

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  },
};
```

Module scope is evaluated once per isolate, so the promise is shared across requests that hit the same isolate. Creating the highlighter inside `fetch` pays grammar and engine init on every request and will hit the CPU limit under load.

## 4. Load languages before they are requested

```ts
export async function ensureLanguage(lang: string) {
  const highlighter = await getHighlighter();
  if (!highlighter.getLoadedLanguages().includes(lang)) {
    await highlighter.loadLanguage(lang as never);
  }
  return highlighter;
}
```

`loadLanguage` is async; a synchronous `codeToHtml` call for an unloaded grammar throws. `getLoadedLanguages()` is the cheap guard that turns a 500 into either a 400 or a lazy load.

## 5. Trust the escaper, and set a real content type

Shiki tokenizes the source and escapes it, so the returned HTML is safe to return as-is — pre-escaping the code double-encodes `&`, `<`, and `>`. Serve it as `text/html; charset=utf-8` (not `text/plain`) so browsers render it, and set `cache-control` for immutable snippets.

## 6. Verify

1. Deploy and call the endpoint twice — the second call is faster because the isolate reused the highlighter
2. Request an unloaded language — a 400, never a 500 with a stack trace
3. Highlight `<script>alert(1)</script>` as `ts` — the text appears verbatim and does not execute
4. Check the bundle — no `@shikijs/langs/*` package other than the two named
5. Set the account's CPU limit to the production value and render the longest snippet you support
6. A grammar that fails on the JS engine — confirm which one, then decide per language

## Pitfalls

- Importing from `shiki` instead of `shiki/core` in a Worker — the whole grammar catalog is bundled.
- Creating the highlighter inside `fetch` — engine init on every request, and a CPU-limit failure that looks like a timeout.
- `loadLanguage()` not awaited, so the render still throws for the "newly loaded" language.
- Calling `codeToHtml` with a language outside `langs` and expecting on-demand loading — v1+ requires an explicit load.
- Hand-escaping the code before passing it to Shiki, which renders `&lt;` literally.
- Choosing the JS engine for every language when only the unsupported grammar needed Oniguruma.
- Returning `text/plain` and wondering why the HTML tags are visible.

## Related

- `references/apis.md`
- `best-practices/shiki.md`
- `usecases/build-time-highlight.md`
- `usecases/markdown-pipeline.md`

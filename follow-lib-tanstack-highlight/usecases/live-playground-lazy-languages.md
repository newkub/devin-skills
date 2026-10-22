# Use Case — Live Code Playground With Lazy Languages

> Highlight user-edited code in the browser without shipping every grammar and without a highlight pass on each keystroke. Source: https://tanstack.com/highlight/latest (accessed 2026-10-20)

## 1. Decide what is static and what is live

| Content | Where to highlight |
|---|---|
| Docs, changelog, blog snippets | Build time (`precompute-at-build-time.md`) |
| Editor output, previews of user code | Client, debounced |

Only the second row belongs in this recipe. Everything else should already be HTML by the time the page loads.

## 2. Debounce and cancel stale passes

```ts
// src/highlight/live.ts
import { highlight } from "@tanstack/highlight"

let version = 0
const cache = new Map<string, string>()

export async function highlightLive(code: string, language: string): Promise<string | null> {
  const key = `${language}\u0000${code}`
  const cached = cache.get(key)
  if (cached) return cached

  const mine = ++version
  await new Promise((r) => setTimeout(r, 120))   // debounce window
  if (mine !== version) return null              // a newer edit arrived; drop this result

  const html = highlight(code, { language })
  if (cache.size > 50) cache.clear()             // bounded, or the tab grows forever
  cache.set(key, html)
  return html
}
```

The version counter is the important part: without it a slow pass for an older keystroke can overwrite the current output.

## 3. Keep grammars out of the entry bundle

```ts
// src/highlight/languages.ts
const loaders = {
  ts: () => import("@tanstack/highlight/languages/ts"),
  py: () => import("@tanstack/highlight/languages/python"),
  sql: () => import("@tanstack/highlight/languages/sql"),
} as const

export type Lang = keyof typeof loaders

export async function ensureLanguage(lang: Lang) {
  await loaders[lang]()   // confirm the subpath shape in the current release
}
```

Importing every language at module scope puts all grammars in the first chunk, which is exactly the cost the playground was supposed to avoid. Load one when the user switches to it, and keep the set to what the picker offers.

## 4. Render with a stable wrapper

```tsx
export function Preview({ html }: { html: string }) {
  return (
    <pre class="playground" aria-live="polite">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}
```

`aria-live="polite"` announces the result once per pause instead of on every keystroke, and the `<pre>` preserves indentation that a `<div>` would collapse.

## 5. Verify

1. `/run-bundle` (or the bundler's analyze) — the initial chunk contains no language grammar beyond the default
2. Type quickly in the editor — the preview never flickers back to older code (version guard works)
3. Switch language — only that grammar is fetched
4. Paste 2 000 lines — highlight completes within a frame budget you accept, or falls back to plain text above a size threshold
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Highlighting synchronously in the change handler → the caret lags on every keystroke; debounce and keep the previous HTML until the new one lands.
- Unbounded memo cache → a long session holds thousands of full-file HTML strings; cap it or key by hash.
- Importing the package's "all languages" entry → the playground ships what it was meant to save.
- Treating user input as trusted HTML → the highlighter escapes, but any custom token wrapper you add must escape too.
- Re-mounting the `<pre>` on each result → scroll position and selection reset; update `innerHTML` on a stable node.

## Related

- `references/apis.md`
- `best-practices/tanstack-highlight.md`
- `usecases/highlight-code-block.md`
- `usecases/precompute-at-build-time.md`

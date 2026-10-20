# Use Case — Sanitize Markdown Output on the Server

> Sanitize CMS or markdown HTML in Bun/Node before it is stored, cached, or served. Source: https://github.com/cure53/DOMPurify#readme (accessed 2026-10-20)

## 1. Pick the environment strategy

| Runtime | Approach |
|---------|----------|
| Bun/Node (long-lived) | `dompurify` + one `jsdom` window created at module scope |
| Bun/Node (simple) | `isomorphic-dompurify` |
| Cloudflare Workers / workerd | no jsdom — sanitize in the browser or rely on Trusted Types |

```bash
bun add isomorphic-dompurify
```

## 2. Reuse one instance

```ts
import { JSDOM } from "jsdom"
import createDOMPurify from "dompurify"

const window = new JSDOM("").window
const purify = createDOMPurify(window)

export function sanitizeHtml(dirty: string) {
  return purify.sanitize(dirty, { USE_PROFILES: { html: true } })
}
```

Creating a `JSDOM` window per request is the usual performance bug in SSR sanitization: build it once per process.

## 3. Sanitize the rendered markdown, not the markdown source

```ts
const html = await renderMarkdown(post.markdown)
const safe = sanitizeHtml(html)
await cache.set(key, safe)
```

Sanitizing before rendering does nothing — raw HTML and attribute injection only exist after the markdown renderer runs.

## 4. Handle worker runtimes explicitly

```ts
export const canSanitize = typeof window !== "undefined" || hasDomImplementation()
```

In workerd, skip the jsdom path and sanitize at the edge that renders (or store pre-sanitized HTML at authoring time). Never silently return unsanitized HTML because the DOM is missing.

## 5. Verify with server-side tests

```ts
expect(sanitizeHtml(`<img src=x onerror="alert(1)">`)).not.toContain("onerror")
expect(sanitizeHtml(`<a href="javascript:alert(1)">x</a>`)).not.toContain("javascript:")
```

## Pitfalls

- Building a new jsdom instance per request → heavy CPU and memory; hoist it to module scope.
- Importing `dompurify` in a worker and calling `sanitize` → `isSupported` is false and sanitize throws or returns input depending on the build.
- Sanitizing on the client only → the stored HTML still reaches RSS, emails, and API consumers unfiltered.
- Using a hand-written regex filter for tags → mXSS and attribute parsing bypass it; keep a parser-based sanitizer.

## Related

- `references/apis.md`
- `best-practices/dompurify.md`
- `usecases/sanitize-user-html.md`

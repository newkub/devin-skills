# Use Case — Render Markdown to HTML at Build Time

> Parse once, cache the serializable document, and render static HTML for docs, RSS, or email. Source: https://comark.dev (accessed 2026-10-20)

## 1. Install the core and the HTML renderer

```bash
bun add comark @comark/html
bun add @comark/html/plugins/shiki # only when highlighting is needed
```

## 2. Parse once, keep the document

```ts
import { parseMarkdown } from "comark"

const doc = await parseMarkdown(source)
```

`parseMarkdown` returns a `MarkdownDocument` — plain serializable data. Store it in a cache keyed by file hash instead of re-parsing on every request.

## 3. Render to HTML

```ts
import { renderHtml } from "@comark/html"

const html = await renderHtml(source)
```

Add plugins only when the content needs them:

```ts
import { renderHtml } from "@comark/html"
import shiki from "@comark/html/plugins/shiki"

const html = await renderHtml(source, {
  plugins: [shiki({ themes: { light: "github-light", dark: "github-dark" } })],
})
```

## 4. Sanitize untrusted content

```ts
import DOMPurify from "isomorphic-dompurify"

const safe = DOMPurify.sanitize(html, {
  USE_PROFILES: { html: true },
})
```

Markdown is not a trust boundary: authors can embed raw HTML, so sanitize the rendered string whenever the source is user or CMS content.

## 5. Ship the artifact

Write `html` into the static build output, the RSS `<content:encoded>` field, or the email template — no client-side markdown runtime needed.

## Pitfalls

- Rendering on every request → parsing and highlighting dominate the response time; cache the document or the final HTML.
- Enabling every plugin globally → bundle and build time grow for content that never uses mermaid or math; enable plugins per content type.
- Skipping sanitization because "the renderer escapes markdown" → raw HTML inside markdown still passes through.
- Importing a framework renderer in a build script → pulls UI runtime into a static pipeline; use `@comark/html`.

## Related

- `references/apis.md`
- `best-practices/comark.md`
- `usecases/stream-ai-markdown.md`

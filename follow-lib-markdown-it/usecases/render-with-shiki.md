# Use Case — Render Markdown With Shiki Highlighting

> Build one markdown-it instance with an awaited highlighter, then render documents without leaking raw HTML. Source: https://markdown-it.github.io/ (accessed 2026-10-20)

## 1. Install

```bash
bun add markdown-it @shikijs/markdown-it
```

markdown-it v15 ships its own types; do not add `@types/markdown-it`.

## 2. Await the highlighter before first render

```ts
import MarkdownIt from "markdown-it"
import Shiki from "@shikijs/markdown-it"

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

md.use(await Shiki({ theme: "github-dark" }))
```

`@shikijs/markdown-it` is async: the module setup must be awaited once, then the same instance is reused.

## 3. Render and reuse

```ts
export function renderPost(markdown: string) {
  return md.render(markdown)
}
```

Create the instance at module scope. Building it per request reloads grammars and themes every time.

## 4. Pick the preset by content

```ts
const strict = new MarkdownIt("commonmark") // spec-tight
const minimal = new MarkdownIt("zero")      // no extras
```

Use `commonmark` for user-generated content that must follow the spec, `default` for docs, `zero` when every rule is opt-in.

## 5. Sanitize when HTML is enabled

```ts
import DOMPurify from "isomorphic-dompurify"

const md = new MarkdownIt({ html: true })
const html = DOMPurify.sanitize(md.render(untrusted))
```

`html: true` passes raw tags through. Either keep it false or sanitize the output — markdown is not a trust boundary.

## Pitfalls

- Forgetting `await` on the shiki plugin → code blocks render unhighlighted with no error.
- Creating a `MarkdownIt` per request → re-parsing grammars and themes; hoist the instance.
- Leaving `html: true` with user content → stored XSS; disable it or sanitize.
- Rendering the same large document repeatedly → cache the HTML by content hash.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/rendering.md`
- `usecases/anchors-and-toc.md`

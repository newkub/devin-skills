# Use Case — Render Markdown to an HTML String

> Turn Markdown into HTML at build time and read the frontmatter that came with it. Source: https://satteri.bruits.org/docs/quick-start (read 2026-10-24)

## 1. Install

```bash
bun add satteri
```

`satteri` ships native prebuilds for macOS (arm64/x64), Linux x86_64, and Windows x86_64; everything else resolves to the WASI build.

## 2. Render

```ts
import { markdownToHtml } from "satteri";

const { html, frontmatter } = markdownToHtml(source);
```

The call is synchronous. It returns a `Promise` only when a plugin visitor is async.

## 3. Read the frontmatter

```ts
const { frontmatter } = markdownToHtml(source);

if (frontmatter?.kind === "yaml") {
  const meta = parseYaml(frontmatter.value);
}
```

`frontmatter` is `{ kind: "yaml" | "toml", value }` — the raw text, not a parsed object. Parse it yourself so you control the YAML library and its safety options.

## 4. Write the artifact

```ts
await Bun.write(outPath, html);
```

`markdownToHtml` ends with a trailing newline; `hastToHtml` does not.

## Pitfalls

- Expecting `frontmatter` to be an object → it is raw text plus a `kind` discriminator.
- Re-parsing the same source on every request → cache the final HTML keyed by file hash.
- Assuming raw HTML is escaped → `markdownToHtml` re-emits it verbatim; sanitize untrusted content with `follow-lib-dompurify`.
- Rendering with a JSX runtime when only HTML is needed → use `markdownToHtml`, not `evaluate`.

## Related

- `references/apis.md`
- `best-practices/satteri.md`
- `usecases/features-and-frontmatter.md`

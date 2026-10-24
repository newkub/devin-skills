# Sätteri — Features, Plugins, and Pitfalls

## Feature Flags

`gfm` and `frontmatter` are on by default. Everything else is opt-in:

| Flag | Enables | Notes |
| --- | --- | --- |
| `gfm` | Tables, strikethrough, footnotes, task lists | Off only for strict CommonMark |
| `frontmatter` | YAML (`---`) and TOML (`+++`) blocks | Returned raw, not parsed |
| `math` | `$inline$` and `$$block$$` | Produces `math` / `inlineMath` nodes |
| `headingAttributes` | `# Title {#id .class}` | |
| `directive` | `:::note[Title]` containers, leaves, text directives | |
| `superscript` | `^text^` | |
| `subscript` | `~text~` | Conflicts with `gfm` strikethrough |
| `wikilinks` | `[[Page]]` | |
| `definitionList` | Term / description lists | |
| `smartPunctuation` | Smart quotes, dashes, ellipses | Changes text output |
| `rawHtml` | Reparses inline and block HTML into real HAST elements | Positions are lost through the reparse |

Feature-gated plugins only fire when the flag is enabled — a `table` visitor never runs with `gfm: false`.

### Frontmatter Is Raw

```ts
const { frontmatter } = markdownToHtml(source);
// frontmatter === { kind: "yaml" | "toml", value: "<raw text>" } | null
```

Parse `value` with the project's YAML/TOML parser and validate it at the boundary. Do not hand-roll a parser for it.

### Footnotes

GFM footnotes are customizable through the `features.gfm` options: `label`, `backContent`, `backLabel` (supports the `{reference}` placeholder and callbacks), and `clobberPrefix` to keep generated ids from colliding across documents on one page.

## Plugin Design

### Definitions vs Factories

- Stateless transform → a definition, reused for every compile.
- Per-document state (slug sets, counters, caches) → a factory: it runs once per compile, so anything it closes over resets.
- A preset that needs shared state across several plugins → a factory returning an array bundle.

```ts
const headingAnchors = () => {
  const slugs = new Set();
  return [collectSlugs(slugs), linkSlugs(slugs)];
};
```

### Skipping Cheaply

Return `null`/`undefined`/`false` from a factory to skip a plugin for a document. A skipped plugin registers no visitors, so the pipeline keeps its fast path and does not pay for position tracking.

```ts
const onlyChangelogs = (ctx) =>
  ctx.fileURL?.pathname.endsWith("/CHANGELOG.md") ? rewriteVersions : null;
```

Keep factories cheap — they run per compile even when they skip.

### Stage Choice

- MDAST: structure changes — rewrite headings, resolve link references, collect a TOC, attach frontmatter-derived data.
- HAST: output changes — add attributes, wrap elements, highlight code, rewrite links.
- Cross-stage data travels in `ctx.data`, which is the same object across the mdast→hast boundary.

### Raw HTML Injection

Return `{ raw: "<span class=\"x\">…</span>", mdxExpressions: false }`. Do not return `{ type: "html", value }` — it works under `markdownToHtml` but throws under `mdxToJs`.

### Positions

`node.position` is `undefined` unless a plugin declares `options: { position: true }`. One opted-in plugin turns it on for the entire pipeline and costs ~15% of parse time — declare it only where a visitor reads it.

## Common Pitfalls

1. **Treating frontmatter as parsed.** It is a raw string plus its fence kind.
2. **Installing `marked`, `markdown-it`, or `comark` alongside Sätteri.** One engine per pipeline.
3. **Returning an `html` mdast node.** Use `{ raw, mdxExpressions: false }` so MDX compilation does not throw.
4. **Expecting HTML in `markdownToJs`.** It is dropped at JSX generation unless `rawHtml: true` parses it into elements.
5. **Assuming a string `fileURL`.** It must be a `URL` (`pathToFileURL(...)`).
6. **Sharing one `data` bag across compiles.** It is mutated in place; pass a fresh object per compile.
7. **Passing `0` or `""` as a skip value.** Only `null`, `undefined`, and `false` skip; anything else throws.
8. **Enabling `subscript` and `gfm` together.** `~` is ambiguous; decide which syntax the content uses.
9. **Upgrading across a minor without reading the changelog.** Pre-1.0 breaking changes ship in minor releases.
10. **Leaving `position` on by default in tree functions.** Pass `position: false` when nothing reads it.

## Security

- MDX is code: `evaluate` runs the module. Never accept MDX from untrusted authors.
- Untrusted Markdown still needs output sanitization when raw HTML or user links can reach the page — see `/follow-lib-dompurify`.
- Keep `rawHtml` off for untrusted content unless sanitization runs afterwards.

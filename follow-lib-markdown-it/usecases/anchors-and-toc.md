# Use Case — Anchors, Table of Contents, and a Custom Rule

> Add stable heading ids, build a TOC, and override one renderer rule without forking the whole renderer. Source: https://markdown-it.github.io/ (accessed 2026-10-20)

## 1. Install the plugins

```bash
bun add markdown-it markdown-it-anchor markdown-it-toc-done-right
```

## 2. Wire anchor + TOC

```ts
import MarkdownIt from "markdown-it"
import anchor from "markdown-it-anchor"
import toc from "markdown-it-toc-done-right"

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "")

const md = new MarkdownIt({ html: false })
  .use(anchor, { slugify, permalink: anchor.permalink.linkInsideHeader({ symbol: "#" }) })
  .use(toc, { slugify, containerClass: "toc" })
```

Both plugins must use the same `slugify`, otherwise TOC links point at ids that do not exist.

## 3. Place the TOC marker

```md
[[toc]]

## Getting started
```

`markdown-it-toc-done-right` replaces the marker with a nested list built from headings.

## 4. Override one renderer rule

```ts
const defaultLinkOpen = md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("rel", "noopener noreferrer")
  return defaultLinkOpen(tokens, idx, options, env, self)
}
```

Keep the default renderer as the fallback so only the attribute you care about changes.

## 5. Inspect tokens when the output surprises you

```ts
const tokens = md.parse(source, {})
console.log(tokens.filter((t) => t.type === "heading_open"))
```

`parse` returns the token stream before render; it is the fastest way to see whether a plugin or a rule produced the wrong markup.

## Pitfalls

- Two different slugify functions → TOC links and heading ids diverge; share one helper.
- Replacing `link_open` entirely → headings, code, and images may render incorrectly; wrap the default rule.
- Enabling `html: true` to support anchors → raw HTML reaches the page; sanitize or keep it off.
- Rendering the TOC per request for static docs → build once and cache the HTML.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/plugins.md`
- `usecases/render-with-shiki.md`

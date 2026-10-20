# Use Case — Parse Tokens and Custom Renderer Rules

> Read the token stream when you need data from the markdown, and override a renderer rule when you need the HTML to carry something the default does not. Source: https://github.com/markdown-it/markdown-it (accessed 2026-10-20)

## 1. Parse instead of render

```ts
import MarkdownIt from "markdown-it";

const md = new MarkdownIt("commonmark");

const tokens = md.parse(source, {});
const headings = tokens.filter((token) => token.type === "heading_open");
```

`md.parse` returns the token stream before any HTML exists: `nesting` (1 open, 0 self-closing, -1 close), `tag`, `attrs`, `content`, and `map` with source line numbers. Use it whenever the answer is data — a table of contents, a reading time, a link inventory — rather than markup.

## 2. Walk inline children for plain text

```ts
type InlineToken = { type: string; content: string; children?: InlineToken[] };

function inlineText(token: InlineToken): string {
  return (token.children ?? [])
    .filter((child) => child.type === "text" || child.type === "code_inline")
    .map((child) => child.content)
    .join("");
}

export function excerpt(source: string, max = 160): string {
  const tokens = md.parse(source, {});
  const paragraph = tokens.find((token) => token.type === "inline");

  const text = paragraph ? inlineText(paragraph) : "";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
```

The text of a paragraph lives in `token.children`, not `token.content`. Reading `content` gives you the raw markdown of the paragraph, including its emphasis markers and link syntax.

## 3. Override a renderer rule

```ts
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href") ?? "";
  const external = /^https?:/i.test(href);

  if (external) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  }

  return self.renderToken(tokens, idx, options);
};
```

The rule receives the whole token array and the index of the current token, so you can inspect the `href` before deciding. Returning `self.renderToken(...)` keeps the default attribute serialization instead of hand-writing HTML. Overriding `link_close` is not needed — only the opening tag carries attributes.

## 4. Turn rules off per content type

```ts
const commentMd = new MarkdownIt("default").disable(["table", "code", "fence"]);
const docsMd = new MarkdownIt("commonmark").enable(["table", "strikethrough"]);
```

`disable` and `enable` take a rule name or an array. A comment field does not need tables or fenced code, and disabling them removes two parsing paths that only exist to be abused. Keep one instance per content type instead of mutating a shared instance per request.

## 5. Pass per-render state through env

```ts
type Env = { slugPrefix: string };

md.renderer.rules.heading_open = (tokens, idx, options, env) => {
  const { slugPrefix } = env as Env;
  const text = tokens[idx + 1]?.content ?? "";
  const slug = `${slugPrefix}${text}`.toLowerCase().replace(/\s+/g, "-");

  tokens[idx].attrSet("id", slug);
  return md.renderer.renderToken(tokens, idx, options);
};

const html = md.render(source, { slugPrefix: "guide-" } satisfies Env);
```

The `env` object is threaded through every rule for one render, which is the supported place for per-request values. A module-level variable works in a test and breaks under concurrent requests.

## 6. Verify

1. `/run-test` — `excerpt` returns text without `*` or `[]()` markers
2. Render a document with an external and an internal link — only the external one gets `rel="noopener noreferrer"`
3. A comment rendered with the restricted instance shows a `|` table as plain text
4. `tokens.map((t) => t.type)` shows `heading_open` and `heading_close` balanced
5. `/run-verify` — the token import type resolves, no `any`

## Pitfalls

- Reading `token.content` for a paragraph and getting raw markdown instead of text.
- Mutating a module-level markdown-it instance with per-request state such as `env`.
- Hand-writing HTML in a renderer rule instead of mutating attrs and calling `renderToken`.
- Forgetting that `attrGet` returns `null`, then calling `.startsWith` on it.
- Enabling every rule for comments because "it is only markdown", which reopens the raw HTML and link surface.

## Related

- `references/apis.md`
- `best-practices/rendering.md`
- `best-practices/plugins.md`
- `usecases/anchors-and-toc.md`
- `usecases/presets-and-hardening.md`
- `usecases/cli-and-batch-render.md`

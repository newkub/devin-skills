# Use Case — Presets and Hardening

> Pick the rule set that matches the content, and close the two holes markdown-it leaves open by default: raw HTML and link schemes. Source: https://github.com/markdown-it/markdown-it (accessed 2026-10-20)

## 1. Choose the preset before adding plugins

```ts
import MarkdownIt from "markdown-it";

const md = new MarkdownIt("commonmark", {
  html: false,
  linkify: true,
  typographer: true,
});
```

`default` is CommonMark plus tables and strikethrough, `commonmark` is the strict spec, and `zero` enables almost nothing so you can turn on only what you need. Choosing `default` and then disabling rules one by one leaves the output dependent on whatever the preset adds next release.

## 2. Keep raw HTML off for anything a user wrote

```ts
const content = new MarkdownIt("commonmark", { html: false });
const html = content.render(userInput);
```

With `html: false`, a `<script>` tag in the source is escaped and rendered as text. Turning it on for a comment box, a PR body, or a CMS field hands the author a template injection. Enable it only for markdown files that live in the repo and go through review.

## 3. Restrict the schemes a link may use

```ts
const defaultValidate = md.validateLink.bind(md);

md.validateLink = (url: string) =>
  /^(https?:|mailto:|\/|#)/i.test(url) && defaultValidate(url);
```

The default check already blocks `javascript:` in most cases, but it still allows schemes you may not want — `data:`, `vbscript:`, custom app protocols. An allowlist states the intent, and `#`/`/` keep in-page anchors and relative links working.

## 4. Sanitize the rendered HTML as well

```ts
import DOMPurify from "isomorphic-dompurify";

const html = DOMPurify.sanitize(md.render(userInput), {
  ALLOWED_URI_REGEXP: /^(?:https?|mailto):/i,
});
```

Two layers, not one: the renderer decides what markdown becomes, the sanitizer decides what reaches the DOM. A plugin added six months from now can start emitting an attribute the renderer never produced — the sanitizer is what keeps that from becoming an XSS.

## 5. Lock the configuration in a test

```ts
import { expect, it } from "vitest";

it("escapes raw HTML", () => {
  expect(content.render("<img src=x onerror=alert(1)>")).not.toContain("<img");
});

it("drops javascript links", () => {
  expect(content.render("[x](javascript:alert(1))")).not.toContain("javascript:");
});
```

## 6. Verify

1. `/run-test` — the two hardening tests above fail if a preset change re-enables raw HTML
2. Render a real page with a `<script>`, a `javascript:` link, and a `data:` image — all three are inert
3. Relative links and `#anchors` still work in the output
4. `/run-verify` — no `any` cast on the `validateLink` override

## Pitfalls

- Enabling `html: true` globally to make one documentation page work, which opens every caller.
- Trusting the renderer alone and skipping sanitization, then adding an attribute-emitting plugin later.
- Replacing `validateLink` with a regex that drops relative URLs, so every internal link stops rendering.
- Switching presets to fix one table, which silently changes emphasis, links, and list handling everywhere.
- Testing only the happy path, so the hardening is never exercised in CI.

## Related

- `references/apis.md`
- `best-practices/rendering.md`
- `usecases/render-with-shiki.md`
- `usecases/parse-tokens-and-custom-rules.md`
- `usecases/cli-and-batch-render.md`

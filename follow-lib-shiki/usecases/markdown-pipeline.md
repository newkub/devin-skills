# Use Case — Highlight Fenced Code in a Markdown Pipeline

> Handing markdown fences to Shiki means the plugin must be created once, with the same themes and transformers as the rest of the site, and wired into the renderer without making every render async. Source: https://shiki.style/packages/markdown-it (accessed 2026-10-20)

## 1. Create the markdown instance once

```ts
// src/markdown.ts
import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
import { transformerNotationDiff } from "@shikijs/transformers";

export const md = MarkdownIt({ html: true, linkify: true });

md.use(
  await Shiki({
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    transformers: [transformerNotationDiff()],
  }),
);
```

`Shiki()` is async because it initializes a highlighter, so the `await` belongs at module scope in a build script or server entry — not inside the request handler. One instance, reused for every document.

## 2. Pass transformers in the same options object

```ts
import { transformerNotationDiff, transformerNotationHighlight } from "@shikijs/transformers";

md.use(
  await Shiki({
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    transformers: [transformerNotationDiff(), transformerNotationHighlight()],
  }),
);
```

These are the same transformers you would pass to `codeToHtml`; the plugin forwards its options straight to the highlighter, so behaviour stays identical between markdown fences and code rendered directly.

## 3. Keep a fine-grained bundle

```ts
import { fromHighlighter } from "@shikijs/markdown-it/core";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

const highlighter = await createHighlighterCore({
  themes: [import("@shikijs/themes/vitesse-light"), import("@shikijs/themes/vitesse-dark")],
  langs: [import("@shikijs/langs/ts"), import("@shikijs/langs/bash")],
  engine: createOnigurumaEngine(() => import("shiki/wasm")),
});

md.use(fromHighlighter(highlighter, { /* same options */ }));
```

The default `@shikijs/markdown-it` entry imports the full bundle. `fromHighlighter` lets the same plugin run against a highlighter you already control, which is how a docs site keeps only the grammars it actually documents.

## 4. Use the async path when languages are unknown

```ts
import MarkdownItAsync from "markdown-it-async";
import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async";
import { codeToHtml } from "shiki";

const md = MarkdownItAsync();

md.use(
  fromAsyncCodeToHtml(codeToHtml, {
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
  }),
);

const html = await md.renderAsync(markdown);
```

Plain markdown-it cannot await a highlighter. `markdown-it-async` plus `fromAsyncCodeToHtml` keeps the shorthand's on-demand loading and returns a promise from `renderAsync` — the right shape when authors use languages you did not preload.

## 5. Know the `<pre><code>` wrapper constraint

markdown-it enforces `<pre><code>` as the outermost elements of a fence. A transformer that wraps the block in another `<div>` gets wrapped again, producing nested `<pre>` tags. If the design needs a wrapper, add `olets/markdown-it-wrapperless-fence-rule`, or write a fence rule that returns the HTML without the default wrapper — otherwise keep custom markup inside the `<code>` node.

## 6. Verify

1. Render a fence with `ts` — the output contains `class="shiki"` and per-token inline colors
2. Render a fence tagged with an unknown language — the block still renders (no crash) and the language is visibly unhandled
3. Dark mode — the same HTML switches colors without a re-render
4. `// [!code ++]` inside a fence — the comment is stripped and the line carries `diff add`
5. A transformer that wraps the block — confirm there is exactly one `<pre>` in the output
6. Build time — the plugin is created once, not per document

## Pitfalls

- `await Shiki()` inside a render function, which re-initializes the highlighter for every document.
- Using a transformer in markdown but not in the direct `codeToHtml` calls, so the same snippet renders differently in two places.
- Importing `@shikijs/markdown-it` in a client bundle — the plugin belongs in the build/SSR layer.
- Forgetting `markdown-it-async` and calling `md.render` with the async integration; `renderAsync` is the async entry.
- A custom transformer that adds a wrapper element, which markdown-it wraps in another `<pre><code>` pair.
- Preloading every language "because authors might use it" — the fine-grained path exists to avoid exactly that.

## Related

- `references/apis.md`
- `best-practices/shiki.md`
- `usecases/build-time-highlight.md`
- `usecases/custom-transformer.md`

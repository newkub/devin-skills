# Use Case — Syntax Highlighting and Plugins

> Highlight fenced code with the official plugin, pick themes per colour scheme, and avoid loading every language. Source: https://comark.dev/plugins (accessed 2026-10-20)

## 1. Add the Shiki plugin to the renderer

```ts
import { shiki } from "comark/plugins/shiki";

const plugins = [
  shiki({
    themes: { light: "github-light", dark: "github-dark" },
    langs: ["ts", "tsx", "bash", "json", "css"],
  }),
];
```

The plugin adds `data-theme`-aware token colours, so the same HTML responds to the colour-scheme switch without re-rendering. Passing `langs` bounds the grammar bundle — omitting it pulls the full Shiki language set into the build.

## 2. Wire it into a framework renderer

```vue
<script setup lang="ts">
import { Markdown } from "@comark/vue";
import { shiki } from "comark/plugins/shiki";

const plugins = [shiki({ themes: { light: "github-light", dark: "github-dark" } })];
defineProps<{ source: string }>();
</script>

<template>
  <Suspense>
    <Markdown :plugins="plugins">{{ source }}</Markdown>
  </Suspense>
</template>
```

Plugins are renderer-agnostic: the same array works with `renderHtml`, `renderAnsi`, React, and Svelte. Build the array once at module scope — a new array per render invalidates the highlight cache.

## 3. Use the lightweight path when bundle size wins

```ts
import { rangi } from "comark/plugins/rangi";
import { github } from "rangi/themes";

const plugins = [rangi({ theme: github })];
```

`rangi` is a synchronous, small highlighter with a fixed theme. Pick it for CLI output and email where a multi-theme token map is wasted; pick Shiki when the docs need accurate TextMate grammars.

## 4. Handle unknown languages

````md
```ts
const ok = true;
```

```nope
this fence has no grammar
```
````

An unknown language must fall back to plain text, not throw. Verify this in a test: `renderHtml` with `langs: ["ts"]` and a `nope` fence should still return the code block.

## 5. Verify

1. `/run-dev` — both themes render correctly when the OS scheme changes
2. `/run-build` — inspect the bundle: one grammar per configured language, not the full set
3. Streaming: a fence that arrives in two chunks highlights once, after it closes
4. `/run-test` — an unknown language and an unclosed fence both render without throwing

## Pitfalls

- Forgetting `langs`, which makes the build pull every grammar Shiki ships.
- Creating the plugin array inside a component body, so the highlight cache is rebuilt on each render.
- A theme pair that does not exist in the installed Shiki version — the plugin silently falls back to no colours.
- Adding Mermaid or math plugins without the matching components, so the diagram block renders as text.
- Highlighting on the client when the page is static; the tokens belong in the HTML at build time.

## Related

- `references/apis.md`
- `best-practices/comark.md`
- `usecases/render-markdown-html.md`
- `usecases/custom-components-and-frontmatter.md`

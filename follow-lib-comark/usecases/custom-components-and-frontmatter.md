# Use Case — Custom Components and Frontmatter

> Map `::block` syntax to real components and read the `---` metadata block without a second parser. Source: https://comark.dev/components (accessed 2026-10-20)

## 1. Author the content with block components

```md
---
title: Release notes
audience: developers
---

::alert{type="warning"}
This release drops Node 18.
::

::callout[Heads up]{icon="info"}
Inline components use a single colon: :badge[new]{tone="green"}.
::
```

Block components use `::name{props}` and close with `::`. Inline components use `:name[text]{props}`. Nested markdown inside the block body is still parsed, which is the point — you keep plain Markdown between the markers.

## 2. Register the components with the renderer

```vue
<script setup lang="ts">
import { Markdown } from "@comark/vue";
import Alert from "./Alert.vue";
import Callout from "./Callout.vue";
import Badge from "./Badge.vue";

const components = { alert: Alert, callout: Callout, badge: Badge };
defineProps<{ source: string }>();
</script>

<template>
  <Suspense>
    <Markdown :components="components">{{ source }}</Markdown>
  </Suspense>
</template>
```

Keys are lowercase and match the name used in the markdown. A missing mapping renders the raw `::alert` text, so an unstyled block on screen means the registry key is wrong, not the content.

Props are passed through as attributes — declare them explicitly in the component (`defineProps<{ type?: "warning" | "info" }>()`) or they arrive untyped and land in `$attrs`.

## 3. Read frontmatter on the server

```ts
import { parseMarkdown } from "comark";

const doc = await parseMarkdown(source);
const { title, audience } = doc.frontmatter;

export const metadata = { title, audience };
```

`parseMarkdown` returns a serializable `MarkdownDocument`, so the frontmatter is available without a YAML library and without re-parsing in the client. Cache the document itself when the same content is rendered in several places.

Do not trust frontmatter for authorization (`draft`, `published`) unless it comes from a reviewed source — it is content, not a policy.

## 4. Verify

1. `/run-dev` — the alert renders as a component with the prop applied; the nested markdown still renders
2. An unknown component name renders literally, as a visible warning that a mapping is missing
3. Frontmatter with a missing key yields `undefined`, not a crash
4. `/run-typecheck` — component props are typed at the call site
5. `/run-build` — the Vue renderer is used inside `<Suspense>`; a boundary mistake surfaces as a hydration warning

## Pitfalls

- Registering PascalCase keys while the markdown uses lowercase, so nothing matches.
- Expecting `::alert` to work without registering `alert`; the renderer has no built-in components.
- Parsing frontmatter with a separate YAML package, which duplicates the parser and drifts on edge cases.
- Putting secrets or unreviewed HTML in frontmatter and rendering it directly.
- Using the React/Svelte renderer's component prop shape in Vue; each target has its own props contract.

## Related

- `references/apis.md`
- `best-practices/comark.md`
- `usecases/render-markdown-html.md`
- `usecases/syntax-highlight-and-plugins.md`

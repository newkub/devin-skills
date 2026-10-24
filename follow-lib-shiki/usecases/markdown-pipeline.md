# Use Case — Highlight Fenced Code in a Markdown Pipeline

> Sätteri parses Markdown into HAST; Shiki turns each fence into highlighted HAST. Create the highlighter once with the same themes and transformers the rest of the site uses, then swap the fence nodes in a single tree pass. Source: https://satteri.bruits.org/docs/asts (accessed 2026-10-24)

## 1. Create the highlighter once

```ts
// src/markdown/highlighter.ts
import { codeToHast } from "shiki"
import { transformerNotationDiff } from "@shikijs/transformers"

export const shikiOptions = {
  themes: { light: "vitesse-light", dark: "vitesse-dark" },
  transformers: [transformerNotationDiff()],
} as const

export const highlightFence = (code: string, lang: string) =>
  codeToHast(code, { ...shikiOptions, lang })
```

`codeToHast` is async because it initializes the grammar. Export the function, not a per-render call, so the grammar is loaded once for the whole build.

## 2. Parse the document to HAST

```ts
import { markdownToHast } from "satteri"

const tree = markdownToHast(source, { position: false })
```

`markdownToHast` is synchronous and does no rendering. `position: false` skips source positions — a real cost saving when the tree is used only to transform nodes.

## 3. Replace each `pre > code` fence

```ts
// src/markdown/render.ts
import { markdownToHast, hastToHtml } from "satteri"
import { highlightFence } from "./highlighter"

const fenceLang = (pre: any): string | null => {
  const code = pre.children?.find((n: any) => n.type === "element" && n.tagName === "code")
  if (!code) return null
  const raw = code.properties?.className ?? []
  const classes = Array.isArray(raw) ? raw : [raw]
  const hit = classes.map(String).find((c: string) => c.startsWith("language-"))
  return hit ? hit.slice("language-".length) : null
}

const walk = async (node: any) => {
  if (!Array.isArray(node.children)) return
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]
    if (child.type === "element" && child.tagName === "pre") {
      const lang = fenceLang(child)
      if (lang) {
        const code = child.children.find((n: any) => n.type === "element" && n.tagName === "code")
        const text = code.children.map((n: any) => n.value ?? "").join("")
        const hast = await highlightFence(text, lang)
        const replacement = hast.children?.[0]
        if (replacement) {
          node.children[i] = replacement
          continue
        }
      }
    }
    await walk(child)
  }
}

export const renderMarkdown = async (source: string): Promise<string> => {
  const tree = markdownToHast(source, { position: false })
  await walk(tree)
  return hastToHtml(tree)
}
```

Shiki returns a full `<pre>` subtree, so `hast.children[0]` replaces the fence wholesale — no wrapper is re-applied and no double escaping happens.

## 4. Keep one highlighter for fences and direct code

The same `shikiOptions` object feeds `codeToHtml`/`codeToHast` elsewhere in the app. A transformer added for Markdown fences must also apply to standalone code blocks, otherwise the same snippet renders two different ways on one page.

## 5. Prefer the plugin form for one pass

If the pipeline already runs Sätteri plugins, do the same work in a `defineHastPlugin` `element` visitor and return the Shiki subtree from the visitor to replace the `pre` node. The tree walk above is the explicit version — useful when the render step is a script rather than a compile.

## 6. Verify

1. Render a `ts` fence — output contains `class="shiki"` and per-token inline colours
2. Render an unknown language — the block still renders escaped, no throw
3. Dark mode — the same HTML switches colours without a re-render
4. `// [!code ++]` inside a fence — the comment is stripped and the line carries `diff add`
5. Build time — the grammar is requested once per language, not once per document

## Pitfalls

- Calling `codeToHast` per fence without caching the highlighter — grammars reload for every document.
- Reading `code.children[0].value` as the whole code — fences may be split across several text nodes; join them.
- Forgetting `position: false` in build scripts — positions cost parse time and memory for a tree nobody inspects.
- Re-parsing the rendered HTML with `markdownToHast` — the input is HTML; use `htmlToHast` if a parse is really needed.
- Importing Shiki in the client bundle — highlighting belongs in the build/SSR layer.
- Preloading every language "because authors might use it" — pass `lang` per fence and let Shiki load on demand.

## Related

- `references/apis.md`
- `best-practices/shiki.md`
- `usecases/build-time-highlight.md`
- `usecases/custom-transformer.md`

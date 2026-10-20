# Use Case — Precompute Highlighting at Build Time

> Highlight static docs once during the build and ship zero highlighter code to the browser. Source: https://tanstack.com/highlight/latest (accessed 2026-10-20)

## 1. Separate static from dynamic content

| Content | Highlight when |
|---------|----------------|
| docs, blog posts, changelog pages | build / server render |
| README rendered from the repo | build |
| live editor, diff viewer, user-supplied snippets | client |

Only the third row needs the highlighter in the client bundle. Mixing them is what usually makes a docs site ship the whole grammar set.

## 2. Highlight in the build step

```ts
// src/highlight/adapter.ts
// Confirm the export name against https://tanstack.com/highlight/latest.
import { highlight } from "@tanstack/highlight";

export function highlightToHtml(code: string, language: string): string {
  return highlight(code, { language });
}
```

```ts
// scripts/precompute-highlight.ts
import { writeFile } from "node:fs/promises";
import { highlightToHtml } from "../src/highlight/adapter";
import { pages } from "../src/content/pages";

const out = [];

for (const page of pages) {
  const blocks = page.codeBlocks.map((block) => ({
    language: block.language,
    html: highlightToHtml(block.code, block.language),
  }));
  out.push({ slug: page.slug, blocks });
}

await writeFile("src/content/highlighted.json", JSON.stringify(out, null, 2));
```

The JSON holds final HTML, so the client imports data instead of a highlighter.

## 3. Scope the grammars to what the content uses

1. Collect the distinct languages across all pages: `new Set(pages.flatMap((p) => p.codeBlocks.map((b) => b.language)))`
2. Register only those on the build side
3. Re-run the precompute when a page adds a language — an unregistered grammar silently degrades to plain text

## 4. Render from the precomputed HTML

```tsx
import highlighted from "../content/highlighted.json";

export function DocCode({ slug, index }: { slug: string; index: number }) {
  const block = highlighted.find((p) => p.slug === slug)?.blocks[index];
  if (!block) return null;

  return (
    <pre data-lang={block.language}>
      <code dangerouslySetInnerHTML={{ __html: block.html }} />
    </pre>
  );
}
```

## 5. Verify the bundle, not just the page

1. `/run-build`
2. Search the client output for the highlighter package name — it must be absent
3. Confirm the page still shows coloured tokens after a hard reload with JS disabled
4. `/run-test` — compare one block's HTML against a committed snapshot so a grammar change is visible in review

## Pitfalls

- Precomputing but still importing the highlighter in a client component, which keeps it in the bundle for nothing.
- Storing the raw code alongside the HTML "just in case", doubling the payload the client parses.
- Regenerating the JSON on every dev reload and committing the churn, which buries real content changes.
- Assuming a grammar exists for a niche language; an unknown language falls back to unhighlighted text with no warning.

## Related

- `references/apis.md`
- `best-practices/tanstack-highlight.md`
- `usecases/highlight-code-block.md`

# Use Case — Highlight a Code Block With Themeable Tokens

> Turn source into escaped, token-classed HTML that follows the app's light/dark theme. Source: https://tanstack.com/highlight/latest (accessed 2026-10-20)

## 1. Keep the package behind one adapter

```ts
// src/highlight/adapter.ts
// The only file that names the package's API and its token class names.
// Confirm the export name against https://tanstack.com/highlight/latest — v1 may refine it.
import { highlight } from "@tanstack/highlight";

// Set this from one highlighted sample for each language you support: log the
// output once and read the class prefix the package actually emits.
const TOKEN_PREFIX = "";
const TOKENS = ["keyword", "string", "comment", "number", "fn"] as const;

export function highlightToHtml(code: string, language: string): string {
  let html = highlight(code, { language });

  // Normalise package classes to data-token, so the app's CSS never depends on
  // the package's internal class names and a rename stays inside this file.
  for (const token of TOKENS) {
    html = html.replaceAll(`class="${TOKEN_PREFIX}${token}"`, `data-token="${token}"`);
  }

  return html;
}
```

Everything else in the app imports `highlightToHtml`. When a minor release renames the entry point, one file changes.

## 2. Trust the escaping, then prove it

The output is already escaped HTML, which is what makes `dangerouslySetInnerHTML` viable. Prove it with input that would break a naive highlighter:

```ts
highlightToHtml('<img src=x onerror="alert(1)">', "html");
```

The result must contain `&lt;img` and no live `onerror` attribute. If it contains a raw `<img`, stop and sanitize before rendering.

## 3. Render with the language on the wrapper

```tsx
// src/highlight/Code.tsx
import { highlightToHtml } from "./adapter";

export function Code({ code, language }: { code: string; language: string }) {
  return (
    <pre data-lang={language} class="overflow-x-auto">
      <code dangerouslySetInnerHTML={{ __html: highlightToHtml(code, language) }} />
    </pre>
  );
}
```

## 4. Theme through CSS variables only

```css
:root {
  --syntax-keyword: #7c3aed;
  --syntax-string: #047857;
  --syntax-comment: #6b7280;
  --syntax-number: #b45309;
  --syntax-fn: #1d4ed8;
}

.dark {
  --syntax-keyword: #c4b5fd;
  --syntax-string: #6ee7b7;
  --syntax-comment: #9ca3af;
  --syntax-number: #fbbf24;
  --syntax-fn: #93c5fd;
}

[data-token="keyword"] { color: var(--syntax-keyword); }
[data-token="string"]  { color: var(--syntax-string); }
[data-token="comment"] { color: var(--syntax-comment); font-style: italic; }
[data-token="number"]  { color: var(--syntax-number); }
[data-token="fn"]      { color: var(--syntax-fn); }
```

Colours live in CSS, never in the highlighter options. That is what lets the same highlighted HTML serve both themes without re-highlighting.

If a token renders with no colour at all, the normalisation missed that class — add it to `TOKENS` instead of writing a selector for the package's class.

## 5. Verify

1. `/run-typecheck` + `/run-test`
2. Render one real file per language the project uses — check for unstyled tokens, which means a missing selector
3. Toggle the theme — every token must change colour without a re-render of the code
4. Check contrast on the darkest background; a comment at 3:1 is unreadable

## Pitfalls

- Inlining colours in highlighter options, which forces a second highlight pass for dark mode.
- Rendering the HTML without the `<pre>`/`<code>` wrapper, so whitespace collapses and code loses indentation.
- Highlighting on every render instead of memoizing per `code` + `language`, which janks long documents.
- Registering every language "in case", which dominates the bundle for a two-language app.

## Related

- `references/apis.md`
- `best-practices/tanstack-highlight.md`
- `usecases/precompute-at-build-time.md`

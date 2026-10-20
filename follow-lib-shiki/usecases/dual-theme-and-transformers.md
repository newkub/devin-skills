# Use Case — Light/Dark Themes and Diff Highlighting

> Ship one HTML block that switches themes with CSS, and mark added, removed, and focused lines from comments in the source. Source: https://shiki.style/guide/dual-themes (accessed 2026-10-20)

## 1. Render both themes at once

```ts
import { codeToHtml } from "shiki";

const html = await codeToHtml(source, {
  lang: "ts",
  themes: { light: "vitesse-light", dark: "vitesse-dark" },
});
```

With `themes`, each span carries `--shiki-light` and `--shiki-dark` custom properties instead of one fixed color.

## 2. Switch the variables with CSS

```css
html[data-theme="dark"] .shiki,
html[data-theme="dark"] .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

Inline styles beat a plain selector, so the `!important` is required — this is the documented dual-theme pattern.

## 3. Encode diff and focus in comments

```ts
const source = `const a = 1;
const b = 2; // [!code --]
const c = 3; // [!code ++]
const d = 4; // [!code highlight]
const e = 5; // [!code focus]
`;
```

Supported notations: `[!code highlight]`, `[!code ++]`, `[!code --]`, `[!code focus]`, `[!code error]`, `[!code warning]`.

## 4. Apply the notation transformers

```ts
import { codeToHtml } from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";

const html = await codeToHtml(source, {
  lang: "ts",
  themes: { light: "vitesse-light", dark: "vitesse-dark" },
  transformers: [
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationFocus(),
  ],
});
```

The transformers strip the comments and add classes; you still provide the color rules for `.diff.add`, `.diff.remove`, `.highlighted`, and `.focused`.

## 5. Style the generated classes

```css
.shiki .diff.add { background-color: rgba(16, 185, 129, 0.15); }
.shiki .diff.remove { background-color: rgba(239, 68, 68, 0.15); opacity: 0.7; }
.shiki .highlighted { background-color: rgba(250, 204, 21, 0.15); }
.shiki.has-focused .line:not(.focused) { opacity: 0.45; transition: opacity 150ms; }
```

Wrap the block in a container with `data-theme` so the same highlight is correct in both themes without re-rendering.

## Pitfalls

- Serving dual-theme HTML without the CSS overrides leaves every block in the light palette, even in dark mode.
- Using `!important` on `color` but not `background-color`, so dark ink lands on a light background.
- Registering the notation transformers without writing the `.diff`/`.highlighted` styles — the comments vanish and nothing is marked.
- Leaving `[!code ...]` markers in a language whose comments are not `//` — use the comment syntax of that language.
- Rendering twice (once per theme) doubles HTML and prevents a flicker-free toggle.
- Applying transformers to already-highlighted HTML instead of at render time.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/shiki.md`
- `usecases/build-time-highlight.md`

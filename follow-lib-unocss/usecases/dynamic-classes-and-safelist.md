# Use Case — Dynamic Classes from CMS Data and the Safelist

> Render classes that come from data (status colours, CMS block styles) without losing the styles in a production build. Source: https://unocss.dev/config/#safelist (accessed 2026-10-20)

## 1. The problem: the scanner only sees literals

```ts
// Never generated — the scanner sees `text-` + a variable, not a class
const cls = `text-${status}-600`
```

UnoCSS extracts candidates from source text. A class assembled at runtime is not in that text, so no rule is emitted and the element renders unstyled — usually only in production, after the CSS is built.

## 2. Fix A — map to complete strings

```ts
const STATUS_CLASS = {
  ok: "text-emerald-600",
  warn: "text-amber-600",
  error: "text-red-600",
} as const

<span class={STATUS_CLASS[status]}>{status}</span>
```

The literal strings live in the source, so they are scanned like any other class. This is the preferred fix — it is type-checked and tree-shakes.

## 3. Fix B — safelist what cannot be a literal

For values that really are open-ended (CMS block names, brand colours per tenant):

```ts
// uno.config.ts
export default defineConfig({
  safelist: [
    "text-emerald-600",
    "text-amber-600",
    "text-red-600",
    ...["bg-blue-50", "bg-blue-100", "bg-blue-500"],
    // generate a bounded family instead of wildcards
    ...["1", "2", "3", "4"].map((n) => `p-${n}`),
  ],
})
```

A safelist is a closed set — enumerate the bounded family (`p-1`…`p-4`), not the pattern.

## 4. Fix C — keep the data in the source graph

When the classes live in a CMS payload, add the payload to the scan inputs instead of the class strings to the config:

```ts
// uno.config.ts
export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|html)($|\?)/, "src/content/**/*.json"],
    },
  },
})
```

Now editing content regenerates the CSS; nothing needs to be duplicated in a safelist.

## Pitfalls

- Template strings with a variable → silently missing CSS; use a full-string map.
- Wildcard/regex in `safelist` → not supported as a pattern; generate the finite list with a `map`.
- Safelisting an entire palette "just in case" → huge CSS and no warning when a class is genuinely wrong.
- Content sourced from another repo/DB at runtime → no scanner can see it; return class names from an allow-listed API or ship the mapping in the client bundle.

## Related

- `references/apis.md`
- `best-practices/unocss.md`
- `usecases/design-tokens-and-shortcuts.md`

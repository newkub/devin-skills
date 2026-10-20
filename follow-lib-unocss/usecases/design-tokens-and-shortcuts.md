# Use Case — Design Tokens and Shortcuts

> Put the palette and component recipes in `uno.config.ts` so components use utilities only, with no arbitrary hex values spread through the app. Source: https://unocss.dev/config/theme (accessed 2026-10-20)

## 1. Tokens in the config

```ts
// uno.config.ts
import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from "unocss"

export default defineConfig({
  theme: {
    colors: {
      brand: { 50: "#eef2ff", 500: "#6366f1", 600: "#4f46e5" },
      surface: "var(--surface)",          // token that must follow a CSS variable
      danger: "light-dark(#dc2626, #f87171)",
    },
    breakpoints: { sm: "40rem", md: "48rem", lg: "64rem" },
  },
  shortcuts: {
    btn: "inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium",
    "btn-primary": "btn bg-brand-500 text-white hover:bg-brand-600",
    "field-label": "block text-sm font-medium text-surface-700",
  },
  presets: [presetWind4()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
```

`bg-brand-500`, `text-danger`, `sm:p-6` now work everywhere; changing `brand.500` changes every usage.

## 2. Dynamic shortcuts for families

```ts
shortcuts: [
  ["btn", "inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium"],
  [/^btn-(sm|md|lg)$/, ([, size]) => ({ sm: "px-2 py-1 text-sm", md: "px-3 py-2", lg: "px-4 py-3 text-lg" })[size!]],
]
```

A regex shortcut keeps the API (`btn-lg`) while the generated CSS stays finite and static.

## 3. Use `@apply` only inside a stylesheet

```css
/* src/styles/app.css */
@unocss-placeholder

.markdown p {
  @apply my-4 leading-7 text-surface-800;
}
```

`@apply` is resolved at build time by the transformer — it never ships as runtime CSS-in-JS.

## 4. Wire it once

```ts
// vite.config.ts
import UnoCSS from "unocss/vite"
export default defineConfig({ plugins: [UnoCSS()] })
```

```ts
// src/main.tsx
import "virtual:uno.css"
```

## Pitfalls

- Hex values inline (`bg-[#6366f1]`) → tokens are bypassed and rebranding becomes a search-and-replace.
- Defining shortcuts that only wrap one utility → indirection with no payoff; keep them component-sized.
- `theme.colors.brand` plus a separate `brand` in a CSS file → two sources of truth; point one at the other via `var()`.
- `@apply` in a `.tsx` string → it is a stylesheet directive, not a class; it does nothing there.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/unocss.md`
- `usecases/dynamic-classes-and-safelist.md`

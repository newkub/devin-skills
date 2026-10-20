# Use Case — Tailwind Plugin and Web Component

> Ship icons in a project with no React or Vue: a Tailwind plugin generates icon CSS, and the `iconify-icon` element covers markup built at runtime. Source: https://iconify.design/docs/usage/css/tailwind/ (accessed 2026-10-20)

## 1. Tailwind v3: add the dynamic selector plugin

```bash
bun add -D @iconify/tailwind @iconify-json/lucide
```

```js
// tailwind.config.js
import { addDynamicIconSelectors } from "@iconify/tailwind";

export default {
  content: ["./src/**/*.{html,js,ts,tsx,vue,svelte}"],
  plugins: [addDynamicIconSelectors()],
};
```

The plugin resolves icon classes during the Tailwind build and emits only the ones found in `content`. Add an `@iconify-json/*` package for each set you reference — a class for an uninstalled set produces no rule and no error.

## 2. Tailwind v4: load the plugin from CSS

```css
@import "tailwindcss";
@plugin "@iconify/tailwind4";
```

```html
<span class="icon-[lucide--search] text-lg" aria-hidden="true"></span>
```

Tailwind 4 has no JavaScript config, so the plugin is declared in the stylesheet. The class syntax is `icon-[set--icon]` with a double dash; the single-dash form borrowed from other presets generates nothing.

## 3. Use the web component where no component framework exists

```bash
bun add iconify-icon
```

```ts
import "iconify-icon";
```

```html
<button class="inline-flex items-center gap-2">
  <iconify-icon icon="lucide:search" width="20" height="20" aria-hidden="true"></iconify-icon>
  Search
</button>
```

`iconify-icon` is a custom element, so it works in plain HTML, server-rendered templates, and any framework without an adapter. `width`/`height` accept numbers or CSS lengths and default to `1em`, which makes the icon follow the surrounding font size.

## 4. Register data so the element never calls the API

```ts
import "iconify-icon";
import { addCollection } from "iconify-icon";
import lucide from "@iconify-json/lucide/icons.json";

addCollection(lucide);
```

Without a registered collection the element fetches from the Iconify API on first render — a network request, a layout shift, and a third-party dependency in the critical path. Registering costs bundle size; the per-icon route in `usecases/per-icon-imports-and-bundle-budget.md` costs less.

## 5. Turn off the observer in large lists

```html
<iconify-icon icon="lucide:home" noobserver></iconify-icon>
```

By default the element observes the document for `icon` attribute changes so dynamic markup updates by itself. In a table or feed with thousands of nodes that observer becomes measurable work; set `noobserver` and assign `icon` yourself when the row's data changes.

## 6. Verify

1. `/run-build` — the generated CSS contains one rule per icon class used, and no rule for a set installed but unused
2. Network panel — no request to `api.iconify.design` on first paint
3. Toggle the theme — icons inherit `currentColor` with no per-icon override
4. Screen reader pass — decorative icons are `aria-hidden` and the control carries the label
5. `/run-test` — a snapshot of the built CSS catches an accidental set upgrade

## Pitfalls

- Writing `i-lucide-search` with the Tailwind plugin — that is the UnoCSS preset prefix, so no rule is generated.
- Configuring `content` so it misses `.vue`/`.svelte`/`.mdx` files, which makes the icons used there disappear from the build.
- Loading the web component from a hand-written CDN URL instead of the installed package, so the version either floats or 404s.
- Leaving the default observer on a long virtualized list, then blaming the framework for jank.
- Assuming an uninstalled set falls back at runtime — the class simply emits nothing.

## Related

- `references/apis.md`
- `best-practices/icons.md`
- `usecases/offline-icons-unocss.md`
- `usecases/custom-icons-from-svg-files.md`
- `usecases/per-icon-imports-and-bundle-budget.md`

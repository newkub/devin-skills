# Use Case — Ship Offline Icon Data With UnoCSS

> Use icon classes that resolve from an installed `@iconify-json/*` package at build time — no runtime API call. Source: https://iconify.design/docs/ (accessed 2026-10-20)

## 1. Install the set and the preset

```bash
bun add -D @iconify-json/lucide
bun add -D unocss @unocss/preset-icons
```

## 2. Enable the preset

```ts
// uno.config.ts
import { defineConfig, presetIcons, presetWind4 } from "unocss"

export default defineConfig({
  presets: [presetWind4(), presetIcons()],
})
```

`presetIcons` checks installed `@iconify-json/*` packages first, so the icons are read from disk during the build, not fetched at runtime.

## 3. Use icon classes

```html
<button class="inline-flex items-center gap-2">
  <span class="i-lucide-search text-lg" aria-hidden="true"></span>
  Search
</button>
```

The class name is `i-<set>-<icon>`; only the icons that appear in the scanned source end up in the CSS.

## 4. Keep the runtime out of the bundle

```ts
// do not do this for static icons
import Icon from "@iconify/react"
```

A static icon in markup needs no component. Use the runtime component only when the icon name is data-driven (a plugin list, a user-selected category).

## 5. Provide custom icons without a set package

```ts
// uno.config.ts
export default defineConfig({
  presets: [
    presetIcons({
      collections: {
        app: {
          logo: '<svg viewBox="0 0 24 24"><path d="..."/></svg>',
        },
      },
    }),
  ],
})
```

```html
<span class="i-app-logo"></span>
```

## Pitfalls

- Installing the full `@iconify/json` set → tens of megabytes of JSON in build memory; install only the sets in use.
- Referencing an icon that is not in the installed set → the class renders nothing; the UnoCSS inspector reports it as missing.
- Fetching icons from the Iconify API for static UI → a network dependency and a layout shift; bundle them.
- Hard-coding `fill`/`width` inside the SVG → cannot be themed; set `color`/`size` via CSS classes.

## Related

- `references/apis.md`
- `best-practices/icons.md`
- `usecases/runtime-icon-component.md`

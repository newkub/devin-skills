# Iconify — Icon Usage And Bundle Optimization

## Recommended Patterns

### Choose A Loading Strategy

- static icons (known at build time) → bundle them directly: `@iconify-json/<set>` + UnoCSS `presetIcons` or `addIcon`/`addCollection`
- dynamic icons (user-specified, CMS-driven) → runtime API loading via an icon component that fetches from the Iconify API
- never use the runtime API for static icons — each icon is an extra network request adding latency
- very few icons (< 5-10) and no dependency wanted → inline SVG is simpler

### Per-Icon Imports

- import only the icon itself: `import home from '@iconify-json/mdi/home'` or via `addIcon('mdi:home', data)`
- never import the whole `@iconify-json/mdi` — a set has thousands of icons, the bundle will bloat
- use `addCollection` only when genuinely subset — not dumping the whole set

### Framework Components

- `@iconify/react`, `@iconify/vue`, `@iconify/svelte` per framework — `<Icon icon="mdi:home" />`
- the `iconify-icon` web component for framework-agnostic / plain HTML
- standard props: `width`, `height`, `color`, `rotate`, `flip`, `inline`
- look up icon data with `getIcon(name)`; build the SVG yourself with `iconToSVG(data, customisations)` from `@iconify/utils`

### Styling

- size controlled via `font-size` or the `width`/`height` prop — the SVG scales with `em` when px isn't fixed
- color follows text color via `currentColor` — set the `color` prop/class, don't hardcode `fill` in the SVG
- the `inline` prop aligns the icon with the text baseline, suited for inline text

## Do / Don't

| Do | Don't |
|---|---|
| import per-icon or a subset | `import * as icons from '@iconify-json/mdi'` |
| bundle static icons at build time | fetch static icons through the runtime API |
| use `currentColor` + a CSS class | hardcode `fill`/`stroke` in SVG data |
| pick a consistent icon set (mdi / lucide / tabler) | mixing many sets haphazardly so the style looks off |
| use the Tailwind plugin matching the version (`@iconify/tailwind` vs `@iconify/tailwind4`) | using `@iconify/tailwind` with Tailwind v4 |

## Common Pitfalls

- `addCollection(mdiSet)` for the whole set → bundle bloat even if only 5 icons are used — subset first
- the runtime API fails silently when offline — static icons must be bundled, not fetched
- an icon doesn't render because the name format is wrong — the format is `<prefix>:<name>`, e.g. `mdi:home`, not `mdi-home`
- the `iconify-icon` web component requires importing the script before using the tag — register the custom element in the entry
- UnoCSS `presetIcons` needs the `@iconify-json/<set>` you use installed — otherwise the icon won't render, with no warning

## Performance Notes

- icon data bundle size is ~1-2KB per icon — 10 icons is still small; the whole set (thousands) = MB
- the runtime API has latency + caching via localStorage — on first paint there may be an empty icon flash
- subsetting can be done several ways: `@iconify/utils` `iconToSVG`, unplugin-icons for on-demand auto-import
- SSR/hydration: icon components render inline SVG — no FOUC if the bundle is offline

## Ecosystem / Integration

- UnoCSS `presetIcons` + `@iconify-json/*` = the main pattern in this ecosystem (see `/follow-lib-unocss`)
- Tailwind v3 → `@iconify/tailwind`; v4 → `@iconify/tailwind4` — the syntaxes differ
- icon set metadata/search: `https://icon-sets.iconify.design` — browse + copy name
- `@iconify/utils` for a custom pipeline — generate, transform, validate icon data

# UnoCSS — Best Practices

Atomic CSS engine — presets, shortcuts, and config discipline

## Recommended Patterns

- `presetWind4` is the canonical base (Tailwind 4-compatible, theme as on-demand CSS vars) — use `presetWind3`/`presetUno` only for legacy or migration
- Theme tokens live in `uno.config.ts` — `theme.colors`, `theme.fontSize` — a single source, don't hardcode them in utilities
- `shortcuts` for repeated combos — semantic names (`btn-primary`), not a utility dump
- `presetAttributify` for attribute-mode if you prefer it — but pick one mode for the team (consistency)
- `presetIcons` for icons — `i-carbon-*` etc., icons as inline font/svg
- Enable `@unocss/eslint-plugin` (`unocss/order`, `unocss/blocklist`) when the project uses ESLint — setup + manual checks in /follow-unocss-theme lint

## Common Pitfalls

- Dynamic class strings aren't scanned — `class={\`bg-${color}-500\`}` breaks; use a `safelist` or full class names
- The `content.pipeline` config must cover the actual file extensions — `.tsx`, `.md`, `.vue` per project
- Variant order matters: `hover:` `focus:` `sm:` etc. — watch for pseudo-variant conflicts in shortcuts
- PostCSS vs Vite plugin — pick one integration per bundler (`unocss/vite` for Vite)
- `presetMini` vs `presetWind` — Wind is a superset; don't accidentally mix overlapping presets

## Perf Notes

- On-demand engine — the CSS output is very small; but a large scan → limit scope with `content.filesystem`/`pipeline`
- `transformerDirectives` (`@apply`) has a cost and breaks the atomic model — use it only specifically
- Preflights (`presetMini` normalize) — enable when needed; an app that already has a reset may disable them

## Do / Don't

| Do | Don't |
|----|-------|
| theme tokens + semantic shortcuts | magic strings in every component |
| safelist for dynamic classes | template-literal class composition |
| one integration (`unocss/vite`) | the Vite plugin + PostCSS at the same time |
| `presetIcons` for icons | importing icon components + duplicating inline svg |

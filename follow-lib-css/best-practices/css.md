# CSS — Modern Best Practices

Modern CSS patterns and Baseline features — usable with every project

## Recommended Patterns

- Cascade layers — `@layer reset, base, components, utilities` controls the specificity war from the start
- Logical properties — `margin-inline`, `padding-block`, `inset-inline-start` instead of physical ones (supports RTL/vertical writing for free)
- Custom properties — design tokens as `--color-*`, `--space-*` on `:root` — easy theme switching
- `:has()` — parent-aware styling without JS (form states, card-with-image layouts)
- Container queries — `@container` for component-driven responsive instead of viewport media queries
- Native nesting — nest selectors in one stylesheet (already Baseline) — reduces duplicated specificity

## Common Pitfalls

- Avoid `!important` in every case — if you must override, use layer order or thought-through specificity
- `100vh` breaks on mobile (URL bar) — use `100dvh`/`svh`/`lvh` per the use case
- Don't put units on `line-height` — unitless (`1.5`) inherits correctly
- `gap` in flex/grid works well now — no need for margin hacks
- Media queries with slightly overlapping breakpoints = maintenance hell — use container queries or fluid (`clamp()`) instead

## Performance

- `content-visibility: auto` + `contain-intrinsic-size` for long pages — skip offscreen render
- `will-change` only while actually animating — leaving it on = memory waste
- Animations: `transform`/`opacity` only for 60fps; always `@media (prefers-reduced-motion)`

## Do / Don't

| Do | Don't |
|----|-------|
| `@layer` + custom properties | specificity hacks + `!important` |
| `clamp()` fluid typography | a breakpoint every 50px |
| `:has()`, `:is()`, `:where()` | JS class toggles that CSS can do |
| `dvh`/`svh` on mobile layouts | raw `100vh` |

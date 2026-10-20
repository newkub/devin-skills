# shadcn-solid — Best Practices

SolidJS port of shadcn/ui — copy-in components, Kobalte primitives, Tailwind styling

## Recommended Patterns

- Components are copy-in source (not a version-locked dependency) — edit the copied source directly to fit the design system
- Built on Kobalte primitives — accessibility (ARIA, keyboard nav, focus) comes with the primitives; don't replace them with raw divs
- Tailwind + CSS variables theme — tokens (`--primary`, `--background`) drive the theme; components reference vars, not hardcoded colors
- `cn()` utility (clsx + tailwind-merge) for class composition — use it everywhere classes merge
- Add components via the CLI (`bunx shadcn-solid@latest add ...`) — pick only what you use, review the diff before committing

## Common Pitfalls

- Solid reactivity ≠ React — destructuring props breaks reactivity as in normal Solid; use `splitProps`/`mergeProps` inside components
- Version drift: copied components don't auto-update — track upstream changes when the Kobalte API shifts
- The `class` prop override behavior differs across Kobalte — check whether it merges or replaces, per component
- Dark mode: toggle a class on the root + CSS vars — don't duplicate component styles

## Perf Notes

- Import only the components you use — copied source means you control tree-shaking, no barrel bloat
- Kobalte headless = zero style cost; animations via CSS/corvu per primitive

## Do / Don't

| Do | Don't |
|----|-------|
| customize the copied source | treat it as a black-box dependency |
| Kobalte primitives for a11y | rebuild dialogs/menus yourself |
| CSS vars + `cn()` | hardcoded colors / manual string concat |
| `splitProps` to preserve reactivity | destructuring props directly |

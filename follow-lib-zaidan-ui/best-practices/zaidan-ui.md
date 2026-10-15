# Zaidan UI — Best Practices

SolidJS component library on Kobalte + Corvu + Tailwind — a11y-first copy-in components

## Recommended Patterns

- Components are Kobalte/Corvu primitives + Tailwind styling — accessibility (ARIA, keyboard, focus) comes from the primitive layer
- Pick the primitive by kind: Kobalte for most, Corvu for primitives Kobalte lacks (drawer, resizable, OTP)
- Theme via Tailwind tokens/CSS vars — never hardcode colors in component source
- Use `splitProps`/`mergeProps` when wrapping components — always preserve Solid reactivity
- Copy component source into the repo then customize — same approach as the shadcn model

## Common Pitfalls

- Never destructure primitive props — reactivity is lost, same as the general Solid pattern
- Kobalte vs Corvu APIs differ — check the actual primitive's docs before wrapping; props/events are not the same
- Portal-based components (dialog, popover, toast) mount outside the tree — theme class/vars must also cover the portal container
- Tailwind version/token names must match the project's setup — copied components assume the original structure
- SSR/SolidStart: primitives touch the DOM — check `isServer` guards when rendering server-side

## Perf Notes

- Primitives are headless; styling cost follows the actual Tailwind classes — tree-shake utilities via UnoCSS/Tailwind JIT
- Avoid wrapping many layers — every layer adds component overhead; compose directly when enough

## Do / Don't

| Do | Don't |
|----|-------|
| Kobalte first, Corvu for missing primitives | rebuild primitives yourself |
| theme via CSS vars/tokens | hardcode the palette in components |
| `splitProps`/`mergeProps` | destructure raw props |
| cover the portal container with the theme | assume portals inherit root classes |

# Solid.js Install And CLI

## Install

```bash
# With Vite (recommended)
bun create vite@latest my-app --template solid-ts

# Manual install
bun add solid-js
bun add -D babel-preset-solid
```

## Version Info

- Latest stable: `1.9.x` (as of 2026)
- Solid 2.0 in beta/rc (not yet stable)
- No Virtual DOM — fine-grained reactivity
- Components run once (render-once mental model)
- Peer dependency: `babel-preset-solid` for JSX

## CLI Commands (Vite-based)

```bash
bun dev         # Start dev server
bun run build   # Build for production
bun run preview # Preview production build
```

## Source

- https://www.solidjs.com/
- https://docs.solidjs.com/

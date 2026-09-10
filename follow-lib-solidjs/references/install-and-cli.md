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

- Latest stable: `1.9.15` (verified 2026-09-11)
- `vite-plugin-solid`: `2.11.14` (supports Vite 8 — verify peer range in project)
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

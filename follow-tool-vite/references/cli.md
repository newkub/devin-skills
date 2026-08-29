# Vite CLI

## Install

```sh
bun add -D vite
```

## Version

- Latest: `7.x`
- Repository: https://github.com/vitejs/vite
- Docs: https://vitejs.dev/guide/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `vite` / `vite dev` / `vite serve` | Start dev server on `localhost:5173` with HMR | — | `--port`, `--host`, `--https`, `--open`, `--config`, `--mode`, `--logLevel` |
| `vite build` | Build for production from `index.html` to `dist/` | — | `--watch`, `--emptyOutDir`, `--minify`, `--sourcemap`, `--base`, `--mode`, `--config` |
| `vite preview` | Preview production build on `localhost:4173` | — | `--port`, `--host`, `--https`, `--open`, `--base` |
| `vite --help` | Show help | — | (none) |
| `vite --version` | Print version | — | (none) |

## Examples

```sh
bunx vite --port 3000
bunx vite build --sourcemap
bunx vite preview --port 8080
```

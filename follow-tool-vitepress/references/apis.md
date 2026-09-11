# Tool Vitepress API & Dependencies

## Install

```sh
bun add -D vitepress
# or
npm install --save-dev vitepress
```

## Version

- Latest: 1.6.4 (verified 2026-09-11)
- Peer: `vue` ^3.5+
- [Package Registry](https://www.npmjs.com/package/vitepress)
- [Repository](https://github.com/vuejs/vitepress)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install vitepress in project | latest version | --save-dev, --save, --global |
| `vitepress dev` | Dev server with HMR | docs root | --port, --open, --config |
| `vitepress build` | Build static site | `.vitepress/dist` | --outDir, --base |
| `vitepress preview` | Preview production build | dist dir | --port |
| `import 'vitepress/theme'` | Theme API entry | entry as documented | (none) |
| `import { defineConfig }` | Site config helper | `vitepress` | (none) |
| `import { useData, useRoute }` | Runtime composables | `vitepress` | (none) |

## Source

- Official docs: https://vitepress.dev
- Description: Vite & Vue powered static site generator.

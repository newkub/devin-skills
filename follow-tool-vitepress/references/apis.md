| key | value |
|---|---|
| install | `bun add -D vitepress` |
| version | 1.6.4 |
| package registry | https://www.npmjs.com/package/vitepress |
| repository | https://github.com/vuejs/vitepress |
| docs | https://vitepress.dev |

| commands | description | default | options |
|---|---|---|---|
| `install` | Install vitepress in project | latest version | --save-dev, --save, --global |
| `vitepress dev` | Dev server with HMR | docs root | --port, --open, --config |
| `vitepress build` | Build static site | `.vitepress/dist` | --outDir, --base |
| `vitepress preview` | Preview production build | dist dir | --port |
| `import 'vitepress/theme'` | Theme API entry | entry as documented | (none) |
| `import { defineConfig }` | Site config helper | `vitepress` | (none) |
| `import { useData, useRoute }` | Runtime composables | `vitepress` | (none) |

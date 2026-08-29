# VitePress CLI

## Install

```sh
bun add -D vitepress
```

## Version

- Latest on npm
- Repository: https://github.com/vuejs/vitepress
- Docs: https://vitepress.dev/guide/getting-started

## Commands

| commands | description | default | options |
|---|---|---|---|
| `vitepress dev [dir]` | Start dev server on port 5173 | — | --port, --host, --base, --config, --temp |
| `vitepress build [dir]` | Build docs to `.vitepress/dist` | — | --base, --config, --clean, --mpa |
| `vitepress preview [dir]` | Preview built docs | — | --port, --host, --base |
| `vitepress init` | Initialize VitePress project | — | --yes |
| `vitepress --help` | Show help | — | (none) |
## Examples

```sh
bunx vitepress dev
```
```sh
bunx vitepress build
```
```sh
bunx vitepress preview --port 8080
```

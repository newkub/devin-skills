# Node Modules Inspector CLI

## Install

```sh
bun add -D node-modules-inspector
```

## Version

- Latest on npm
- Repository: https://github.com/antfu/node-modules-inspector
- Docs: https://github.com/antfu/node-modules-inspector

## Commands

| commands | description | default | options |
|---|---|---|---|
| `node-modules-inspector` | Analyze node_modules | — | --root, --open, --no-open, --build |
| `node-modules-inspector --build` | Build static report | — | --output, --base, --config |
| `node-modules-inspector --open` | Open in browser | — | --port, --host |
| `node-modules-inspector --help` | Show help | — | (none) |
## Examples

```sh
bunx node-modules-inspector
```
```sh
bunx node-modules-inspector --build --output ./dist/inspect
```

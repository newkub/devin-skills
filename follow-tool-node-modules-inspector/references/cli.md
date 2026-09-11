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
| `node-modules-inspector` | Launch interactive web UI | — | --root, --config, --port, --host |
| `node-modules-inspector build` | Build static report to `dist/__node-modules-inspector` | — | --root, --config, --outDir, --base |
| `node-modules-inspector report duplicates` | Packages in multiple versions | — | --json, --limit, --depth, --root |
| `node-modules-inspector report sizes` | Packages by install size | — | --json, --limit, --depth |
| `node-modules-inspector report maintainers` | Upgrade opportunities + publint | — | --json, --sort, --no-latest-only |
| `node-modules-inspector mcp` | Start MCP server (stdio) | — | — |
| `node-modules-inspector --help` | Show help | — | (none) |
## Examples

```sh
bunx node-modules-inspector
```
```sh
bunx node-modules-inspector build
```
```sh
bunx node-modules-inspector report duplicates --json | jq '.[].name'
```

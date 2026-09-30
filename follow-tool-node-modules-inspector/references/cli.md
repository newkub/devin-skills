| key | value |
|---|---|
| install | `bun add -D node-modules-inspector` |
| repository | https://github.com/antfu/node-modules-inspector |
| docs | https://github.com/antfu/node-modules-inspector |

| commands | description | default | options |
|---|---|---|---|
| `node-modules-inspector` | Launch interactive web UI | — | --root, --config, --port, --host |
| `node-modules-inspector build` | Build static report to `dist/__node-modules-inspector` | — | --root, --config, --outDir, --base |
| `node-modules-inspector report duplicates` | Packages in multiple versions | — | --json, --limit, --depth, --root |
| `node-modules-inspector report sizes` | Packages by install size | — | --json, --limit, --depth |
| `node-modules-inspector report maintainers` | Upgrade opportunities + publint | — | --json, --sort, --no-latest-only |
| `node-modules-inspector mcp` | Start MCP server (stdio) | — | — |
| `node-modules-inspector --help` | Show help | — | (none) |

# Node Modules Inspector

## Install

Node Modules Inspector is an npm package by Anthony Fu (`antfu`).
It does not require permanent installation - run it on demand.

```bash
# Run without installing (pnpm)
pnpx node-modules-inspector

# Run without installing (npm)
npx node-modules-inspector

# Run without installing (bun)
bunx node-modules-inspector

# Install locally
npm install node-modules-inspector
pnpm add node-modules-inspector
bun add node-modules-inspector
```

## Version Info

- npm package: `node-modules-inspector`
- License: MIT
- Repository: `https://github.com/antfu/node-modules-inspector`
- Supports: `pnpm`, `npm`, and `bun` projects
- Online version: `https://node-modules.dev/`

## Quick Start

Run the inspector in your project root:

```bash
bunx node-modules-inspector
```

This launches an interactive web UI for inspecting your `node_modules`.

## Configuration

Create a `node-modules-inspector.config.ts` file in your project root:

```ts
import { defineConfig } from 'node-modules-inspector'

export default defineConfig({
  defaultFilters: {
    excludes: [
      'eslint',
    ],
  },
  defaultSettings: {
    moduleTypeSimple: true,
  },

  // Experimental publint.dev integration, default is false
  publint: true,
})
```

## Static Build

Build a static SPA of your current node_modules status:

```bash
pnpx node-modules-inspector build
npx node-modules-inspector build
bunx node-modules-inspector build
```

This creates a `.node-modules-inspector` folder that can be hosted with
any static file server.

## CLI Reports

Machine-readable reports for shell pipelines and AI agents:

```bash
# Packages installed in multiple versions
npx node-modules-inspector report duplicates

# Packages sorted by install size
npx node-modules-inspector report sizes

# Dep-upgrade opportunities + publint, grouped by consumer/author
npx node-modules-inspector report maintainers
```

### JSON Output

Add `--json` to emit JSON to stdout. Progress logs go to stderr,
so output is pipe-safe:

```bash
npx node-modules-inspector report duplicates --json | jq '.[].name'
npx node-modules-inspector report sizes --json --limit 10
npx node-modules-inspector report maintainers --json --sort migration --no-latest-only
```

### Common Report Options

| Flag | Description |
|---|---|
| `--root <dir>` | Project root directory |
| `--config <file>` | Config file path |
| `--depth <n>` | Max dependency depth |
| `--limit <n>` | Limit number of results |
| `--json` | Output as JSON |

Run `node-modules-inspector report --help` for the full per-report flag set.

## MCP Server

The three reports are also exposed as MCP tools for AI coding agents:

```bash
npx node-modules-inspector mcp
```

Tools exposed:
- `nmi:report-duplicates`
- `nmi:report-sizes`
- `nmi:report-maintainers`

Wire it into MCP-compatible clients by adding `node-modules-inspector mcp`
as a stdio server in your MCP config.

## CLI Commands Summary

| Command | Description |
|---|---|
| `bunx node-modules-inspector` | Launch interactive web UI |
| `npx node-modules-inspector build` | Build static SPA |
| `npx node-modules-inspector report duplicates` | Show duplicate packages |
| `npx node-modules-inspector report sizes` | Show packages by size |
| `npx node-modules-inspector report maintainers` | Show upgrade opportunities |
| `npx node-modules-inspector report <type> --json` | JSON output for piping |
| `npx node-modules-inspector mcp` | Start MCP server |

## Source URLs

- GitHub: `https://github.com/antfu/node-modules-inspector`
- npm: `https://www.npmjs.com/package/node-modules-inspector`
- Online version: `https://node-modules.dev/`
- README: `https://github.com/antfu/node-modules-inspector/blob/main/README.md`

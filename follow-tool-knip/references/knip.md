# Knip Reference

## Overview

Knip finds and fixes unused dependencies, exports, and files in JavaScript and TypeScript projects. It performs static and dynamic analysis to build a comprehensive module graph, catching dead code that file-based linters miss. It supports monorepos with workspaces and has 182+ plugins for auto-detecting entry files.

## Install

```bash
bun add -D knip typescript @types/node
```

Quick start with interactive setup:

```bash
bun create @knip/config
```

Run without installing:

```bash
bunx knip
```

## Version Info

- Latest stable: `6.32.2`
- License: ISC
- Node.js: `^20.19.0 || >=22.12.0` (or Bun)
- Source: https://knip.dev

## Peer Dependencies

- `typescript` - used for type analysis
- `@types/node` - used for Node.js type compatibility

Both are likely already in `node_modules` for most TypeScript projects.

## Configuration

Knip uses `knip.json` or `knip.jsonc` at the project root.

### JSON Schema

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json"
}
```

### Single project configuration

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "entry": ["src/index.ts", "scripts/*.ts"],
  "project": ["src/**/*.ts", "scripts/**/*.ts"]
}
```

### Monorepo configuration

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "workspaces": {
    ".": {
      "entry": ["scripts/*.ts"],
      "project": ["scripts/**/*.ts"]
    },
    "packages/*": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.ts"]
    }
  }
}
```

The root workspace is named `"."`. Workspaces can also be read automatically from `package.json#workspaces` or `pnpm-workspace.yaml`.

### Advanced options

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "ignoreExportsUsedInFile": {
    "interface": true,
    "type": true
  },
  "treatConfigHintsAsErrors": true,
  "ignoreBinaries": ["docker-compose", "bunx"],
  "ignoreDependencies": ["some-type-package"]
}
```

### Import aliases

```json
{
  "paths": {
    "@lib": ["./lib/index.ts"],
    "@lib/*": ["./lib/*"]
  }
}
```

### Plugins

```json
{
  "mocha": {
    "config": "config/mocha.config.js",
    "entry": ["**/*.spec.js"]
  },
  "playwright": true,
  "webpack": false
}
```

### Rules and severity

```json
{
  "rules": {
    "files": "warn",
    "duplicates": "off"
  }
}
```

### Tags (JSDoc-based filtering)

```json
{
  "tags": ["-lintignore"]
}
```

Tag exports with `@lintignore` or `@internal` in JSDoc:

```typescript
/**
 * @internal Important matters
 * @lintignore
 */
export const myExport = 1;
```

## CLI Commands

```bash
# Default analysis
knip

# Production mode (exclude tests, devDependencies)
knip --production

# Strict production mode (includes peerDependencies, type-only imports)
knip --strict

# Debug output (workspaces, plugins, resolved files)
knip --debug

# Auto-fix (remove unused exports)
knip --fix

# Filter by issue type
knip --include files,dependencies
knip --exports
knip --files

# Filter by workspace
knip -W apps/website

# Include entry exports
knip --include-entry-exports
```

## Package.json Scripts

```json
{
  "scripts": {
    "knip": "knip",
    "knip:prod": "knip --production",
    "knip:strict": "knip --strict"
  }
}
```

## Issue Types

| Issue | Description | Key |
|-------|-------------|-----|
| Unused files | No reference to this file | `files` |
| Unused exports | No reference to this export | `exports` |
| Unused exported types | No reference to this exported type | `types` |
| Unused dependencies | Dependency not imported | `dependencies` |
| Unresolved imports | Import cannot be resolved | `unresolved` |
| Duplicates | Duplicate exports | `duplicates` |

## Ignore Options (targeted)

- `ignoreFiles` - exclude files from unused file detection only
- `ignoreBinaries` - exclude binaries not from dependencies
- `ignoreDependencies` - exclude specific dependencies
- `ignoreMembers` - exclude enum/namespace members
- `ignoreUnresolved` - exclude unresolved imports

## Production Mode

Use `!` suffix in patterns to mark production files:

```json
{
  "entry": ["src/index.ts!"]
}
```

`--strict` implies `--production` and adds:
- Verify workspace isolation
- Include peerDependencies
- Report type-only imports

## Safe Usage

- Fix config hints before running `--fix`
- Review reported issues before fixing
- Use `--include` / `--exclude` to filter issue types
- Do not run `knip --fix` until config is settled and no config hints remain

## Source

- https://knip.dev/overview/getting-started
- https://knip.dev/reference/configuration
- https://knip.dev/reference/cli
- https://knip.dev/reference/issue-types

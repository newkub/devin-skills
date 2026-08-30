# dprint Reference

## Overview

dprint is a pluggable and configurable code formatting platform written in Rust. It formats code via WebAssembly plugins and supports many languages including TypeScript, JavaScript, JSON, Markdown, TOML, YAML, CSS, HTML, Rust, Python, Go, and PHP.

## Install

```bash
bun add -D dprint
```

Verify installation:

```bash
npx dprint --version
```

Initialize a configuration file:

```bash
npx dprint init
```

Use `--yes` or `-y` to skip the interactive prompt:

```bash
npx dprint init -y
```

## Version Info

- Latest stable: `0.56.1`
- License: MIT
- Source: https://dprint.dev

## Peer Dependencies

No peer dependencies. Platform-specific binaries are installed as optional dependencies:
- `@dprint/win32-x64`
- `@dprint/win32-arm64`
- `@dprint/darwin-x64`
- `@dprint/darwin-arm64`
- `@dprint/linux-x64-glibc`
- `@dprint/linux-x64-musl`
- `@dprint/linux-arm64-glibc`
- `@dprint/linux-arm64-musl`
- `@dprint/linux-ppc64-glibc`
- `@dprint/linux-ppc64-musl`
- `@dprint/linux-loong64-glibc`
- `@dprint/linux-loong64-musl`
- `@dprint/linux-riscv64-glibc`
- `@dprint/android-x64`
- `@dprint/android-arm64`

## Configuration

dprint uses `dprint.json` or `dprint.jsonc` (also `.dprint.json` / `.dprint.jsonc`) at the project root.

### Basic configuration

```json
{
  "lineWidth": 80,
  "includes": [
    "**/*.{ts,tsx,js,jsx,json,md}"
  ],
  "excludes": [
    "**/node_modules",
    "**/dist",
    "**/.git",
    "**/*-lock.json"
  ],
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.95.13.wasm",
    "https://plugins.dprint.dev/json-0.21.1.wasm",
    "https://plugins.dprint.dev/markdown-0.16.3.wasm"
  ]
}
```

### TypeScript/JavaScript formatter options

```json
{
  "typescript": {
    "quoteStyle": "preferSingle",
    "binaryExpression.operatorPosition": "sameLine"
  },
  "json": {
    "indentWidth": 2
  }
}
```

### Using npm plugin specifiers

```json
{
  "plugins": [
    "npm:@dprint/typescript@0.95.15",
    "npm:@dprint/json",
    "npm:@dprint/markdown"
  ]
}
```

Omitting the version (`npm:@dprint/json`) tells dprint to resolve from `node_modules`.

### Adding plugins via CLI

```bash
# Interactive selection
dprint add

# Specific plugins
dprint add typescript json markdown

# From npm
dprint add npm:@dprint/json

# From URL
dprint add https://plugins.dprint.dev/json-0.21.1.wasm
```

### Updating plugins

```bash
dprint config update
dprint config update --recursive
dprint config update --dry-run
```

### Associations (custom file extensions)

```json
{
  "json": {
    "associations": [
      "**/.myconfigrc"
    ]
  }
}
```

## CLI Commands

```bash
# Format all files
dprint fmt

# Check formatting without writing
dprint check

# Initialize config
dprint init

# Add a plugin
dprint add

# Update plugins in config
dprint config update

# Edit config in default editor
dprint config edit

# Show help
dprint help

# Show version
dprint --version

# Upgrade dprint
dprint upgrade

# Clear cache
dprint clear-cache
```

## Available Plugins

| Plugin | Languages |
|--------|-----------|
| TypeScript | JavaScript, TypeScript, JSX, TSX |
| JSON | JSON |
| Markdown | Markdown |
| TOML | TOML |
| Pretty YAML | YAML |
| Dockerfile | Dockerfile |
| Rustfmt | Rust |
| Malva | CSS, SCSS, Sass, Less |
| Markup_fmt | HTML, Vue, Svelte, Astro |
| Ruff | Python |
| Gofumpt | Go |
| Mago | PHP |
| Biome | JS, TS, JSON |
| Oxc | JS, TS |
| Prettier | Many (process plugin) |

Plugin URL pattern: `https://plugins.dprint.dev/<name>-<version>.wasm`

## Package.json Scripts

```json
{
  "scripts": {
    "format": "dprint fmt"
  }
}
```

## Excludes

Files matching `.gitignore` patterns are excluded by default. Use negated globs to un-exclude:

```json
{
  "excludes": [
    "!dist.js"
  ]
}
```

Disable all `.gitignore` handling with `--no-gitignore` CLI flag.

## Source

- https://dprint.dev/install/
- https://dprint.dev/setup/
- https://dprint.dev/config/
- https://dprint.dev/cli/

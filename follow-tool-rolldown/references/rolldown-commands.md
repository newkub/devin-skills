# CLI Commands

## Purpose

Command-line interface reference สำหรับ Rolldown

## Scope

- Build Commands
- Options
- Examples
- Exit Codes

## Installation

```bash
# bun
bun install -D rolldown

# bun
bun add -D rolldown

# yarn
yarn add -D rolldown

# bun
bun add -D rolldown
```

## Commands

### Build

```bash
# Default build
rolldown

# With config
rolldown --config rolldown.config.js

# With custom entry
rolldown --input src/main.ts
```

### Watch Mode

```bash
# Watch mode
rolldown --watch

# Watch with config
rolldown --watch --config rolldown.config.js

# Watch with custom entry
rolldown --watch --input src/main.ts
```

## Options

### Input Options

| Option | Description | Example |
|--------|-------------|---------|
| `-i, --input` | Entry point | `--input src/index.ts` |
| `-c, --config` | Config file | `--config rolldown.config.js` |

### Output Options

| Option | Description | Example |
|--------|-------------|---------|
| `-d, --dir` | Output directory | `--dir dist` |
| `-o, --outDir` | Output directory | `--outDir dist` |
| `-f, --format` | Output format | `--format esm` |
| `-n, --name` | IIFE/UMD name | `--name MyBundle` |

### Build Options

| Option | Description | Example |
|--------|-------------|---------|
| `--sourcemap` | Generate sourcemap | `--sourcemap` |
| `--minify` | Minify output | `--minify` |
| `--watch` | Watch mode | `--watch` |
| `--clear` | Clear output dir | `--clear` |

### Format Options

| Option | Description |
|--------|-------------|
| `esm` | ES Modules (default) |
| `cjs` | CommonJS |
| `iife` | Immediately Invoked Function Expression |
| `umd` | Universal Module Definition |

## Examples

### Basic Build

```bash
rolldown
```

### With Config

```bash
rolldown --config rolldown.config.js
```

### With Output Directory

```bash
rolldown --dir dist
```

### With Format

```bash
rolldown --format esm
rolldown --format cjs
```

### With Sourcemap

```bash
rolldown --sourcemap
rolldown --sourcemap hidden
```

### Minify Output

```bash
rolldown --minify
```

### Watch Mode

```bash
rolldown --watch
rolldown --watch --config rolldown.config.js
```

### Combined Options

```bash
rolldown \
  --config rolldown.config.js \
  --dir dist \
  --format esm \
  --sourcemap \
  --minify
```

## Common Patterns

### Development

```bash
# Watch with dev server
rolldown --watch --config rolldown.config.js

# Sourcemap for debugging
rolldown --sourcemap
```

### Production

```bash
# Production build
rolldown --config rolldown.prod.config.js --minify

# With sourcemap
rolldown --config rolldown.prod.config.js --sourcemap --minify
```

### Library

```bash
# ESM library
rolldown --format esm --dir dist/esm

# CJS library
rolldown --format cjs --dir dist/cjs
```

## Help

### Show Help

```bash
rolldown --help
```

### Show Version

```bash
rolldown --version
```

### Help Output

```
Usage: rolldown [options]

Options:
  -c, --config <file>    Config file
  -i, --input <file>     Entry point
  -d, --dir <dir>        Output directory
  -f, --format <format> Output format (esm|cjs|iife|umd)
  -n, --name <name>      IIFE/UMD name
  --sourcemap            Generate sourcemap
  --minify               Minify output
  --watch                Watch mode
  --clear                Clear output directory
  --help                 Show help
  --version              Show version
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | Error |

## Environment Variables

### Rolldown Env

```bash
# Debug mode
ROLLDOWN_DEBUG=1 rolldown

# Log level
ROLLDOWN_LOG_LEVEL=debug rolldown
```

## See Also

- [Configuration - Top Level](./rolldown-config-toplevel.md) - Top-level configuration options
- [Configuration - Output](./rolldown-config-output.md) - Output configuration options
- [Configuration - Treeshake/Env](./rolldown-config-treeshake-env.md) - Treeshake and environment options
- [API - Build/Watch](./rolldown-api-build-watch.md) - Build and watch API
- [API - Config Options](./rolldown-api-config-options.md) - API config options
- [API - Return Values](./rolldown-api-return-values.md) - API return values

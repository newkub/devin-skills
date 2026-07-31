# Bundler Reference - Bun

## Overview

Bun includes a fast JavaScript/TypeScript bundler for production builds.

## Basic Usage

```bash
# Build for production
bun build src/index.ts --outdir ./dist

# Target browser
bun build --target=browser src/index.ts

# Target node
bun build --target=node src/index.ts

# Minify
bun build --minify src/index.ts

# Entry point
bun build --entrypoint ./src/index.ts
```

## Options

| Option | Description |
|--------|-------------|
| `--outdir` | Output directory |
| `--target` | Target platform (browser, node, bun) |
| `--minify` | Minify output |
| `--sourcemap` | Generate sourcemap |
| `--external` | External dependencies |
| `--entrypoint` | Entry file |
| `--splitting` | Code splitting |
| `--format` | Output format (esm, cjs, iife) |

## Code Splitting

```bash
# Enable code splitting
bun build --splitting src/index.ts
```

## External Dependencies

```bash
# Mark packages as external
bun build --external react --external react-dom src/index.ts
```

## Watch Mode

```bash
# Watch for changes
bun build --watch src/index.ts
```

## Plugins

Bun bundler supports plugins for additional functionality.

## Configuration

```toml
[bundle]
# Bundler configuration
minify = true
sourcemap = true
target = "browser"
```

---

**See also:**
- [Bundler Documentation](https://bun.sh/docs/bundler)

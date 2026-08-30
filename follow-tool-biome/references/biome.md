# Biome Reference

## Overview

Biome is a toolchain for the web: formatter, linter, and more. It is a fast, all-in-one replacement for ESLint and Prettier, built in Rust.

## Install

```bash
bun add -D -E @biomejs/biome
```

Use `-E` to pin the exact version for consistency across environments.

Initialize a configuration file:

```bash
bunx --bun @biomejs/biome init
```

## Version Info

- Latest stable: `2.5.10`
- License: MIT OR Apache-2.0
- Node.js: `>=14.21.3`
- Source: https://biomejs.dev

## Peer Dependencies

No peer dependencies. Platform-specific binaries are installed as optional dependencies:
- `@biomejs/cli-darwin-arm64`
- `@biomejs/cli-darwin-x64`
- `@biomejs/cli-linux-x64`
- `@biomejs/cli-linux-x64-musl`
- `@biomejs/cli-linux-arm64`
- `@biomejs/cli-linux-arm64-musl`
- `@biomejs/cli-win32-x64`
- `@biomejs/cli-win32-arm64`

## Configuration

Biome uses `biome.json` or `biome.jsonc` at the project root. Configuration is organized around three tools: formatter, linter, and assist. All are enabled by default.

### Basic configuration

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "correctness": {
        "noNodejsModules": "off"
      },
      "performance": {
        "noBarrelFile": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true
  },
  "assist": {
    "enabled": true
  }
}
```

### Formatter options

```jsonc
{
  "formatter": {
    "indentStyle": "space",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "lineWidth": 120
    }
  },
  "json": {
    "formatter": {
      "enabled": false
    }
  }
}
```

### Linter domains

Domains enable framework-specific rules. Use `"recommended"` to enable non-nursery recommended rules.

```jsonc
{
  "linter": {
    "domains": {
      "drizzle": "recommended",
      "next": "recommended",
      "react": "recommended",
      "test": "recommended",
      "turborepo": "recommended",
      "types": "recommended",
      "vue": "recommended"
    }
  }
}
```

Available domains: `astro`, `drizzle`, `next`, `playwright`, `project`, `qwik`, `react`, `reactNative`, `solid`, `svelte`, `tailwind`, `test`, `turborepo`, `types`, `vue`.

Domain values: `"recommended"`, `"all"`, `"none"`.

### Monorepo configuration

Root config (`biome.jsonc`):

```jsonc
{
  "root": false,
  "extends": ["../../biome.jsonc"]
}
```

### File includes/excludes

```jsonc
{
  "files": {
    "includes": ["src/**/*.js", "test/**/*.js", "!**/*.min.js"]
  },
  "linter": {
    "includes": ["**", "!test/**"]
  }
}
```

## CLI Commands

```bash
# Format all files
biome format --write

# Lint and apply safe fixes
biome lint --write

# Format, lint, and organize imports
biome check --write

# CI mode (optimized for CI environments)
biome ci .

# Initialize configuration
biome init

# Show version
biome version

# Migrate from Prettier
biome migrate prettier
```

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "biome lint",
    "lint:fix": "biome lint --write",
    "format": "biome format --write"
  }
}
```

## GitHub Actions CI

```yaml
name: Code quality

on:
  push:
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          persist-credentials: false
      - name: Setup Biome
        uses: biomejs/setup-biome@v2
        with:
          version: latest
      - name: Run Biome
        run: biome ci .
```

## Configuration File Resolution

Biome discovers configuration files in this order:
1. `biome.json`
2. `biome.jsonc`
3. `.biome.json`
4. `.biome.jsonc`

Search order: current working directory, then parent folders recursively, then home directory.

## Protected Files (always ignored)

- `composer.lock`
- `npm-shrinkwrap.json`
- `package-lock.json`
- `yarn.lock`

## Source

- https://biomejs.dev/guides/getting-started/
- https://biomejs.dev/guides/configure-biome/
- https://biomejs.dev/linter/domains/
- https://biomejs.dev/reference/cli/

# Turborepo v2.x Reference

> High-performance build system for JavaScript and TypeScript monorepos.

## Install

```sh
bun add -D turbo
# or
npm install -D turbo
pnpm add -D turbo
yarn add -D turbo
```

## Version

- Latest stable: `2.x` (v2.8.x series)
- License: MIT
- Requires: Node.js (any modern version)

## Configuration

Turborepo uses a `turbo.json` file at the workspace root. Also supports `turbo.jsonc` for comments.

### Basic `turbo.json`

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

## Task Configuration

### `dependsOn`

Specify task dependencies:

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["build"] },
    "lint": { "dependsOn": ["utils#build"] }
  }
}
```

- `^task` — run task in upstream dependencies first
- `task` — run task in same package first
- `package#task` — run specific task in specific package first

### `outputs`

Files/directories to cache (globs relative to package):

```json
{
  "tasks": {
    "build": { "outputs": [".next/**", "!.next/cache/**"] },
    "build-vite": { "outputs": ["dist/**"] }
  }
}
```

### `inputs`

Files included in task hash:

```json
{
  "tasks": {
    "spell-check": { "inputs": ["**/*.md", "**/*.mdx"] }
  }
}
```

Use `$TURBO_DEFAULT$` to include defaults with custom exclusions:

```json
{
  "tasks": {
    "build": { "inputs": ["$TURBO_DEFAULT$", "!README.md"] }
  }
}
```

### `cache`, `persistent`, `interactive`, `interruptible`

```json
{
  "tasks": {
    "build": { "cache": true },
    "dev": { "cache": false, "persistent": true, "interruptible": true },
    "test": { "interactive": true }
  }
}
```

### `env` and `passThroughEnv`

```json
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "API_URL"],
      "passThroughEnv": ["AWS_SECRET_KEY"]
    }
  }
}
```

- `env` — variables that affect cache hash (no `$` prefix)
- `passThroughEnv` — variables available at runtime but do not affect hash

### `outputLogs`

Values: `full`, `new-only`, `errors-only`, `none`.

## Global Options

### `globalDependencies` and `globalEnv`

```json
{
  "globalDependencies": ["tsconfig.json"],
  "globalEnv": ["GITHUB_TOKEN", "NODE_ENV"],
  "globalPassThroughEnv": ["AWS_SECRET_KEY"]
}
```

### Cache Settings

```json
{
  "cacheDir": ".turbo/cache",
  "cacheMaxAge": "7d",
  "cacheMaxSize": "10GB"
}
```

### `concurrency` and `envMode`

```json
{
  "concurrency": "10",
  "envMode": "strict"
}
```

### `futureFlags`

```json
{
  "futureFlags": { "globalConfiguration": true }
}
```

## Package Configurations

Package-level `turbo.json` to override or extend root config:

```json
{
  "extends": ["//"],
  "tasks": {
    "build": { "outputs": ["dist/**", "build/**"] }
  }
}
```

- `["//"]` — inherit from root `turbo.json`
- `$TURBO_EXTENDS$` as first element — append instead of replace
- `"extends": false` — disable a task for specific package

## CLI Commands

```sh
turbo run <task>              # Run a task across packages
turbo run build --affected    # Run only changed packages
turbo run build --filter=web  # Run in specific package
turbo watch <task>            # Watch mode
turbo docs <query>            # Search documentation
turbo ls                      # List packages
turbo prune --docker          # Generate pruned output for Docker
turbo login                   # Login to Remote Cache
turbo link                    # Link to Remote Cache
```

### Filter Syntax

```sh
turbo run build --filter=web          # Specific package
turbo run build --filter=./apps/*     # All packages in apps/
turbo run build --filter=web...       # Package and its dependencies
turbo run build --filter=...web       # Package and its dependents
turbo run build --dry=json            # Inspect task dependencies
```

## Remote Caching

```sh
turbo login
turbo link
```

Environment variables: `TURBO_TOKEN`, `TURBO_TEAM`.

```json
{
  "remoteCache": { "enabled": true, "signature": true }
}
```

## Source

- Docs: https://turborepo.dev/docs
- GitHub: https://github.com/vercel/turborepo

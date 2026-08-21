# CLI

## Purpose

SvelteKit CLI commands and options.

## sv create

Create a new SvelteKit project.

```bash
sv create [directory] [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--template` | Template to use | minimal |
| `--types` | TypeScript or JavaScript | ts |
| `--no-add-ons` | Skip add-ons | false |
| `--add-ons` | Add-ons to install | - |
| `--no-install` | Skip bun install | false |
| `--no-git` | Skip git init | false |

### Examples

```bash
# Create with defaults
sv create my-app

# With TypeScript
sv create my-app --types ts

# With add-ons
sv create my-app --add-ons eslint,prettier

# Minimal without add-ons
sv create my-app --template minimal --no-add-ons
```

## sv sync

Sync generated types.

```bash
sv sync
```

Updates `.svelte-kit/tsconfig.json` from project files.

## sv prepare

Prepare the project (alias for sync).

```bash
sv prepare
```

## sv check

Check TypeScript types.

```bash
sv check
```

### Options

| Option | Description |
|--------|-------------|
| `--watch` | Watch for changes |
| `--tsconfig` | Custom tsconfig path |

### Examples

```bash
# Single check
sv check

# Watch mode
sv check --watch
```

## sv build

Build for production.

```bash
bun run build
```

Uses `vite build` under the hood.

## sv dev

Start development server.

```bash
bun run dev
```

### Options

| Option | Description |
|--------|-------------|
| `--port` | Port number |
| `--host` | Host to bind |
| `--https` | Enable HTTPS |

### Examples

```bash
# Default
bun run dev

# Custom port
bun run dev -- --port 3000

# Expose to network
bun run dev -- --host
```

## sv preview

Preview production build.

```bash
bun run preview
```

## bun Scripts

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write ."
  }
}
```

## SvelteKit CLI (Legacy)

### svelte-kit

Legacy CLI commands.

```bash
# Sync types
svelte-kit sync

# Generate types
svelte-kit generate

# Prepare project
svelte-kit prepare
```

## Adapter CLI

### @sveltejs/adapter-node

```bash
# Build
node build

# Start
HOST=0.0.0.0 PORT=3000 node build
```

### @sveltejs/adapter-auto

Automatically detects deployment environment.

## Environment Variables

### Development

```bash
# .env
ORIGIN=http://localhost:5173
PORT=5173
HOST=localhost
```

### Build

```bash
# .env
ORIGIN=https://example.com
```
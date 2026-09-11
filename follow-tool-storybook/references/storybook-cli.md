# CLI Reference

## Core Commands

| Command | Description |
|---|---|
| `storybook dev` | Start development server |
| `storybook build` | Build static site for production |
| `storybook test` | Run tests (Vitest addon) |
| `bun create storybook@latest` | Initialize Storybook (v10.6+) |
| `bunx storybook@latest init` | Initialize Storybook (legacy, pre-v8.3) |

## Options

| Flag | Description |
|---|---|
| `--port` | Set port number |
| `--no-open` | Don't open browser automatically |
| `--debug` | Enable debug mode |
| `--quiet` | Reduce output verbosity |
| `--docs` | Enable docs mode |

## Package Manager Flags

| Flag | Description |
|---|---|
| `--package-manager` | Specify package manager (npm, pnpm, yarn, bun) |
| `--type` | Specify project type (react, vue, angular, svelte, etc.) |

## Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev",
    "build-storybook": "storybook build",
    "test-storybook": "storybook test"
  }
}
```

## Development Examples

```bash
# Start on custom port
bun run storybook -- --port 6007

# Start without opening browser
bun run storybook -- --no-open

# Build for production
bun run build-storybook

# Run tests
bun run test-storybook
```

## Version-Specific Commands

### v10.6+ (ESM-only)

```bash
bun create storybook@latest
```

### Pre-v8.3

```bash
bunx storybook@latest init
```

## Framework Detection

Storybook auto-detects framework จาก:
- `package.json` dependencies
- Configuration files (vite.config, angular.json, etc.)

ถ้า auto-detection ล้มเหลว ใช้ `--type` flag:

```bash
bun create storybook@latest --type react
```

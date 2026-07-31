# CLI

## Purpose

CLI reference สำหรับ Vitest commands และ options

## Scope

- Commands (vitest, vitest run, etc.)
- Options (--config, --coverage, etc.)
- Environment Variables
- Examples

## CLI Reference

## Commands

| Command | Description |
|---------|-------------|
| `vitest` | Run tests in watch mode |
| `vitest run` | Run tests once (CI mode) |
| `vitest build` | Build for production |
| `vitest preview` | Preview production build |
| `vitest related` | Run tests related to changed files |
| `vitest --version` | Show version |

## Options

| Option | Description |
|--------|-------------|
| `--config` | Path to config file |
| `--coverage` | Enable coverage |
| `--reporter` | Specify reporter (dot, verbose, json) |
| `--include` | Glob pattern for test files |
| `--exclude` | Glob pattern to exclude |
| `--testTimeout` | Timeout for tests in ms |
| `--passWithNoTests` | Pass if no tests found |
| `--ui` | Enable UI |

## Examples

```bash
# Run all tests
vitest

# Run once
vitest run

# With coverage
vitest run --coverage

# Specific files
vitest run src/components

# CI mode
vitest run --reporter=dot
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITEST` | Set to true when running in Vitest |
| `VI_TEST` | Test mode indicator |
| `VITE_` | Vite env variables available |

---


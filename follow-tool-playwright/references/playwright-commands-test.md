# CLI Commands — Test

## Purpose

Command-line interface reference สำหรับ Playwright — Test Commands

## Scope

- Test Commands

## Test Commands

### playwright test

```bash
bunx playwright test [options] [test-filter...]
```

### Options

| Option | Description |
|--------|-------------|
| `--config <file>` | Config file path |
| `--debug` | Debug mode |
| `--headed` | Show browser |
| `--ui` | Interactive UI mode |
| `-g <grep>` | Filter by name |
| `--project <name>` | Run specific project |
| `-j <workers>` | Number of workers |
| `--timeout <ms>` | Test timeout |
| `--retries <n>` | Retry count |
| `--reporter <name>` | Reporter type |
| `--trace <mode>` | Trace mode |

### Examples

```bash
# Run all tests
bunx playwright test

# Run specific file
bunx playwright test tests/example.spec.ts

# Run by name
bunx playwright test -g "homepage"

# Run at line
bunx playwright test tests/example.spec.ts:42

# Debug
bunx playwright test --debug

# UI mode
bunx playwright test --ui
```

### Common Options

| Option | Description | Default |
|--------|-------------|---------|
| `--workers` | Parallel workers | 50% |
| `--timeout` | Test timeout | 30s |
| `--retries` | Retry count | 0 |
| `--project` | Browser project | all |
| `--reporter` | Reporter | list |

### Filter Options

| Option | Description |
|--------|-------------|
| `-g <grep>` | Match test name |
| `--grep-invert` | Exclude matches |
| `--only-changed` | Changed files only |
| `--test-list` | List of tests |
| `--last-failed` | Only failed tests |

### Output Options

| Option | Description |
|--------|-------------|
| `--output <dir>` | Output directory |
| `--quiet` | Suppress output |
| `--list` | List tests only |

### Special Modes

```bash
# Headed browser
bunx playwright test --headed

# Debug with inspector
bunx playwright test --debug

# Interactive UI
bunx playwright test --ui

# Stop on first failure
bunx playwright test -x
```

## See Also

- [Browser & Utility Commands](./playwright-commands-utils.md) - Install, codegen, show-report, show-trace, merge-reports
- [Configuration](./playwright-config-options.md) - Configuration options
- [API Reference](./playwright-api.md) - Programmatic API

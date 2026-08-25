# CLI Commands

## Purpose

Command-line interface reference สำหรับ Playwright

## Scope

- Test Commands
- Browser Commands
- Utility Commands

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

## Browser Commands

### playwright install

```bash
bunx playwright install [options] [browser...]
```

### Options

| Option | Description |
|--------|-------------|
| `--with-deps` | Install dependencies |
| `--dry-run` | Show what would be installed |
| `--force` | Force reinstall |
| `--only-shell` | Install headless shell only |

### Examples

```bash
# Install all browsers
bunx playwright install

# Install chromium only
bunx playwright install chromium

# Install specific browsers
bunx playwright install chromium firefox webkit

# With dependencies
bunx playwright install --with-deps
```

### playwright install-deps

```bash
bunx playwright install-deps [options] [browser...]
```

### Examples

```bash
# Install all dependencies
bunx playwright install-deps

# Install chromium dependencies
bunx playwright install-deps chromium
```

## Utility Commands

### playwright show-report

```bash
bunx playwright show-report [report] [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--port <port>` | Port number |
| `--host <host>` | Host name |

### Examples

```bash
# Show latest report
bunx playwright show-report

# Custom port
bunx playwright show-report --port 8080
```

### playwright show-trace

```bash
bunx playwright show-trace [trace]
```

### Examples

```bash
# Open trace viewer
bunx playwright show-trace

# View specific trace
bunx playwright show-trace trace.zip
```

### playwright codegen

```bash
bunx playwright codegen [options] [url]
```

### Options

| Option | Description |
|--------|-------------|
| `-b <browser>` | Browser type |
| `-o <file>` | Output file |
| `--target <lang>` | Target language |

### Examples

```bash
# Start codegen
bunx playwright codegen

# With URL
bunx playwright codegen https://example.com

# Python output
bunx playwright codegen --target=python -o test.py
```

### playwright merge-reports

```bash
bunx playwright merge-reports <blob dir> [options]
```

### Examples

```bash
# Merge reports
bunx playwright merge-reports ./reports
```

### playwright clear-cache

```bash
bunx playwright clear-cache
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PLAYWRIGHT_BROWSERS_PATH` | Browser cache path |
| `PWDEBUG` | Debug mode |
| `PWTEST_SKIP_TEST_OUTPUT` | Skip test output |

### Debug Mode

```bash
# Enable debugger
PWDEBUG=1 bunx playwright test

# With console
PWDEBUG=console bunx playwright test
```

## Help

### Show Help

```bash
bunx playwright --help

bunx playwright test --help
```

### Show Version

```bash
bunx playwright --version
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | Test failed |
| `2` | Timeout |
| `3` | Fatal error |

## See Also

- [Configuration](./playwright-config.md) - Configuration options
- [API Reference](./playwright-api.md) - Programmatic API

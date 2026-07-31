# CLI Commands

CLI commands สำหรับ Knip

## Installation

```bash
bun install -D knip
```

## Run Commands

```bash
# Run knip
bunx knip

# Watch mode
bunx knip --watch

# Strict mode (fail on issues)
bunx knip --strict
```

## Options

| Option | Description |
|--------|-------------|
| `--watch` | Watch for changes |
| `--strict` | Exit with error code on issues |
| `--production` | Only check production code |
| `--development` | Only check development code |
| `--dependencies` | Check dependencies |
| `--devDependencies` | Check devDependencies |

## Configuration

```bash
# Use custom config
bunx knip --config knip.config.js

# Output format
bunx knip --format json
bunx knip --format markdown
```

## CI Integration

```bash
# Exit code 1 if issues found
bunx knip --strict
```

## Common Options

| Option | Description |
|--------|-------------|
| `--help` | แสดง help |
| `--version` | แสดง version |
| `--debug` | แสดง debug info |
# CLI Commands

Command-line interface for oxlint

## Installation

```bash
# Install globally
bun install -g oxlint

# Or use via npx
npx oxlint --help
```

## Commands

| Command | Description |
|---------|-------------|
| `oxlint` | Run linting |
| `oxlint --init` | Initialize configuration file |
| `oxlint --fix` | Auto-fix fixable issues |
| `oxlint --version` | Show version |
| `oxlint --help` | Show help |

## Options

```bash
# Show help
oxlint --help

# Show version
oxlint --version

# Specify config file
oxlint --config .oxlintrc.json

# Fix issues
oxlint --fix

# Silent mode
oxlint --quiet

# Format output
oxlint --format json
```

## Examples

```bash
# Run lint on entire project
oxlint

# Run lint on specific files
oxlint src/

# Auto-fix
oxlint --fix

# Initialize config
oxlint --init

# CI mode
oxlint --quiet
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | No errors |
| `1` | Errors found |
| `2` | Configuration error |
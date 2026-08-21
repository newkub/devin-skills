# CLI Commands

Command-line interface for semantic-release

## Installation

```bash
# Install as dev dependency
bun install -D semantic-release

# Or use via npx
npx semantic-release --version
```

## Commands

| Command | Description |
|---------|-------------|
| `semantic-release` | Run semantic-release |
| `semantic-release --dry-run` | Preview without publishing |
| `semantic-release --version` | Show version |

## Options

```bash
# Show help
semantic-release --help

# Show version
semantic-release --version

# Dry run
semantic-release --dry-run

# Debug mode
semantic-release --debug

# Branch
semantic-release --branches main

# Config file
semantic-release --extends @semantic-release/commit-analyzer

# Noci (skip verification)
semantic-release --noci
```

## Environment

```bash
# Required environment variables
# bun_TOKEN for bun publishing
# GH_TOKEN or GITHUB_TOKEN for GitHub releases
```

## Examples

```bash
# Standard release
npx semantic-release

# Dry run
npx semantic-release --dry-run

# Specific branch
npx semantic-release --branches main

# Debug
npx semantic-release --debug
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | Error |

## See Also

- [Configuration](./configuration.md) - Config options
- [Programmatic API](./programmatic-api.md) - Programmatic usage

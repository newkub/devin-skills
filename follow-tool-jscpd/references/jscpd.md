# jscpd Reference

## Overview

jscpd is a copy/paste detector for programming source code. It implements the Rabin-Karp algorithm to find duplicated code blocks across files. Version 5.x is a ground-up Rust rewrite that is 24-37x faster than v4.x and does not require Node.js.

## Install

Install as dev dependency:

```bash
bun add -D jscpd
```

Run without installing:

```bash
bunx jscpd /path/to/code
```

## Version Info

- Latest stable: `5.0.16` (Rust engine)
- TypeScript engine: `4.2.5` (`jscpd@4`)
- License: MIT
- Node.js: `>=18` (for npm wrapper; Rust binary is self-contained)
- Source: https://github.com/kucherenko/jscpd
- Docs: https://jscpd.dev

## Peer Dependencies

No peer dependencies. Platform-specific binaries are installed as optional dependencies:
- `jscpd-darwin-x64`
- `jscpd-darwin-arm64`
- `jscpd-linux-x64-gnu`
- `jscpd-linux-x64-musl`
- `jscpd-linux-arm64-gnu`
- `jscpd-windows-x64-msvc`

## v4 vs v5 Comparison

| | TypeScript (v4) | Rust (v5) |
|---|---|---|
| npm package | `jscpd@4` | `jscpd@5` |
| CLI command | `jscpd` | `jscpd` |
| Speed | Baseline | 24-37x faster |
| Formats | 224 | 223 |
| Node.js required | Yes | No |
| Programming API | TypeScript | Rust crate |
| LevelDB store | Yes | No |
| Reporters | 13 | 13 |

## Configuration

jscpd uses `.jscpd.json` at the project root.

### Full configuration example

```json
{
  "threshold": 0,
  "reporters": ["console", "json"],
  "ignore": [
    "/node_modules/",
    "/dist/",
    "/.turbo/",
    "/coverage/",
    "**/*.lock",
    "**/bun.lock",
    "/.output/",
    "/dist-spa/"
  ],
  "absolute": true,
  "gitignore": true,
  "minLines": 5,
  "minTokens": 50
}
```

### Configuration options

| Option | Default | Description |
|--------|---------|-------------|
| `threshold` | `0` | Max duplication % before exit code 1 |
| `reporters` | `["console"]` | Output reporters |
| `ignore` | `[]` | Glob patterns to ignore |
| `absolute` | `false` | Use absolute paths in report |
| `gitignore` | `false` | Respect `.gitignore` patterns |
| `minLines` | `5` | Minimum lines for a duplicate |
| `minTokens` | `50` | Minimum tokens for a duplicate |
| `maxLines` | - | Maximum lines per duplicate block |
| `mode` | `"mild"` | Detection mode |
| `format` | all | Comma-separated formats to check |
| `output` | `"report"` | Output directory for file reporters |

### Detection modes

- `mild` (default) - skip ignored blocks, new lines, empty symbols
- `strict` - use all token types (detailed detection)
- `weak` - skip comments (reduces noise)

## Reporters

| Reporter | Description |
|----------|-------------|
| `console` | Summary in terminal |
| `json` | Structured JSON output |
| `html` | Interactive HTML report |
| `markdown` | Markdown report for PRs/docs |
| `sarif` | GitHub Code Scanning integration |

## CLI Commands

```bash
# Scan current directory
jscpd .

# Scan specific paths
jscpd ./src ./integrations

# With reporters and output
jscpd . --reporters console,json --output report

# CI gate with threshold
jscpd . --threshold 10

# HTML report
jscpd . --reporters html

# SARIF for GitHub Code Scanning
jscpd . --reporters sarif

# Skip local duplicates (cross-workspace only)
jscpd . --skip-local

# Specific formats only
jscpd . --format ts,js

# Strict mode
jscpd . --mode strict

# Suppress tips in CI
jscpd . --no-tips

# Silent mode
jscpd . --silent

# List all supported formats
jscpd --list
```

### CLI flags

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--min-tokens` | `-k` | `50` | Minimum tokens for duplicate |
| `--min-lines` | `-l` | `5` | Minimum lines for duplicate |
| `--max-lines` | `-x` | - | Maximum lines per duplicate |
| `--mode` | `-m` | `mild` | Detection mode |
| `--format` | `-f` | all | Formats to check |
| `--ignore-pattern` | `-i` | - | Glob patterns to ignore |
| `--reporters` | `-r` | `console` | Output reporters |
| `--output` | `-o` | `report` | Output directory |
| `--config` | `-c` | - | Path to config file |
| `--threshold` | `-t` | - | Max duplication % before exit 1 |
| `--blame` | `-b` | - | Enrich clones with git blame |
| `--skip-local` | - | - | Skip clones within same directory |
| `--silent` | `-s` | - | Suppress console output |
| `--list` | - | - | List all supported formats |

## Package.json Scripts

```json
{
  "scripts": {
    "report:duplication": "bunx jscpd . --reporters console,json --output report"
  }
}
```

## CI Integration

```bash
# Fail CI when duplication >= 10%
jscpd . --threshold 10 --reporters console,sarif --no-tips

# GitHub Code Scanning with SARIF
jscpd . --reporters sarif --output report
```

## Source

- https://github.com/kucherenko/jscpd
- https://github.com/kucherenko/jscpd/blob/master/README.md
- https://jscpd.dev

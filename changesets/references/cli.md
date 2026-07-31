# CLI Commands

Complete reference for Changesets CLI commands

## Installation Commands

| Command | Description |
|---------|-------------|
| `bun install -D @changesets/cli` | Install as dev dependency |
| `bunx changeset init` | Initialize changesets config |
| `npx changeset init` | Initialize (bun/bun) |

## Core Commands

| Command | Description |
|---------|-------------|
| `bunx changeset` | Create new changeset (interactive) |
| `bunx changeset add` | Add changeset (non-interactive) |
| `bunx changeset version` | Apply version bumps |
| `bunx changeset publish` | Publish to bun registry |

## Init Command

```bash
# Initialize changesets
bunx changeset init
```

Creates:
- `.changeset/config.json`
- `.changeset/README.md`
- Updates `package.json` scripts

## Add Command

```bash
# Interactive mode
bunx changeset

# Non-interactive mode
bunx changeset add --empty
```

## Version Command

```bash
# Version all packages
bunx changeset version

# With specific bump
bunx changeset version --major
bunx changeset version --minor
bunx changeset version --patch

# Dry run
bunx changeset version --dry-run

# Skip commit
bunx changeset version --no-commit
```

## Publish Command

```bash
# Publish all packages
bunx changeset publish

# With build
bunx changeset build

# Skip git tag
bunx changeset publish --no-git-tag
```

## Status Commands

```bash
# Show pending changesets
bunx changeset status

# JSON output
bunx changeset status --json

# Show verbose output
bunx changeset status --verbose
```

## Other Commands

| Command | Description |
|---------|-------------|
| `bunx changeset info` | Show package info |
| `bunx changeset diff` | Show diff |
| `bunx changeset pre` | Enter pre-release mode |
| `bunx changeset exit` | Exit pre-release mode |

## Common Options

| Option | Description |
|--------|-------------|
| `--help` | Show help |
| `--version` | Show version |
| `--dry-run` | Preview without changes |
| `--ci` | CI mode (non-interactive) |
| `--empty` | Create empty changeset |
| `--ignore` | Packages to ignore |

## Script Integration

Add to `package.json`:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "publish": "changeset publish",
    "release": " changeset version && changeset publish"
  }
}
```

## Workflow Commands

```bash
# Full release workflow
bunx changeset version && bunx changeset publish

# With build
bun run build && bunx changeset version && bunx changeset publish
```
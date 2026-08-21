# CLI Commands

## Purpose

Command-line interface reference สำหรับ Release It

## Scope

- Basic Commands
- Options
- Examples
- Exit Codes

## Installation

```bash
# bun
bun install -D release-it

# Global
bun install -g release-it
```

## Basic Commands

### Interactive Release

```bash
# Interactive mode
npx release-it

# With config
npx release-it --config .release-it.json
```

### CI Mode

```bash
# Fully automated (no prompts)
npx release-it --ci

# Only version prompt
npx release-it --only-version
```

### Dry Run

```bash
# Show what would happen
npx release-it --dry-run

# Dry run in CI mode
npx release-it --ci --dry-run
```

## Options

### Version Options

| Option | Description | Example |
|--------|-------------|---------|
| `--preRelease` | Pre-release type | `--preRelease=beta` |
| `--only-version` | Only version prompt | `--only-version` |
| `--skipChecks` | Skip version check | `--skipChecks` |
| `--increment` | Custom increment | `--increment=minor` |

### Pre-release Examples

```bash
# Beta
release-it --preRelease=beta

# Alpha
release-it --preRelease=alpha

# RC
release-it --preRelease=rc

# Auto detect
release-it --preRelease
```

### Output Options

| Option | Description | Example |
|--------|-------------|---------|
| `-V, --verbose` | Verbose output | `-V` |
| `-VV` | Very verbose | `-VV` |
| `-o, --only-version` | Only version prompt | `--only-version` |
| `--changelog` | Print changelog | `--changelog` |
| `--release-version` | Print next version | `--release-version` |

### Skip Options

| Option | Description |
|--------|-------------|
| `--no-git` | Skip git operations |
| `--no-bun` | Skip bun publish |
| `--no-increment` | Don't increment version |
| `--no-git.push` | Skip git push |
| `--no-github` | Skip GitHub release |
| `--no-gitlab` | Skip GitLab release |

### Git Options

| Option | Description | Example |
|--------|-------------|---------|
| `--git-commit-message` | Custom commit message | `--git-commit-message="release"` |
| `--git-tag-name` | Custom tag name | `--git-tag-name="v${version}"` |
| `--git-push-args` | Custom push args | `--git-push-args="--force"` |

### bun Options

| Option | Description | Example |
|--------|-------------|---------|
| `--bun-dist-tag` | Distribution tag | `--bun-dist-tag=next` |
| `--bun-otp` | One-time password | `--bun-otp=123456` |

### GitHub Options

| Option | Description | Example |
|--------|-------------|---------|
| `--github-token` | GitHub token | `--github-token=xxx` |
| `--github-assets` | Release assets | `--github-assets=dist/*.js` |

### Config Options

| Option | Description | Example |
|--------|-------------|---------|
| `-c, --config` | Config file | `--config=.release-it.json` |
| `-d, --dry-run` | Dry run | `--dry-run` |

## Hook Options

### Inline Hooks

```bash
# Before init hook
release-it --'hooks.before:init="bun run lint"'

# After release hook
release-it --'hooks.after:release="echo Released v${version}"'
```

### Verbose Hooks

```bash
# Show hook output
release-it --verbose

# Show all output
release-it -VV
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub releases |
| `GITLAB_TOKEN` | GitLab releases |
| `bun_TOKEN` | bun publishing |
| `NODE_DEBUG` | Debug mode |

### Debug Mode

```bash
# Verbose output
release-it -V

# Very verbose
release-it -VV

# Debug mode
NODE_DEBUG=release-it:* release-it
```

## Examples

### Basic Release

```bash
# Interactive
npx release-it

# CI mode
npx release-it --ci
```

### Pre-release

```bash
# Beta
npx release-it --preRelease=beta

# Alpha
npx release-it --preRelease=alpha

# RC
npx release-it --preRelease=rc
```

### Specific Version

```bash
# Patch
npx release-it --increment=patch

# Minor
npx release-it --increment=minor

# Major
npx release-it --increment=major
```

### With Plugins

```bash
# With conventional changelog
npx release-it --ci

# Skip checks
npx release-it --ci --skipChecks
```

### Custom Config

```bash
# Different config
npx release-it --config .release-it.prod.json

# Dry run
npx release-it --dry-run
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | Error |

## Help

### Show Help

```bash
release-it --help
```

### Show Version

```bash
release-it --version
```

### Help Output

```
Usage: release-it [options]

Options:
  --ci                    CI mode (non-interactive)
  --dry-run              Dry run mode
  --preRelease <type>    Pre-release type (alpha, beta, rc)
  --increment <type>     Version increment (major, minor, patch)
  --only-version         Only prompt for version
  --skipChecks           Skip version check
  -c, --config <file>    Config file
  -V, --verbose          Verbose output
  -VV                    Very verbose output
  --help                 Show help
  --version              Show version
```

## See Also

- [Configuration](./configuration.md) - Configuration options
- [Programmatic API](./api.md) - Programmatic usage

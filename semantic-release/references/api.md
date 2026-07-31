# Programmatic API

Programmatic usage of semantic-release

## CLI Usage

```bash
# Install semantic-release
bun install -D semantic-release

# Run semantic-release
npx semantic-release

# Run with dry-run
npx semantic-release --dry-run

# Run with specific branch
npx semantic-release --branches main
```

## Configuration (.releaserc.json)

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/bun",
    "@semantic-release/github"
  ]
}
```

## Configuration in package.json

```json
{
  "name": "my-package",
  "version": "0.0.0-development",
  "scripts": {
    "release": "semantic-release"
  },
  "devDependencies": {
    "semantic-release": "^24.0.0"
  },
  "release": {
    "branches": ["main"]
  }
}
```

## Conventional Commits

```bash
# Feature (minor)
git commit -m "feat: add new feature"

# Bug fix (patch)
git commit -m "fix: resolve issue"

# Breaking change (major)
git commit -m "feat!: breaking change"

# With scope
git commit -m "feat(api): add new endpoint"
```

## Environment Variables

```env
# GitHub token
GITHUB_TOKEN=ghp_xxxx

# bun token
bun_TOKEN=xxxx

# Debug mode
DEBUG=semantic-release:*
```

## Commit Types

| Type | Description | Version |
|------|-------------|---------|
| `feat` | New feature | minor |
| `fix` | Bug fix | patch |
| `perf` | Performance | patch |
| `refactor` | Code refactor | patch |
| `docs` | Documentation | patch |
| `test` | Tests | patch |
| `build` | Build changes | patch |
| `ci` | CI changes | patch |
| `chore` | Maintenance | patch |

ดูรายละเอีนดเพิ่มเติมที่: [semantic-release Documentation](https://semantic-release.gitbook.io/semantic-release/)
# Configuration

Configuration options for semantic-release

## Config Files

| File | Path | Description |
|------|------|-------------|
| `.releaserc.json` | project root | JSON config |
| `.releaserc.js` | project root | JS config |
| `.releaserc.yaml` | project root | YAML config |
| `release.config.js` | project root | CommonJS config |
| `package.json` | `release` property | Inline config |

## .releaserc.json

```json
{
  "branches": ["main", "stable"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/bun",
    "@semantic-release/github"
  ]
}
```

## package.json

```json
{
  "name": "my-package",
  "version": "0.0.0-development",
  "scripts": {
    "semantic-release": "semantic-release"
  },
  "devDependencies": {
    "semantic-release": "^24.0.0"
  },
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/bun",
      "@semantic-release/github"
    ]
  }
}
```

## Options Reference

### Branches

| Option | Type | Description |
|--------|------|-------------|
| `branches` | array | Release branches |
| `branches` | string | Single branch |

### Plugins

| Plugin | Description |
|--------|-------------|
| `@semantic-release/commit-analyzer` | Analyze commits |
| `@semantic-release/release-notes-generator` | Generate notes |
| `@semantic-release/bun` | Publish to bun |
| `@semantic-release/github` | Create GitHub release |
| `@semantic-release/changelog` | Generate changelog |
| `@semantic-release/git` | Git operations |

### Conditions

```json
{
  "branches": [
    "main",
    "stable",
    {
      "name": "beta",
      "prerelease": true
    }
  ]
}
```

## See Also

- [CLI](./cli.md) - CLI commands
- [Programmatic API](./programmatic-api.md) - Programmatic usage
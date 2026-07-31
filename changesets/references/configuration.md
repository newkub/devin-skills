# Configuration Reference

Complete reference for Changesets configuration

## Config File

Location: `.changeset/config.json` or `.changesetrc.json`

## Schema

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json"
}
```

## Configuration Options

### changelog

| Type | Default | Description |
|------|---------|-------------|
| string | `@changesets/changelog-git` | Changelog generator |
| array | - | Array with plugin and options |

```json
{
  "changelog": "@changesets/changelog-git"
}

{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "username/repo" }
  ]
}
```

### commit

| Type | Default | Description |
|------|---------|-------------|
| boolean | `false` | Auto commit version changes |

```json
{ "commit": true }
```

### fixed

Packages that must always release together:

```json
{
  "fixed": [
    ["@org/shared", "@org/utils"],
    ["@org/core", "@org/cli"]
  ]
}
```

### linked

Packages that share the same version:

```json
{
  "linked": [
    ["@org/pkg-a", "@org/pkg-b"]
  ]
}
```

### access

| Type | Default | Values |
|------|---------|--------|
| string | `"restricted"` | `"public"` or `"restricted"` |

```json
{ "access": "public" }
```

### baseBranch

| Type | Default | Description |
|------|---------|-------------|
| string | `"main"` | Branch to compare against |

```json
{ "baseBranch": "main" }
```

### updateInternalDependencies

| Type | Default | Values |
|------|---------|--------|
| string | `"patch"` | `"patch"`, `"minor"`, `"major"`, `"never"` |

```json
{ "updateInternalDependencies": "minor" }
```

### ignore

Packages to skip during versioning:

```json
{
  "ignore": ["@org/internal-tool", "docs"]
}
```

### gitTag

| Type | Default | Description |
|------|---------|-------------|
| boolean | `true` | Create git tags |

```json
{ "gitTag": false }
```

### push

| Type | Default | Description |
|------|---------|-------------|
| boolean | `true` | Push changes to remote |

```json
{ "push": false }
```

## Complete Example

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "my-org/my-repo" }
  ],
  "commit": true,
  "fixed": [
    ["@my-org/shared"]
  ],
  "linked": [
    ["@my-org/core", "@my-org/utils"]
  ],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "gitTag": true,
  "push": true
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub API token (for GitHub changelog) |
| `bun_TOKEN` | bun publish token |
| `CI` | Set when running in CI environment |
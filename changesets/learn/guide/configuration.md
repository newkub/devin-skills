# Configuration

การตั้งค่า config.json สำหรับ Changesets

## Config File Location

`.changeset/config.json`

## Schema

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

## Options

### changelog

Changelog generator:
```json
{
  "changelog": "@changesets/cli/changelog"
}
```

### commit

Auto-commit changes:
```json
{
  "commit": true
}
```

### fixed

Packages that always version together:
```json
{
  "fixed": ["@my/core", "@my/utils"]
}
```

### linked

Packages that version together:
```json
{
  "linked": ["@my/ui", "@my/components"]
}
```

### access

Package access level:
- `restricted`: Private packages (default)
- `public`: Public packages

```json
{
  "access": "public"
}
```

### baseBranch

Base branch for changes:
```json
{
  "baseBranch": "main"
}
```

### updateInternalDependencies

How to update internal dependencies:
- `patch`: Update to patch version (default)
- `minor`: Update to minor version

```json
{
  "updateInternalDependencies": "patch"
}
```

### ignore

Packages to ignore:
```json
{
  "ignore": ["@my/internal"]
}
```

## Examples

### Monorepo with Private Packages

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

### Monorepo with Public Packages

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

### With Linked Packages

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "linked": ["@my/ui", "@my/components"],
  "access": "public",
  "baseBranch": "main"
}
```

### With Fixed Packages

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": ["@my/core", "@my/utils"],
  "access": "public",
  "baseBranch": "main"
}
```

## Best Practices

1. **Commit Changesets**: Commit changeset files separately
2. **Version Before Release**: Run version command before release
3. **Test Locally**: Test versioning locally before publishing
4. **Review Changelog**: Review generated changelog before publishing

# Features

Features ทั้งหมดของ Changesets

## Core Features

### Monorepo Support
- Track changes ข้าม multiple packages
- Handle internal dependencies
- Version packages together

### Semantic Versioning
- Automatic version calculation
- Support major, minor, patch
- Follow semver spec

### Changelog Generation
- Automatic changelog creation
- Markdown format
- Organized by version

### Release Automation
- Automated publishing
- CI/CD integration
- Release PR generation

## Advanced Features

### Custom Config
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

### Linked Packages
Version packages พร้อมกัน:
```json
{
  "linked": ["@my/ui", "@my/components"]
}
```

### Fixed Packages
Always version together:
```json
{
  "fixed": ["@my/core", "@my/utils"]
}
```

### Access Control
Control package access:
- `public`: Public packages
- `restricted`: Private packages

### Ignore Packages
Skip specific packages:
```json
{
  "ignore": ["@my/internal"]
}
```

## CLI Features

### Commands
- `changeset`: Create new changeset
- `changeset version`: Version packages
- `changeset publish`: Publish packages
- `changeset init`: Initialize changesets
- `changeset add`: Add changeset programmatically

### Options
- `--verbose`: Detailed output
- `--snapshot`: Snapshot version
- `--ignore`: Ignore packages
- `--otp`: One-time password

## Integration Features

### Package Managers
- bun
- yarn
- bun
- bun

### CI/CD
- GitHub Actions
- GitLab CI
- CircleCI
- Travis CI

### Git Providers
- GitHub
- GitLab
- Bitbucket

## Additional Features

### Pre-releases
Support pre-release versions:
- alpha
- beta
- rc

### Private Packages
Support private registries:
- GitHub Packages
- GitLab Package Registry
- Verdaccio

### Custom Changelogs
Custom changelog generation:
- Custom templates
- Custom formats
- Custom sections

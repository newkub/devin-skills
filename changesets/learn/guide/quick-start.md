# Quick Start

เริ่มต้นใช้งาน Changesets อย่างรวดเร็ว

## Installation

```bash
bun add -D @changesets/cli
```

## Initialize

```bash
bunx changeset init
```

## Create Changeset

```bash
bunx changeset
```

Select:
- Packages to change
- Version bump type (major, minor, patch)
- Changelog message

## Version Packages

```bash
bunx changeset version
```

This will:
- Update package.json
- Generate CHANGELOG.md
- Remove changeset files

## Publish

```bash
bunx changeset publish
```

## Common Workflow

```bash
# 1. Make changes
# Edit code

# 2. Create changeset
bunx changeset

# 3. Commit changeset
git add .
git commit -m "feat: add new feature"

# 4. Version (when ready to release)
bunx changeset version
git add .
git commit -m "chore: version packages"

# 5. Publish
bunx changeset publish
```

## Tips

- **Create changesets early**: Don't wait until release
- **Be specific with messages**: Write clear changelog messages
- **Review before versioning**: Check changesets before versioning
- **Test locally**: Test versioning locally before publishing

# Tag Guide

## วัตถุประสงค์

เรียนรู้วิธีใช้ tags เพื่อ mark releases และ milestones ที่สำคัญ

## เมื่อใช้ Tags

- Mark releases (v1.0.0, v2.1.3)
- Mark milestones สำคัญ
- Mark hotfix commits
- Mark stable points ใน development

## ขั้นตอนพื้นฐาน

### 1. Create Tag

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 <commit-hash> -m "Release version 1.0.0"
```

### 2. List Tags

```bash
# List all tags
git tag

# List tags พร้อม messages
git tag -n

# Search tags
git tag -l "v1.*"
```

### 3. Show Tag

```bash
# Show tag details
git show v1.0.0

# Show lightweight tag
git show v1.0.0  # shows commit info
```

### 4. Push Tags

```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# Push tags พร้อม commits
git push origin main --tags
```

### 5. Delete Tag

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

## Use Cases

### Mark Release

```bash
# หลัง release
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- Add user authentication
- Implement payment gateway
- Improve performance

Breaking changes:
- Update API endpoints"
git push origin v1.0.0
```

### Mark Hotfix

```bash
# Hotfix commit
git commit -m "Fix: critical security issue"

# Tag hotfix
git tag -a v1.0.1 -m "Hotfix: security patch"
git push origin v1.0.1
```

### Mark Milestone

```bash
# Milestone complete
git tag -a milestone-1 -m "Milestone 1: Core features complete"
git push origin milestone-1
```

## Best Practices

- **Semantic Versioning**: ใช้ MAJOR.MINOR.PATCH format
- **Annotated for Releases**: ใช้ annotated tags สำหรับ releases
- **Descriptive Messages**: ใส่ changelog ใน tag message
- **Push Tags**: push tags ไป remote เสมอ
- **Sign Tags**: sign ด้วย GPG สำหรับ security

## Semantic Versioning

```
vMAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)
```

ตัวอย่าง:
- `v1.0.0` - Initial release
- `v1.1.0` - New features
- `v1.1.1` - Bug fix
- `v2.0.0` - Breaking changes

## Advanced Usage

### Signed Tags

```bash
# Sign tag ด้วย GPG
git tag -s v1.0.0 -m "Signed release"

# Verify signature
git tag -v v1.0.0
```

### Checkout Tag

```bash
# Checkout tag (detached HEAD)
git checkout v1.0.0

# Create branch จาก tag
git checkout -b release-1.0.0 v1.0.0
```

### Compare Tags

```bash
# Compare 2 tags
git diff v1.0.0 v2.0.0

# Show log ระหว่าง tags
git log v1.0.0..v2.0.0
```

## ตัวอย่าง Workflow

```bash
# 1. Develop feature
git checkout develop
# work...

# 2. Prepare release
git checkout -b release/v1.0.0

# 3. Update version
# edit package.json...

# 4. Commit
git commit -m "Bump version to 1.0.0"

# 5. Tag
git tag -a v1.0.0 -m "Release 1.0.0"

# 6. Merge to main
git checkout main
git merge release/v1.0.0

# 7. Push
git push origin main
git push origin v1.0.0

# 8. Back to develop
git checkout develop
git merge main
```

## Tag Naming Conventions

### Semantic Versioning
- `v1.0.0`, `v2.1.3`, `v3.0.0-beta.1`

### Date-based
- `2024-01-15`, `2024-Q1`, `2024.06`

### Milestone
- `milestone-1`, `sprint-5`, `phase-2`

### Environment
- `prod-v1`, `staging-v2`, `dev-v3`

## References

- `key-concepts/tag.md` - แนวคิดพื้นฐาน

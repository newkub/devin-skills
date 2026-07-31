# Branch

## Definition

Branch คือเส้นทางการพัฒนาที่แยกออกมา:
- ใช้สำหรับ develop features แยกกัน
- ไม่กระทบกับ main branch
- สามารถ merge กลับมาได้เมื่อเสร็จ
- ช่วยลดความขัดแย้งในการทำงาน

## Branch Types

### Main Branch
- Production-ready code
- Stable version
- Protected branch
- Deployed to production

### Develop Branch
- Integration branch
- Pre-production
- Features merged here
- Testing environment

### Feature Branches
- New features
- Bug fixes
- Experiments
- Short-lived

### Release Branches
- Release preparation
- Bug fixes for release
- Version tagging
- Deploy to staging

### Hotfix Branches
- Production fixes
- Critical bugs
- Direct from main
- Fast deployment

## Creating Branches

```bash
# Create new branch
git branch feature-name

# Create and switch
git checkout -b feature-name
# or
git switch -c feature-name

# From specific commit
git branch feature-name abc123

# From remote branch
git branch feature-name origin/feature-name
```

## Switching Branches

```bash
# Switch to branch
git checkout feature-name
# or
git switch feature-name

# Switch to previous branch
git checkout -
# or
git switch -
```

## Listing Branches

```bash
# List local branches
git branch

# List remote branches
git branch -r

# List all branches
git branch -a

# List with last commit
git branch -v

# List with detailed info
git branch -vv
```

## Renaming Branches

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name
```

## Deleting Branches

```bash
# Delete local branch (merged)
git branch -d feature-name

# Delete local branch (force)
git branch -D feature-name

# Delete remote branch
git push origin --delete feature-name
```

## Branch Naming Conventions

```
feature/description
bugfix/description
hotfix/description
release/version
docs/description
refactor/description
```

Examples:
```
feature/user-authentication
bugfix/login-timeout
hotfix/security-patch
release/v1.2.0
docs/api-readme
refactor/user-service
```

## Best Practices

- ใช้ short-lived branches
- ตั้งชื่อที่ชัดเจน
- Delete branches หลัง merge
- ไม่ push ไป main โดยตรง
- ใช้ branch protection rules
- Keep main branch stable

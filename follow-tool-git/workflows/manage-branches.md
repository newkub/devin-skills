# Manage Branches

## Description

สร้าง แก้ไข และลบ branches

## Create Branch

### Create New Branch

```bash
# Create branch
git branch feature-name

# Create and switch
git switch -c feature-name

# Create from specific commit
git branch feature-name abc123

# Create from remote branch
git branch feature-name origin/feature-name
```

### Switch Branch

```bash
# Switch to branch
git switch feature-name

# Switch to previous branch
git switch -
```

## List Branches

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

## Rename Branch

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name
```

## Delete Branch

```bash
# Delete local branch (merged)
git branch -d feature-name

# Delete local branch (force)
git branch -D feature-name

# Delete remote branch
git push origin --delete feature-name

# Or
git push origin :feature-name
```

## Branch Naming

### Feature Branches

```bash
feature/description
feature/ticket-description
```

Examples:
```bash
feature/user-authentication
feature/123-login-form
```

### Bug Fix Branches

```bash
bugfix/description
fix/description
hotfix/description
```

Examples:
```bash
bugfix/login-timeout
fix/456-null-pointer
hotfix/security-patch
```

### Release Branches

```bash
release/version
```

Examples:
```bash
release/v1.2.0
release/2.0.0
```

## Track Remote Branch

```bash
# Track remote branch
git branch --set-upstream-to=origin/main main

# Or when creating and tracking
git switch -c local-branch --track origin/remote-branch
```

## Compare Branches

```bash
# Compare branches
git diff main feature-branch

# Compare with merge base
git diff main...feature-branch

# View commits in branch not in main
git log main..feature-branch

# View commits in main not in branch
git log feature-branch..main
```

## Best Practices

1. Short-Lived Branches: Delete branches หลัง merge
2. Meaningful Names: ใช้ชื่อที่อธิบายได้
3. Branch from Main: Branch จาก main หรือ develop
4. Keep Main Clean: ไม่ commit โดยตรงไป main
5. Use Protection Rules: ใช้ branch protection
6. Regular Cleanup: Delete unused branches

## Common Issues

### Branch Already Exists

```bash
# Delete existing branch first
git branch -D feature-name

# Or use different name
git branch feature-name-2
```

### Cannot Delete Branch

```bash
# Force delete
git branch -D feature-name

# Or switch to another branch first
git switch main
git branch -D feature-name
```

### Detached HEAD

```bash
# Create branch from detached HEAD
git switch -c new-branch

# Or go back to branch
git switch main
```

### Branch Not Tracking Remote

```bash
# Set upstream
git branch --set-upstream-to=origin/main main

# Or push with tracking
git push -u origin main
```

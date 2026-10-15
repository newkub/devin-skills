# Push Changes

## Description

Push commits to the remote repository

## Steps

### 1. Check Status

```bash
# Check current branch
git branch

# Check ahead/behind
git status
```

### 2. Push Current Branch

```bash
# Push current branch
git push origin main

# Push with upstream tracking (first time)
git push -u origin main

# Push all branches
git push --all origin
```

### 3. Push Tags

```bash
# Push all tags
git push --tags

# Push specific tag
git push origin v1.0.0
```

### 4. Verify Push

```bash
# Check remote status
git status

# View remote branches
git branch -r
```

## Advanced Options

### Force Push

```bash
# Force push (dangerous)
git push --force origin main

# Force with lease (safer)
git push --force-with-lease origin main
```

### Push Specific Commit

```bash
# Push specific commit
git push origin abc123:main

# Push from specific branch
git push origin feature-branch:main
```

### Delete Remote Branch

```bash
# Delete remote branch
git push origin --delete feature-branch

# Or
git push origin :feature-branch
```

## Best Practices

1. Pull Before Push: pull the latest changes before pushing
2. Review Changes: review commits before pushing
3. Use Force with Lease: use --force-with-lease instead of --force
4. Protect Main Branch: use branch protection
5. Push Often: push frequently for backup

## Common Issues

### Authentication Failed

```bash
# Configure credentials
git config --global credential.helper manager-core

# Or use SSH
git remote set-url origin git@github.com:user/repo.git
```

### Push Rejected

```bash
# Pull first
git pull origin main

# Resolve conflicts
# Then push
git push origin main
```

### Remote Branch Doesn't Exist

```bash
# Push with upstream tracking
git push -u origin feature-branch
```

### Protected Branch

```bash
# Cannot push to protected branch
# Create pull request instead
# Or contact admin for permission
```

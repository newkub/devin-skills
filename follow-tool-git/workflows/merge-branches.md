# Merge Branches

## Description

Merge branch หนึ่งเข้ากับอีก branch

## Steps

### 1. Switch to Target Branch

```bash
# Switch to branch you want to merge into
git switch main
```

### 2. Update Target Branch

```bash
# Pull latest changes
git pull origin main
```

### 3. Merge Source Branch

```bash
# Merge feature branch
git merge feature-branch

# Merge with specific strategy
git merge --no-ff feature-branch
git merge --squash feature-branch
```

### 4. Resolve Conflicts (if any)

```bash
# If conflicts occur:
# Edit conflicted files
git add resolved-file.txt
git commit
```

### 5. Push Changes

```bash
# Push merged changes
git push origin main
```

### 6. Delete Source Branch (optional)

```bash
# Delete local branch
git branch -d feature-branch

# Delete remote branch
git push origin --delete feature-branch
```

## Merge Strategies

### Fast-Forward Merge

```bash
# Fast-forward only
git merge --ff-only feature-branch
```

### No Fast-Forward

```bash
# Always create merge commit
git merge --no-ff feature-branch
```

### Squash Merge

```bash
# Squash commits
git merge --squash feature-branch
git commit -m "Feature description"
```

### Rebase Merge

```bash
# Rebase before merge
git switch feature-branch
git rebase main
git switch main
git merge feature-branch
```

## Conflict Resolution

### View Conflicts

```bash
# View conflicted files
git status

# View conflicts in file
git diff
```

### Resolve Conflicts

```bash
# Edit conflicted files
# Choose which changes to keep
# Remove conflict markers

# Stage resolved files
git add resolved-file.txt

# Continue merge
git commit
```

### Use Merge Tool

```bash
# Use configured merge tool
git mergetool

# Configure merge tool
git config --global merge.tool vscode
```

### Abort Merge

```bash
# Abort merge if needed
git merge --abort
```

## Best Practices

1. Update Before Merge: Pull latest changes ก่อน merge
2. Review Changes: Review changes ก่อน merge
3. Test After Merge: Test หลัง merge
4. Resolve Conflicts Carefully: Resolve conflicts อย่างระมัดระวัง
5. Delete Merged Branches: Delete branches หลัง merge
6. Use Pull Requests: ใช้ PR สำหรับ review

## Common Issues

### Conflicts

```bash
# Resolve conflicts manually
# Or use merge tool
git mergetool
```

### Already Up to Date

```bash
# Nothing to merge
# Branch is already up to date
```

### Merge Conflict with Binary Files

```bash
# Choose which version to keep
git restore --ours -- binary-file
# or
git restore --theirs -- binary-file

git add binary-file
git commit
```

### Merge Commit Message

```bash
# Edit merge commit message
git commit --amend
```

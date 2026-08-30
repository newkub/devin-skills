# Resolve Conflicts

## Description

แก้ไข merge conflicts เมื่อ branches มีการเปลี่ยนแปลงที่ขัดแย้งกัน

## Steps

### 1. Identify Conflicts

```bash
# Attempt merge
git merge feature-branch

# Git will show conflicts
git status
```

### 2. View Conflicts

```bash
# View conflicted files
git status

# View conflicts in file
git diff

# View specific file
cat conflicted-file.txt
```

### 3. Understand Conflict Markers

```
<<<<<<< HEAD
Current branch content
=======
Incoming branch content
>>>>>>> feature-branch
```

- `<<<<<<< HEAD`: Changes in current branch
- `=======`: Separator
- `>>>>>>> feature-branch`: Changes in incoming branch

### 4. Resolve Conflicts

```bash
# Edit conflicted file
# Choose which changes to keep
# Remove conflict markers

# Example resolution:
# Keep both changes
# Keep one change
# Combine changes
# Write new code
```

### 5. Stage Resolved Files

```bash
# Stage resolved file
git add resolved-file.txt

# Stage all resolved files
git add .
```

### 6. Complete Merge

```bash
# Commit merge
git commit

# Git will create merge commit automatically
```

### 7. Verify Resolution

```bash
# Check status
git status

# View merge commit
git log -1

# Test changes
```

## Conflict Resolution Strategies

### Keep Current Changes

```bash
# Keep HEAD changes
git restore --ours -- conflicted-file.txt
git add conflicted-file.txt
```

### Keep Incoming Changes

```bash
# Keep incoming changes
git restore --theirs -- conflicted-file.txt
git add conflicted-file.txt
```

### Use Merge Tool

```bash
# Use configured merge tool
git mergetool

# Configure merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
```

### Manual Resolution

```bash
# Edit file manually
# Remove conflict markers
# Choose appropriate code
git add conflicted-file.txt
```

## Binary File Conflicts

```bash
# Choose which version to keep
git restore --ours -- binary-file
# or
git restore --theirs -- binary-file

git add binary-file
git commit
```

## Abort Merge

```bash
# Abort merge if needed
git merge --abort

# This restores state before merge
```

## Rebase Conflicts

```bash
# During rebase, resolve conflicts
git add resolved-file.txt
git rebase --continue

# Or skip commit
git rebase --skip

# Or abort rebase
git rebase --abort
```

## Best Practices

1. Communicate: คุยกับ team members เกี่ยวกับ conflicts
2. Understand Context: เข้าใจทั้งสอง sides ก่อน resolve
3. Test: Test หลัง resolve conflicts
4. Ask for Help: ถ้าไม่แน่ใจ ขอความช่วยเหลือ
5. Document: Document การตัดสินใจสำคัญ
6. Prevent: Pull บ่อยๆ เพื่อลด conflicts

## Common Issues

### Too Many Conflicts

```bash
# Abort merge
git merge --abort

# Pull latest changes
git pull origin main

# Try merge again
git merge feature-branch
```

### Conflict Markers Not Removed

```bash
# Check for remaining markers
git grep "<<<<<<<"

# Remove all markers
git restore --ours -- conflicted-file.txt
# or manually edit
```

### Merge Commit Not Created

```bash
# If merge is already complete
# Check status
git status

# May need to commit manually
git commit
```

### Rebase Conflicts Loop

```bash
# If conflicts keep occurring
# Abort rebase
git rebase --abort

# Try merge instead
git merge feature-branch
```

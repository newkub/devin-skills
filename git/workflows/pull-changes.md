# Pull Changes

## Description

Pull changes จาก remote repository

## Steps

### 1. Check Status

```bash
# Check current status
git status

# Check remote branches
git branch -r
```

### 2. Fetch Changes

```bash
# Fetch all remotes
git fetch --all

# Fetch specific remote
git fetch origin

# Fetch specific branch
git fetch origin main
```

### 3. Pull Changes

```bash
# Pull current branch
git pull origin main

# Pull with rebase
git pull --rebase origin main

# Pull all branches
git pull --all
```

### 4. Resolve Conflicts (if any)

```bash
# If conflicts occur, resolve them
# Edit conflicted files
git add resolved-file.txt
git commit
```

### 5. Verify Pull

```bash
# Check status
git status

# View pulled changes
git log
```

## Advanced Options

### Pull with Rebase

```bash
# Pull with rebase (linear history)
git pull --rebase origin main

# Configure default rebase
git config --global pull.rebase true
```

### Pull Specific Branch

```bash
# Pull specific branch
git pull origin feature-branch

# Pull and merge to current branch
git pull origin feature-branch:main
```

### Pull with Strategy

```bash
# Pull with specific strategy
git pull -X theirs origin main
git pull -X ours origin main
```

## Best Practices

1. **Pull Before Work**: Pull ก่อนเริ่มทำงาน
2. **Review Changes**: Review changes หลัง pull
3. **Resolve Conflicts**: Resolve conflicts อย่างระมัดระวัง
4. **Test After Pull**: Test หลัง pull
5. **Use Rebase**: ใช้ rebase สำหรับ clean history

## Common Issues

### Merge Conflicts

```bash
# Resolve conflicts manually
# Edit conflicted files
git add resolved-file.txt
git commit

# Or abort
git merge --abort
```

### Rebase Conflicts

```bash
# Resolve conflicts
git add resolved-file.txt
git rebase --continue

# Or abort
git rebase --abort
```

### Diverged Branches

```bash
# Reset to remote
git reset --hard origin/main

# Or merge
git merge origin/main
```

### Authentication Failed

```bash
# Configure credentials
git config --global credential.helper manager-core

# Or use SSH
git remote set-url origin git@github.com:user/repo.git
```

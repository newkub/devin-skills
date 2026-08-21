# Checkout Guide

## วัตถุประสงค์

เรียนรู้วิธีใช้ checkout (และคำสั่งใหม่ switch/restore) เพื่อ switch branches และ restore files

## เมื่อใช้ Checkout

- Switch ระหว่าง branches
- Discard local changes
- Restore files จาก commits ก่อนหน้า
- Create new branches

## ขั้นตอนพื้นฐาน

### 1. Switch Branches

```bash
# Old way
git checkout main

# New way (recommended)
git switch main
```

### 2. Create New Branch

```bash
# Old way
git checkout -b feature-branch

# New way (recommended)
git switch -c feature-branch
```

### 3. Restore Files

```bash
# Old way
git checkout -- path/to/file

# New way (recommended)
git restore path/to/file
```

### 4. Restore from Commit

```bash
# Old way
git checkout <commit-hash> -- path/to/file

# New way (recommended)
git restore --source <commit-hash> path/to/file
```

## Use Cases

### Switch Branches

```bash
# ดู branches ทั้งหมด
git branch

# Switch ไป main
git switch main

# Switch ไป feature branch
git switch feature-branch
```

### Create Branch

```bash
# Create และ switch ไป branch ใหม่
git switch -c feature-branch

# Create branch จาก current commit
git switch -c feature-branch HEAD

# Create branch จาก specific commit
git switch -c feature-branch <commit-hash>
```

### Discard Local Changes

```bash
# Discard specific file
git restore path/to/file

# Discard ทุก files
git restore .

# Discard ทุก files ใน directory
git restore path/to/directory/
```

### Restore from History

```bash
# Restore file จาก HEAD
git restore --source HEAD path/to/file

# Restore file จาก commit ก่อนหน้า
git restore --source HEAD~1 path/to/file

# Restore file จาก specific commit
git restore --source <commit-hash> path/to/file
```

## Best Practices

- **Use New Commands**: ใช้ `switch` และ `restore` แทน `checkout`
- **Check Status**: ตรวจสอบ status ก่อน discard changes
- **Stash First**: stash changes ก่อนถ้าต้องการ keep
- **Branch Name**: ใช้ branch names ที่ descriptive
- **Detached HEAD**: ระวัง detached HEAD state

## Checkout vs Switch vs Restore

| Operation | Old Command | New Command | Purpose |
|-----------|-------------|-------------|---------|
| Switch Branch | `git checkout branch` | `git switch branch` | Change branches |
| Create Branch | `git checkout -b branch` | `git switch -c branch` | Create & switch |
| Restore File | `git checkout -- file` | `git restore file` | Discard changes |
| Restore from Commit | `git checkout commit -- file` | `git restore -s commit file` | Restore from history |

## ตัวอย่าง Workflow

### Feature Branch Workflow

```bash
# 1. Start จาก main
git switch main
git pull

# 2. Create feature branch
git switch -c feature/new-ui

# 3. Work on feature
# edit files...
git add .
git commit -m "Add new UI"

# 4. Switch กลับ main
git switch main

# 5. Pull latest
git pull

# 6. Merge feature
git merge feature-new-ui

# 7. Delete feature branch
git branch -d feature-new-ui
```

### Discard Changes Workflow

```bash
# 1. Check status
git status

# 2. Stash ถ้าไม่แน่ใจ
git stash push -m "Backup"

# 3. Discard changes
git restore .

# 4. ถ้าต้องการ restore
git stash pop
```

### Restore from History

```bash
# 1. ดู history
git log --oneline

# 2. Restore file จาก commit ก่อนหน้า
git restore --source HEAD~1 path/to/file

# 3. Commit restored file
git add path/to/file
git commit -m "Restore file from previous commit"
```

## Detached HEAD

### What is Detached HEAD?

Detached HEAD เป็น state ที่คุณ checkout ไปยัง commit โดยไม่ใช้ branch

```bash
# Checkout specific commit
git checkout <commit-hash>

# หรือ
git switch --detach <commit-hash>
```

### Working with Detached HEAD

```bash
# Checkout commit
git checkout <commit-hash>

# Work...
# edit files...

# Create branch จาก current state
git switch -c new-branch
```

### Recovery from Detached HEAD

```bash
# ดู reflog
git reflog

# Reset กลับไป branch
git switch main
```

## Advanced Usage

### Checkout Remote Branch

```bash
# Checkout remote branch
git switch origin/main

# Create local branch จาก remote
git switch -c local-branch origin/main
```

### Checkout with Create

```bash
# Create branch พร้อม tracking remote
git switch -c feature-branch origin/feature-branch
```

### Restore Staged Files

```bash
# Restore staged file ไปยัง HEAD state
git restore --staged path/to/file

# Restore ทุก staged files
git restore --staged .
```

## Troubleshooting

### Cannot Switch Branch

```bash
# มี uncommitted changes
git status

# Stash changes
git stash push -m "Switch branch"

# Switch branch
git switch main

# Restore changes
git stash pop
```

### File Not Found

```bash
# File ถูก delete ใน current branch
git restore --source HEAD~1 path/to/file
```

## References

- `key-concepts/checkout.md` - แนวคิดพื้นฐาน

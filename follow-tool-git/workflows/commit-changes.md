# Commit Changes

## Description

Commit changes to the repository

## Steps

### 1. Check Status

```bash
# View current status
git status

# View changes
git diff
```

### 2. Stage Changes

```bash
# Stage all changes
git add .

# Stage specific file
git add filename.txt

# Stage multiple files
git add file1.txt file2.txt

# Stage by pattern
git add *.js

# Interactive staging
git add -i

# Patch staging
git add -p filename.txt
```

### 3. Review Staged Changes

```bash
# View staged changes
git diff --staged

# View staged changes for specific file
git diff --staged filename.txt
```

### 4. Commit

```bash
# Simple commit
git commit -m "Add feature"

# Commit with detailed message
git commit -m "Add feature

Detailed description of the feature
and why it was added."

# Commit with all staged files
git commit -m "Update feature"

# Commit without staging
git commit -am "Quick fix"
```

### 5. Verify Commit

```bash
# View last commit
git log -1

# View commit with diff
git show HEAD

# View commit stats
git log --stat
```

## Advanced Options

### Amend Last Commit

```bash
# Amend last commit message
git commit --amend -m "New message"

# Amend last commit with new changes
git add new-file.txt
git commit --amend --no-edit
```

### Empty Commit

```bash
# Create empty commit
git commit --allow-empty -m "Trigger CI"

# Empty commit with date
git commit --allow-empty --date="2024-01-01" -m "Backdated commit"
```

### Sign Commit

```bash
# Sign commit with GPG
git commit -S -m "Signed commit"

# Configure GPG signing
git config --global commit.gpgsign true
```

## Best Practices

1. Atomic Commits: each commit does one thing
2. Meaningful Messages: use conventional commit format
3. Review Before Commit: check changes before committing
4. Test Before Commit: verify tests pass
5. Stage Selectively: stage only what's needed

## Common Issues

### Nothing to Commit

```bash
# Check if there are changes
git status

# Check if files are ignored
cat .gitignore
```

### Pre-commit Hook Failed

```bash
# Bypass hook (not recommended)
git commit --no-verify -m "Bypass hook"

# Or fix the issue
# Run linter/tests manually
```

### Commit Message Too Long

```bash
# Use multi-line message
git commit -m "Add feature

Detailed description here..."
```

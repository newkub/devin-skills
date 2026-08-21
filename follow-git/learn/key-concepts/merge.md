# Merge

## Definition

Merge คือการรวม branches เข้าด้วยกัน:
- รวมการเปลี่ยนแปลงจากหลาย branches
- อาจเกิด conflicts ถ้าแก้ไขไฟล์เดียวกัน
- ต้อง resolve conflicts ก่อน merge เสร็จ
- มีหลาย strategy: merge commit, squash, rebase

## Merge Types

### Fast-Forward Merge
- Linear history
- ไม่มี merge commit
- ใช้เมื่อไม่มี divergence
- Clean history

### 3-Way Merge
- มี merge commit
- ใช้เมื่อมี divergence
- Preserve history
- Common scenario

### Squash Merge
- Compress commits เป็น commit เดียว
- Clean history
- Good for feature branches
- Lose individual commit history

### Rebase Merge
- Rewrite history
- Linear commits
- Avoid merge commits
- Advanced usage

## Basic Merge

```bash
# Switch to target branch
git checkout main

# Merge feature branch
git merge feature-branch

# Push to remote
git push origin main
```

## Merge Strategies

```bash
# Fast-forward only
git merge --ff-only feature-branch

# Always create merge commit
git merge --no-ff feature-branch

# Squash commits
git merge --squash feature-branch
git commit -m "Feature description"
```

## Handling Conflicts

```bash
# When conflict occurs, Git marks conflicts:
<<<<<<< HEAD
Current branch content
=======
Incoming branch content
>>>>>>> feature-branch

# Resolve conflicts manually
# Edit files to resolve conflicts

# Stage resolved files
git add resolved-file.txt

# Continue merge
git commit

# Abort merge
git merge --abort
```

## Merge Tools

```bash
# Use configured merge tool
git mergetool

# Set merge tool
git config --global merge.tool vscode
```

## Best Practices

- Review changes ก่อน merge
- Resolve conflicts อย่างระมัดระวัง
- Test หลัง merge
- ไม่ merge broken code
- ใช้ meaningful commit messages
- Delete branch หลัง merge
- ใช้ pull requests สำหรับ review

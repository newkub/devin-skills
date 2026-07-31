# HEAD

## Definition

HEAD คือ pointer ที่ชี้ไปยัง commit ปัจจุบัน:
- บอกว่าคุณอยู่ที่ branch ไหน
- ใช้สำหรับ navigation ระหว่าง commits
- สามารถ move ไปยัง commit ใดก็ได้ (detached HEAD)
- Reference ไปยัง current branch tip

## HEAD States

### Normal HEAD
- ชี้ไปยัง branch reference
- เช่น: HEAD → main → commit abc123
- สถานะปกติเมื่อทำงาน

### Detached HEAD
- ชี้ไปยัง commit โดยตรง
- ไม่อยู่บน branch ใดๆ
- เกิดเมื่อ checkout commit โดยตรง
- ควรสร้าง branch ใหม่ถ้าต้องการ keep changes

## Viewing HEAD

```bash
# View current HEAD
git log -1

# View HEAD reference
cat .git/HEAD

# View what HEAD points to
git symbolic-ref HEAD
```

## Moving HEAD

```bash
# Move HEAD to previous commit
git reset --hard HEAD~1

# Move HEAD to specific commit
git reset --hard abc123

# Move HEAD without changing files
git reset --soft abc123
```

## Detached HEAD

```bash
# Checkout specific commit (detached HEAD)
git checkout abc123

# Create branch from detached HEAD
git checkout -b new-branch

# Or
git switch -c new-branch
```

## HEAD Relative References

```bash
# Previous commit
HEAD~1
HEAD^

# 5 commits back
HEAD~5

# Parent of merge commit
HEAD^1  # first parent
HEAD^2  # second parent
```

## HEAD in Commands

```bash
# Show HEAD
git show HEAD

# Diff with HEAD
git diff HEAD

# Reset to HEAD
git reset --hard HEAD

# Revert HEAD
git revert HEAD
```

## Best Practices

- อยู่บน branch เสมอเมื่อทำงาน
- สร้าง branch จาก detached HEAD ถ้าต้องการ keep changes
- ใช้ HEAD~ references สำหรับ navigation
- ระมัดระวังเมื่อ reset HEAD
- Commit ก่อน move HEAD

# Reset Guide

## วัตถุประสงค์

เรียนรู้วิธีใช้ reset เพื่อ undo commits, unstage changes, และ discard local changes

## เมื่อใช้ Reset

- Undo commits ที่ยังไม่ได้ push
- Unstage changes
- Discard local changes
- Sync branch กับ remote

## ขั้นตอนพื้นฐาน

### 1. Soft Reset

```bash
# Undo commit แต่ keep changes staged
git reset --soft HEAD~1

# Undo 2 commits
git reset --soft HEAD~2
```

### 2. Mixed Reset (Default)

```bash
# Unstage changes
git reset HEAD

# Undo commit และ unstage changes
git reset HEAD~1

# Reset specific file
git reset HEAD path/to/file
```

### 3. Hard Reset

```bash
# Discard local changes และ reset ไปยัง HEAD
git reset --hard HEAD

# Reset ไปยัง commit ก่อนหน้า
git reset --hard HEAD~1

# Reset ไปยัง specific commit
git reset --hard <commit-hash>
```

## Use Cases

### Undo Commit แต่ Keep Changes

```bash
# Commit ผิด
git commit -m "Wrong message"

# Undo commit แต่ keep changes staged
git reset --soft HEAD~1

# Commit ใหม่ พร้อม message ที่ถูก
git commit -m "Correct message"
```

### Unstage Changes

```bash
# Stage files
git add .

# เปลี่ยนใจ ไม่อยาก commit บาง files
git reset HEAD path/to/file

# หรือ unstage ทั้งหมด
git reset HEAD
```

### Discard Local Changes

```bash
# มี local changes ที่ไม่ต้องการ
git status

# Discard ทั้งหมด
git reset --hard HEAD

# Discard specific file
git checkout -- path/to/file
# หรือ
git restore path/to/file
```

### Sync Branch กับ Remote

```bash
# Local branch ต่างจาก remote
git status

# Reset ไปยัง remote
git reset --hard origin/main
```

## Best Practices

- **Check Status**: ตรวจสอบ status ก่อน reset
- **Soft for Edit**: ใช้ --soft ถ้าต้องการ edit commit
- **Mixed for Unstage**: ใช้ default ถ้าต้องการ unstage
- **Hard with Caution**: ใช้ --hard เฉพาะเมื่อแน่ใจ
- **Reflog Backup**: ตรวจสอบ reflog ก่อน hard reset
- **No Public**: ห้ามใช้ reset บน shared branches

## Reset Modes Comparison

| Mode | HEAD | Index | Working Directory | Use Case |
|------|------|-------|-------------------|----------|
| --soft | ✓ | ✗ | ✗ | Edit commit message |
| --mixed | ✓ | ✓ | ✗ | Unstage changes |
| --hard | ✓ | ✓ | ✓ | Discard changes |

## ตัวอย่าง Workflow

### Fix Commit Message

```bash
# Commit ผิด
git commit -m "typo in message"

# Undo commit
git reset --soft HEAD~1

# Commit ใหม่
git commit -m "Correct message"
```

### Split Commit

```bash
# Commit ใหญ่
git commit -m "Big changes"

# Undo commit
git reset --soft HEAD~1

# Stage บางส่วน
git add file1.js
git commit -m "Add file1"

# Stage ส่วนที่เหลือ
git add file2.js
git commit -m "Add file2"
```

### Clean Working Directory

```bash
# มี changes ที่ไม่ต้องการ
git status

# Stash ก่อน (ถ้าไม่แน่ใจ)
git stash push -m "Backup before reset"

# Hard reset
git reset --hard HEAD

# ถ้าต้องการ restore
git stash pop
```

## Recovery

### กู้คืนจาก Reset ผิด

```bash
# ดู reflog
git reflog

# ดู state ก่อนหน้า
git show HEAD@{1}

# Reset กลับไป
git reset --hard HEAD@{1}
```

### Recover Lost Commits

```bash
# ดู reflog
git reflog

# Find commit hash
git reflog | grep "commit"

# Checkout ไปยัง commit
git checkout <commit-hash>

# Create branch
git checkout -b recovery-branch
```

## Reset vs Revert

```bash
# Reset - rewrite history (local only)
git reset --hard HEAD~1

# Revert - preserve history (safe for public)
git revert HEAD~1
```

## References

- `key-concepts/reset.md` - แนวคิดพื้นฐาน

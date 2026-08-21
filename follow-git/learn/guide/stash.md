# Stash Guide

## วัตถุประสงค์

เรียนรู้วิธีใช้ stash เพื่อบันทึก changes ชั่วคราวและ switch context ได้อย่างรวดเร็ว

## เมื่อใช้ Stash

- ต้อง switch branches แต่มี uncommitted changes
- ต้อง pull changes แต่มี conflicts ใน working directory
- ต้องทดสอบ fix ชั่วคราวแต่ไม่อยาก commit
- ต้อง clean working directory สำหรับ operations บางอย่าง

## ขั้นตอนพื้นฐาน

### 1. Stash Changes

```bash
# Stash current changes
git stash push -m "Work in progress on feature X"

# Stash รวม untracked files
git stash push -u -m "Include new files"

# Stash รวม ignored files
git stash push -a -m "Complete stash"
```

### 2. List Stashes

```bash
# List all stashes
git stash list

# Output:
# stash@{0}: On main: Work in progress on feature X
# stash@{1}: On develop: WIP bug fix
```

### 3. Apply Stash

```bash
# Apply stash แต่ keep ไว้ใน stack
git stash apply stash@{0}

# Apply stash และลบจาก stack
git stash pop stash@{0}

# Apply stash ล่าสุด
git stash pop
```

### 4. View Stash

```bash
# Show summary
git stash show stash@{0}

# Show detailed diff
git stash show -p stash@{0}
```

### 5. Drop Stash

```bash
# Drop specific stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

## Use Cases

### Switch Branches พร้อม Uncommitted Changes

```bash
# มี changes ที่ยังไม่ commit
git status

# Stash changes
git stash push -m "Switching to fix urgent bug"

# Switch branch
git checkout urgent-fix

# แก้ bug...

# Switch กลับ
git checkout feature-branch

# Restore changes
git stash pop
```

### Pull พร้อม Local Changes

```bash
# มี local changes
git status

# Stash changes
git stash push -m "Pulling latest changes"

# Pull
git pull origin main

# Restore changes
git stash pop

# แก้ conflicts ถ้ามี
```

### Test Temporary Fix

```bash
# ทดสอบ fix ชั่วคราว
# edit files...

# Stash
git stash push -m "Test fix attempt"

# Test...

# ถ้าไม่ work
git stash drop

# ถ้า work
git stash pop
git commit -m "Fix: resolve issue"
```

## Best Practices

- **Always Message**: ใส่ message ที่ชัดเจนเสมอ
- **List First**: ตรวจสอบ stash list ก่อน pop
- **Apply vs Pop**: ใช้ apply ถ้าต้องการ keep stash
- **Clean Up**: ลบ stashes เก่าๆ เป็นประจำ
- **Branch Context**: stash จำ branch ที่สร้างไว้

## Advanced Usage

### Stash Specific Files

```bash
# Stash specific file
git stash push path/to/file

# Stash multiple files
git stash push path/to/file1 path/to/file2
```

### Stash with Index

```bash
# Stash รวม staged changes
git stash push -k -m "Keep staged changes"
```

### Branch from Stash

```bash
# Create branch จาก stash
git stash branch new-branch stash@{0}
```

## ตัวอย่าง Workflow

```bash
# 1. Working on feature
git checkout feature-branch
# edit files...

# 2. Urgent bug มา
git stash push -m "WIP feature - urgent bug came in"

# 3. Fix bug
git checkout main
# edit...
git commit -m "Fix: urgent bug"
git push

# 4. กลับไป feature
git checkout feature-branch
git stash pop

# 5. Continue work
# edit...
git commit -m "Add new feature"
```

## Troubleshooting

### Stash Apply Failed

```bash
# ถ้า apply ล้มเหลวเพราะ conflicts
git stash apply stash@{0}

# แก้ conflicts
git add .
git stash drop stash@{0}
```

### Lost Stash

```bash
# ถ้าลบ stash โดยไม่ตั้งใจ
git fsck --no-reflog | awk '/dangling commit/ {print $3}'

# ดู commit
git show <commit-hash>

# Create stash ใหม่
git stash apply <commit-hash>
```

## References

- `key-concepts/stash.md` - แนวคิดพื้นฐาน

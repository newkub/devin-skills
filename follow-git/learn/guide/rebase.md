# Rebase Guide

## วัตถุประสงค์

เรียนรู้วิธีใช้ rebase เพื่อ maintain commit history ที่ clean และ linear

## เมื่อใช้ Rebase

- Keep feature branches up-to-date กับ main branch
- Clean up commit history ก่อน merge
- Squash multiple commits ให้เป็น commit เดียว
- Reorder commits ให้ logical

## ขั้นตอนพื้นฐาน

### 1. Rebase แบบง่าย

```bash
# เปลี่ยน branch ปัจจุบันไปยัง base ใหม่
git rebase main
```

### 2. Interactive Rebase

```bash
# Rebase พร้อม edit commits
git rebase -i main~3  # rebase 3 commits ล่าสุด
```

Editor จะเปิดขึ้นมาพร้อม options:

```
pick abc1234 Commit message 1
pick def5678 Commit message 2
pick ghi9012 Commit message 3
```

**Options:**
- `pick` - keep commit ไว้
- `reword` - edit commit message
- `edit` - pause เพื่อ modify commit
- `squash` - merge กับ commit ก่อนหน้า
- `fixup` - merge กับ commit ก่อนหน้า (ไม่เก็บ message)
- `drop` - ลบ commit

### 3. แก้ Conflicts ระหว่าง Rebase

```bash
# เมื่อเกิด conflict
git rebase --continue  # หลังแก้ conflict
git rebase --abort     # ยกเลิก rebase
git rebase --skip      # skip commit ปัจจุบัน
```

## Use Cases

### Keep Feature Branch Updated

```bash
# อยู่บน feature branch
git checkout feature-branch
git fetch origin
git rebase origin/main
```

### Squash Commits

```bash
# Interactive rebase 3 commits ล่าสุด
git rebase -i HEAD~3

# เปลี่ยน pick เป็น squash สำหรับ commits ที่ต้องการ merge
```

### Reorder Commits

```bash
# Interactive rebase
git rebase -i HEAD~5

# เปลี่ยนลำดับโดย swap lines
```

### Clean Up History ก่อน Merge

```bash
# Squash WIP commits
git rebase -i origin/main

# แก้ commit messages
# reorder commits
# แล้ว push
git push --force-with-lease
```

## Best Practices

- **เฉพาะ Local**: ใช้ rebase เฉพาะบน branches ที่ยังไม่ได้ push
- **Force with Lease**: ใช้ `--force-with-lease` แทน `--force`
- **Backup**: stash หรือ branch backup ก่อน rebase
- **Test**: test code หลัง rebase เสมอ
- **Team Communication**: แจ้ง team ถ้าจะ rebase shared branch

## Rebase vs Merge

```bash
# Merge - preserve history
git checkout main
git merge feature-branch

# Rebase - linear history
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch
```

## ตัวอย่าง Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-ui

# 2. Make commits
git add .
git commit -m "Add button component"
git add .
git commit -m "Add button styles"
git add .
git commit -m "Fix button hover"

# 3. Update จาก main
git fetch origin
git rebase origin/main

# 4. Squash commits
git rebase -i origin/main
# เปลี่ยน pick -> squash สำหรับ commits 2 และ 3

# 5. Push
git push --force-with-lease origin feature/new-ui
```

## Troubleshooting

### Rebase Failed

```bash
# ดูสถานะ
git status

# แก้ conflicts
# edit files
git add .
git rebase --continue
```

### กู้คืนจาก Rebase ผิด

```bash
# ดู reflog
git reflog

# Reset กลับไป
git reset --hard HEAD@{1}
```

## References

- `key-concepts/rebase.md` - แนวคิดพื้นฐาน
- `workflows/merge-branches.md` - merge strategies

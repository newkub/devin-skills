# Reset

## แนวคิด

Reset เป็นการย้าย current branch ไปยัง commit ใดๆ โดยสามารถเลือกว่าจะ reset index และ working directory ด้วยหรือไม่

## โหมดของ Reset

### Soft Reset (--soft)
- Reset HEAD ไปยัง target commit
- Keep index และ working directory ไว้
- Changes ยังอยู่ใน staging area

```bash
git reset --soft HEAD~1
```

**ใช้เมื่อ**: ต้องการ undo commit แต่ keep changes ไว้ใน staging

### Mixed Reset (default)
- Reset HEAD และ index ไปยัง target commit
- Keep working directory ไว้
- Changes ย้ายไป unstaged

```bash
git reset HEAD~1
# หรือ
git reset --mixed HEAD~1
```

**ใช้เมื่อ**: ต้องการ unstage changes แต่ keep working directory

### Hard Reset (--hard)
- Reset HEAD, index, และ working directory ไปยัง target commit
- **ข้อมูลจะหายไป** (ยกเว้นถ้ามี stash หรือ reflog)

```bash
git reset --hard HEAD~1
```

**ใช้เมื่อ**: ต้องการ discard changes ทั้งหมด

## ข้อดี

- **Flexible**: 3 modes สำหรับ use cases ต่างกัน
- **Powerful**: สามารถ undo commits ได้
- **Clean**: สามารถ clean working directory ได้

## ข้อเสีย

- **Destructive**: Hard reset สามารถทำลาย data
- **Rewrite History**: เปลี่ยน commit history
- **Recovery**: กู้คืนยากถ้าไม่มี reflog

## เมื่อใช้

- Undo commits ที่ยังไม่ได้ push
- Unstage changes
- Discard local changes
- Sync branch กับ remote

## เมื่อไม่ควรใช้

- ห้ามใช้กับ commits ที่ถูก push แล้ว
- ห้ามใช้ hard reset โดยไม่แน่ใจ
- ห้ามใช้บน shared branches

## Commands

```bash
# Reset HEAD ไปยัง commit ก่อนหน้า (keep changes staged)
git reset --soft HEAD~1

# Reset HEAD และ index (unstage changes)
git reset HEAD~1

# Reset HEAD, index, และ working directory (discard changes)
git reset --hard HEAD~1

# Reset ไปยัง specific commit
git reset --hard <commit-hash>

# Reset specific file
git reset HEAD path/to/file

# Reset ไปยัง remote branch
git reset --hard origin/main

# Show reflog (สำหรับ recovery)
git reflog

# Recover จาก reset ผิด
git reset --hard HEAD@{1}
```

## Reset vs Revert

| Feature | Reset | Revert |
|---------|-------|--------|
| History | Rewrites | Preserves |
| Safety | Destructive | Safe |
| Public Branch | No | Yes |
| Single Commit | Yes | Yes |
| Multiple Commits | Yes | One by one |

## Best Practices

- ใช้ `--soft` ถ้าต้องการ modify commit message
- ใช้ `--mixed` (default) ถ้าต้องการ unstage
- ใช้ `--hard` เฉพาะเมื่อแน่ใจ 100%
- ตรวจสอบ reflog ก่อน hard reset
- ไม่ใช้ reset บน shared branches
- ใช้ revert แทน reset สำหรับ public history

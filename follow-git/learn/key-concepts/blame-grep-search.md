# Blame, Grep, and Search

## แนวคิด

Git มี tools สำหรับ search และ trace ประวัติของ code:
- **Blame**: ดูว่าใครแก้ไขแต่ละบรรทัดและเมื่อไร
- **Grep**: search patterns ใน tracked files
- **Search**: search ใน commit history

## Blame

### วิธีการทำงาน

Blame แสดงประวัติของแต่ละบรรทัดใน file รวมถึง:
- Commit hash
- Author
- Date
- Commit message

### Commands

```bash
# Blame file
git blame file.js

# Blame พร้อม line numbers
git blame -L 10,20 file.js

# Blame พร้อม email
git blame -e file.js

# Blame พร้อม whitespace ละเว้น
git blame -w file.js

# Blame พร้อม ignore changes ที่เป็น whitespace
git blame -w -M file.js
```

## Grep

### วิธีการทำงาน

Grep search patterns ใน tracked files ใน working directory หรือใน commit history

### Commands

```bash
# Search pattern ใน working directory
git grep "function"

# Search ใน specific file
git grep "function" file.js

# Search พร้อม line numbers
git grep -n "function"

# Search พร้อม context
git grep -C 3 "function"

# Search พร้อม file names
git grep -l "function"

# Search ใน commit history
git grep "function" HEAD~10

# Search พร้อม regex
git grep -e "function|class"
```

## Search History

### Commands

```bash
# Search commit messages
git log --grep="bug"

# Search ใน commits
git log -S"function" --oneline

# Search ใน diffs
git log -G"function" --oneline

# Search author
git log --author="John"

# Search ระหว่าง dates
git log --since="2024-01-01" --until="2024-12-31"
```

## Use Cases

### Blame

- ดูว่าใครแก้ไข bug
- ดูประวัติของ code ที่ซับซ้อน
- ดูว่าทำไม code ถูกเขียนแบบนี้
- Code review

### Grep

- Search function definitions
- Search variable names
- Search TODO comments
- Search deprecated code

### Search History

- หา commit ที่แก้ bug
- หา commit ที่เพิ่ม feature
- หา commit ที่ลบ code
- Debug ประวัติ

## Best Practices

- ใช้ blame เพื่อ understand context
- ใช้ grep สำหรับ quick search
- ใช้ log search สำหรับ history
- ใช้ options ที่เหมาะสมกับ use case

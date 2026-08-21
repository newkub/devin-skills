# Staging Area

## Definition

Staging area (index) คือพื้นที่ระหว่าง working directory และ repository:
- เลือกไฟล์ที่จะ commit
- Review การเปลี่ยนแปลงก่อน commit
- สามารถ unstage ได้
- ใช้ `git add` เพื่อ stage ไฟล์

## Git States

```
Working Directory → Staging Area → Repository
    (modified)         (staged)        (committed)
```

## Staging Files

```bash
# Stage all changes
git add .

# Stage specific file
git add filename.txt

# Stage multiple files
git add file1.txt file2.txt

# Stage by pattern
git add *.js

# Stage directory
git add src/
```

## Interactive Staging

```bash
# Interactive staging
git add -i

# Patch staging (select parts of file)
git add -p filename.txt

# Edit patch manually
git add -e filename.txt
```

## Viewing Staged Changes

```bash
# View staged changes
git diff --staged

# View staged changes for specific file
git diff --staged filename.txt

# View staged vs working
git diff
```

## Unstaging Files

```bash
# Unstage all files
git reset HEAD

# Unstage specific file
git reset HEAD filename.txt

# Unstage and discard changes
git checkout -- filename.txt

# Restore file from staging
git restore --staged filename.txt
```

## Staging Best Practices

- Stage และ commit บ่อยๆ
- Review staged changes ก่อน commit
- Stage เฉพาะที่จำเป็น
- ใช้ interactive staging สำหรับ complex changes
- ไม่ stage ไฟล์ที่ไม่เกี่ยวข้อง
- ใช้ `.gitignore` เพื่อ exclude ไฟล์

## Common Workflows

### Stage All
```bash
git add .
git commit -m "Update feature"
```

### Stage Specific
```bash
git add important-file.txt
git commit -m "Fix important file"
```

### Interactive
```bash
git add -p
# Select changes to stage
git commit -m "Partial update"
```

### Patch Mode
```bash
git add -p filename.txt
# Select specific hunks
git commit -m "Fix specific part"
```

# Checkout

## แนวคิด

Checkout เป็นการ switch ระหว่าง branches หรือ restore working tree files จาก commits หรือ index

## ประเภทของ Checkout

### Switch Branches
Switch ไปยัง branch อื่นและ update working directory

```bash
git checkout feature-branch
# หรือใช้คำสั่งใหม่
git switch feature-branch
```

### Restore Files
Restore files จาก commits หรือ index

```bash
# Restore file จาก HEAD
git checkout -- path/to/file

# Restore file จาก specific commit
git checkout <commit-hash> -- path/to/file

# Restore file จาก index (unstage changes)
git checkout HEAD -- path/to/file

# หรือใช้คำสั่งใหม่
git restore path/to/file
git restore --source <commit-hash> path/to/file
```

### Create New Branch
Create และ switch ไปยัง branch ใหม่

```bash
git checkout -b new-branch
# หรือใช้คำสั่งใหม่
git switch -c new-branch
```

### Detached HEAD
Checkout ไปยัง commit โดยไม่ใช้ branch

```bash
git checkout <commit-hash>
```

## ข้อดี

- **Flexible**: สามารถ switch branches หรือ restore files
- **Quick**: เปลี่ยน context ได้รวดเร็ว
- **Safe**: สามารถ discard local changes ได้

## ข้อเสีย

- **Confusing**: คำสั่งมีหลาย meanings
- **Destructive**: สามารถ overwrite changes โดยไม่ warning
- **Deprecated**: Git แนะนำให้ใช้ `switch` และ `restore` แทน

## เมื่อใช้

- Switch ระหว่าง branches
- Discard local changes
- Restore files จาก commits ก่อนหน้า
- Create new branches

## เมื่อไม่ควรใช้

- ถ้ามี uncommitted changes ที่ต้องการ keep
- ถ้าไม่แน่ใจว่าจะ discard changes

## Commands

```bash
# Switch ไปยัง branch
git checkout main
git switch main

# Create และ switch ไปยัง branch ใหม่
git checkout -b feature-branch
git switch -c feature-branch

# Restore file จาก HEAD (discard local changes)
git checkout -- path/to/file
git restore path/to/file

# Restore file จาก specific commit
git checkout <commit-hash> -- path/to/file
git restore --source <commit-hash> path/to/file

# Restore ทุก files จาก HEAD
git checkout .
git restore .

# Checkout ไปยัง specific commit (detached HEAD)
git checkout <commit-hash>

# Checkout ไปยัง remote branch
git checkout origin/main
git switch origin/main

# Create branch จาก remote branch
git checkout -b local-branch origin/main
git switch -c local-branch origin/main
```

## Checkout vs Switch vs Restore

| Operation | Old Command | New Command | Purpose |
|-----------|-------------|-------------|---------|
| Switch Branch | `git checkout branch` | `git switch branch` | Change branches |
| Create Branch | `git checkout -b branch` | `git switch -c branch` | Create & switch |
| Restore File | `git checkout -- file` | `git restore file` | Discard changes |
| Restore from Commit | `git checkout commit -- file` | `git restore -s commit file` | Restore from history |

## Best Practices

- ใช้ `git switch` แทน `git checkout` สำหรับ switching branches
- ใช้ `git restore` แทน `git checkout --` สำหรับ restoring files
- ตรวจสอบ status ก่อน checkout
- stash changes ก่อนถ้าต้องการ keep
- ระวัง detached HEAD state

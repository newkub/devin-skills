# Worktree

## แนวคิด

Worktree เป็น feature ที่ให้มี multiple working trees ที่ link ไปยัง repository เดียวกัน ใช้สำหรับทำงานหลาย branches พร้อมกันโดยไม่ต้อง clone ซ้ำ

## วิธีการทำงาน

เมื่อใช้ worktree:
1. Create worktree ใหม่ที่ link ไปยัง repository เดียวกัน
2. แต่ละ worktree มี working directory แยกกัน
3. แต่ละ worktree สามารถ checkout branches ต่างกัน
4. Shared object database ระหว่าง worktrees

## ข้อดี

- **No Clone**: ไม่ต้อง clone repository ซ้ำ
- **Parallel Work**: ทำงานหลาย branches พร้อมกัน
- **Disk Efficient**: ใช้ disk space น้อยกว่า clone ซ้ำ
- **Fast Switch**: Switch ระหว่าง worktrees รวดเร็ว

## ข้อเสีย

- **Management**: ต้อง manage multiple worktrees
- **Confusion**: อาจสับสนระหว่าง worktrees
- **Cleanup**: ต้อง clean up worktrees เก่าๆ

## เมื่อใช้

- ทำงานหลาย features พร้อมกัน
- Review PRs ขณะทำงาน feature อื่น
- Test บนหลาย branches พร้อมกัน
- Hotfix ขณะทำงาน feature

## Commands

```bash
# Create worktree สำหรับ branch
git worktree add ../feature-branch feature-branch

# Create worktree พร้อม new branch
git worktree add ../new-feature -b new-feature

# Create worktree จาก specific commit
git worktree add ../temp HEAD~1

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../feature-branch

# Remove worktree หลังลบ directory
git worktree prune

# Move worktree
git worktree move ../feature-branch ../new-location
```

## Worktree Structure

```
project/
├── .git/           # Main repository
├── main/           # Main worktree (default)
├── feature-branch/ # Feature worktree
└── hotfix/         # Hotfix worktree
```

## Best Practices

- ใช้ path ที่ชัดเจนสำหรับ worktrees
- clean up worktrees เก่าๆ เป็นประจำ
- ใช้สำหรับ parallel development
- document worktree locations

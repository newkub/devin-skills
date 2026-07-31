# Tag

## แนวคิด

Tag เป็น reference ที่ชี้ไปยัง commit หรือ object ใดๆ ใน Git history ใช้สำหรับ mark points ที่สำคัญ เช่น releases, milestones

## ประเภทของ Tags

### Lightweight Tags
- เป็น pointer ที่ชี้ไปยัง commit โดยตรง
- เหมือน branch แต่ไม่เคลื่อนที่
- ใช้สำหรับ marking ชั่วคราว

```bash
git tag v1.0.0
```

### Annotated Tags
- เป็น object แยกต่างหากที่มี metadata
- มี tagger name, email, date, และ message
- สามารถ sign ด้วย GPG
- ใช้สำหรับ releases ที่เป็นทางการ

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
```

## ข้อดี

- **Version Management**: mark releases อย่างชัดเจน
- **Immutable**: tags ไม่เปลี่ยนเมื่อ commits ใหม่ถูกเพิ่ม
- **Signed**: สามารถ verify authenticity ด้วย GPG
- **Reference**: ใช้ reference ได้ง่ายๆ แทน commit hash

## ข้อเสีย

- **No Auto-update**: tags ไม่เคลื่อนที่ตาม commits
- **Manual Management**: ต้องสร้างและจัดการเอง
- **Can Be Confusing**: หลาย tags อาจทำให้สับสน

## เมื่อใช้

- Mark releases (v1.0.0, v2.1.3)
- Mark milestones สำคัญ
- Mark hotfix commits
- Mark stable points ใน development

## Commands

```bash
# List all tags
git tag

# List tags พร้อม messages
git tag -n

# Search tags ด้วย pattern
git tag -l "v1.*"

# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Create tag ที่ commit ใดๆ
git tag -a v1.0.0 <commit-hash> -m "Message"

# Show tag details
git show v1.0.0

# Delete local tag
git tag -d v1.0.0

# Push tag ไปยัง remote
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete remote tag
git push origin --delete v1.0.0

# Create signed tag
git tag -s v1.0.0 -m "Signed release"
```

## Tag Naming Conventions

- **Semantic Versioning**: v1.0.0, v2.1.3
- **Date-based**: 2024-01-15, 2024-Q1
- **Milestone**: milestone-1, sprint-5
- **Environment**: prod-v1, staging-v2

## Best Practices

- ใช้ annotated tags สำหรับ releases ที่เป็นทางการ
- ใช้ lightweight tags สำหรับ temporary markers
- push tags ไป remote เสมอ
- ใช้ semantic versioning สำหรับ releases
- sign tags ด้วย GPG สำหรับ security

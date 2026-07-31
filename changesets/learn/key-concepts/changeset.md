# Changeset

ไฟล์ที่บันทึกการเปลี่ยนแปลงใน Changesets

## What is a Changeset?

Changeset คือไฟล์ `.md` ที่บันทึก:
- Packages ที่มีการเปลี่ยนแปลง
- Version bump type (major, minor, patch)
- Changelog message

## File Structure

```markdown
---
"@my-package": minor
"@other-package": patch
---

Add new feature for user authentication
```

## Components

### Frontmatter
กำหนด packages และ bump types:
```yaml
---
"@my-package": minor
"@other-package": patch
---
```

### Body
Changelog message:
```markdown
Add new feature for user authentication
```

## Bump Types

### major
Breaking changes:
```yaml
---
"@my-package": major
---
```

### minor
New features:
```yaml
---
"@my-package": minor
---
```

### patch
Bug fixes:
```yaml
---
"@my-package": patch
---
```

## Location

Changesets ถูกเก็บใน `.changesets/` directory:
```
.changesets/
  ├── cool-feature-abc123.md
  ├── bug-fix-def456.md
  └── breaking-change-ghi789.md
```

## Naming Convention

ชื่อไฟล์เป็น random hash:
- `cool-feature-abc123.md`
- `bug-fix-def456.md`
- `breaking-change-ghi789.md`

## Lifecycle

1. **Created**: สร้างด้วย `bunx changeset`
2. **Committed**: Commit ไปยัง git
3. **Versioned**: ใช้โดย `bunx changeset version`
4. **Deleted**: ลบหลังจาก version

## Best Practices

1. **Create Early**: สร้าง changeset ทันทีหลังจาก commit
2. **Be Specific**: เขียน changelog message ที่ชัดเจน
3. **Choose Right Type**: เลือก bump type ที่ถูกต้อง
4. **One Change Per File**: หนึ่ง changeset ต่อหนึ่ง logical change

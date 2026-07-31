# Best Practices

แนวทางปฏิบัติที่ดีที่สุดสำหรับการใช้ Changesets

## Changeset Creation

### Create Early
สร้าง changeset เมื่อทำการเปลี่ยนแปลง:
- อย่ารอจนกว่าจะ release
- สร้าง changeset ทันทีหลังจาก commit
- ทำให้ tracking ง่ายขึ้น

### Be Specific
เขียน changelog message ที่ชัดเจน:
```markdown
---
"@my-package": minor
---

Add new feature for user authentication
```

### Choose Right Bump Type
เลือก version bump type ที่ถูกต้อง:
- **major**: Breaking changes
- **minor**: New features
- **patch**: Bug fixes

## Versioning

### Version Regularly
Version packages อย่างสม่ำเสมอ:
- ไม่รอจนกว่ามี changesets เยอะ
- Version เป็นรอบ (weekly, bi-weekly)
- ทำให้ releases สม่ำเสมอ

### Review Before Versioning
ตรวจสอบก่อน version:
- ตรวจสอบ changesets
- ตรวจสอบ dependencies
- ทดสอบ locally

### Test Before Publishing
ทดสอบก่อน publish:
- Run tests
- Build packages
- Check changelog

## Monorepo Management

### Use Linked Packages
ใช้ linked packages สำหรับ related packages:
```json
{
  "linked": ["@my/ui", "@my/components"]
}
```

### Use Fixed Packages
ใช้ fixed packages สำหรับ tightly coupled:
```json
{
  "fixed": ["@my/core", "@my/utils"]
}
```

### Handle Internal Dependencies
ตั้งค่า updateInternalDependencies:
```json
{
  "updateInternalDependencies": "patch"
}
```

## CI/CD Integration

### Automate Versioning
ใช้ CI/CD สำหรับ automation:
```yaml
- name: Version Packages
  run: bunx changeset version
```

### Automate Publishing
ใช้ CI/CD สำหรับ publishing:
```yaml
- name: Publish
  run: bunx changeset publish
```

### Use Release PRs
สร้าง release PRs อัตโนมัติ:
- Version ใน PR
- Review changelog
- Merge เพื่อ publish

## Changelog Management

### Review Changelogs
ตรวจสอบ changelog ก่อน publish:
- ตรวจสอบ messages
- ตรวจสอบ formatting
- ตรวจสอบ completeness

### Custom Changelogs
ใช้ custom changelog generators ถ้าจำเป็น:
- Custom templates
- Custom formats
- Custom sections

## Common Pitfalls

### Forgetting Changesets
อย่าลืมสร้าง changesets:
- สร้าง changeset ทันทีหลังจาก commit
- ใช้ pre-commit hooks
- ใช้ CI checks

### Wrong Bump Type
เลือก bump type ที่ถูกต้อง:
- ตรวจสอบ breaking changes
- ตรวจสอบ new features
- ตรวจสอบ bug fixes

### Version Conflicts
หลีกเลี่ยง version conflicts:
- Version packages พร้อมกัน
- ใช้ linked/fixed packages
- ตรวจสอบ dependencies

### Publishing Issues
หลีกเลี่ยง publishing issues:
- Test locally
- Check registry access
- Verify package names

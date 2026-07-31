# Version Bump

การเพิ่ม version number ใน Changesets

## Semver

Changesets ใช้ Semantic Versioning:
- **major**: X.0.0 - Breaking changes
- **minor**: 0.X.0 - New features
- **patch**: 0.0.X - Bug fixes

## Bump Types

### major
ใช้เมื่อมี breaking changes:
```yaml
---
"@my-package": major
---
```

ตัวอย่าง breaking changes:
- Remove API
- Change API signature
- Change behavior significantly

### minor
ใช้เมื่อมี new features:
```yaml
---
"@my-package": minor
---
```

ตัวอย่าง new features:
- Add new API
- Add new functionality
- Add new parameters

### patch
ใช้เมื่อมี bug fixes:
```yaml
---
"@my-package": patch
---
```

ตัวอย่าง bug fixes:
- Fix bugs
- Fix typos
- Minor improvements

## Version Calculation

Changesets คำนวณ version อัตโนมัติ:
1. Aggregate all changesets
2. Determine highest bump type
3. Update package.json

### Example

```yaml
# changeset-1.md
---
"@my-package": minor
---

Add new feature

# changeset-2.md
---
"@my-package": patch
---

Fix bug
```

Result: `@my-package` bump to minor

## Dependencies

### Internal Dependencies
Changesets จัดการ internal dependencies:
```json
{
  "updateInternalDependencies": "patch"
}
```

### External Dependencies
External dependencies ต้องจัดการเอง:
- Manual version updates
- Check compatibility

## Best Practices

1. **Follow Semver**: ทำตาม semver spec
2. **Be Conservative**: ใช้ major เมื่อจำเป็นจริงๆ
3. **Document Breaking Changes**: เขียน changelog ชัดเจน
4. **Test Before Versioning**: ทดสอบก่อน version

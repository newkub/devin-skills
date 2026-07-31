# Monorepo

การใช้ Changesets ใน monorepos

## What is a Monorepo?

Monorepo คือ repository ที่มีหลาย packages:
- Multiple packages ใน repository เดียว
- Shared dependencies
- Coordinated releases

## Changesets for Monorepos

Changesets ออกแบบมาสำหรับ monorepos:
- Track changes ข้าม packages
- Handle dependencies ระหว่าง packages
- Version packages พร้อมกัน

## Workflow

### 1. Create Changeset
```bash
bunx changeset
```
Select packages ที่มีการเปลี่ยนแปลง

### 2. Version Packages
```bash
bunx changeset version
```
Version packages พร้อมกัน

### 3. Publish
```bash
bunx changeset publish
```
Publish packages พร้อมกัน

## Dependency Management

### Internal Dependencies
Changesets จัดการ internal dependencies:
```json
{
  "updateInternalDependencies": "patch"
}
```

### Linked Packages
Version packages พร้อมกัน:
```json
{
  "linked": ["@my/ui", "@my/components"]
}
```

### Fixed Packages
Always version together:
```json
{
  "fixed": ["@my/core", "@my/utils"]
}
```

## Example Structure

```
my-monorepo/
├── packages/
│   ├── core/
│   ├── ui/
│   └── components/
├── .changesets/
│   ├── feature-abc.md
│   └── fix-def.md
└── package.json
```

## Benefits

### Coordinated Releases
- Version packages พร้อมกัน
- Consistent versions
- Easier dependency management

### Shared Changelog
- Single changelog สำหรับทั้ง monorepo
- Consistent documentation
- Easier tracking

### Automated Workflow
- Automated versioning
- Automated publishing
- Reduced manual work

## Best Practices

1. **Use Linked Packages**: สำหรับ related packages
2. **Use Fixed Packages**: สำหรับ tightly coupled
3. **Version Regularly**: Version เป็นรอบ
4. **Test Thoroughly**: Test ทั้ง monorepo ก่อน publish

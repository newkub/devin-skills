# Group Projects

จัดกลุ่ม projects สำหรับ organization

## Principle

จัดกลุ่ม projects สำหรับ organization และ efficiency

## Why Group Projects?

1. **Organization**: จัดกลุ่ม projects ตาม type
2. **Efficiency**: รัน tasks ตาม groups
3. **Clarity**: ทำให้ structure ชัดเจน

## Grouping Strategies

### By Type
```yaml
projects:
  apps:
    - 'apps/*'
  packages:
    - 'packages/*'
  tools:
    - 'tools/*'
```

### By Domain
```yaml
projects:
  frontend:
    - 'apps/web/*'
    - 'apps/mobile/*'
  backend:
    - 'apps/api/*'
  shared:
    - 'packages/*'
```

### By Team
```yaml
projects:
  team-a:
    - 'apps/team-a/*'
    - 'packages/team-a/*'
  team-b:
    - 'apps/team-b/*'
    - 'packages/team-b/*'
```

## Usage

### Run by Group
```bash
bunx moon run build --project apps
```

### Run Multiple Groups
```bash
bunx moon run build --project apps --project packages
```

## Best Practices

1. **Group by Type**: Group ตาม type ของ project
2. **Use Meaningful Names**: ใช้ชื่อที่มีความหมาย
3. **Document**: Document grouping strategy
4. **Review**: Review groups อย่างสม่ำเสมอ

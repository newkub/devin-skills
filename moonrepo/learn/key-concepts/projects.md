# Projects

Projects ใน moonrepo

## What are Projects?

Projects คือ packages ใน monorepo:
- กำหนดใน `moon.yml`
- สามารถ group ได้
- สามารถ filter ได้

## Project Definition

### Basic Definition
```yaml
projects:
  - 'apps/*'
  - 'packages/*'
```

### Group Definition
```yaml
projects:
  apps:
    - 'apps/*'
  packages:
    - 'packages/*'
```

### Filter Definition
```yaml
projects:
  - 'apps/*'
  - 'packages/*'
  - '!packages/internal/*'
```

## Project Types

### Applications
```yaml
projects:
  apps:
    - 'apps/*'
```

### Libraries
```yaml
projects:
  packages:
    - 'packages/*'
```

### Tools
```yaml
projects:
  tools:
    - 'tools/*'
```

## Project Configuration

### Project-Specific Config
สร้าง `.moon/project.yml` ใน project:
```yaml
tasks:
  build:
    command: 'bun run build'
```

### Override Global Config
Override global config locally:
```yaml
tasks:
  build:
    command: 'bun run build:custom'
```

## Best Practices

1. **Group Projects**: Group projects สำหรับ organization
2. **Use Patterns**: ใช้ patterns ที่ชัดเจน
3. **Filter Projects**: Filter projects ที่ไม่ต้องการ
4. **Document**: Document project structure

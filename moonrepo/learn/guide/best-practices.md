# Best Practices

แนวทางปฏิบัติที่ดีสำหรับการใช้งาน moonrepo

## Configuration

### Group Projects
Group projects สำหรับ organization:
```yaml
projects:
  apps:
    - 'apps/*'
  packages:
    - 'packages/*'
```

### Define Inputs
Define inputs สำหรับ smart hashing:
```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'src/**/*'
```

### Define Outputs
Define outputs สำหรับ caching:
```yaml
tasks:
  build:
    command: 'bun run build'
    outputs:
      - 'dist/**/*'
```

## Task Design

### Use Dependencies
ใช้ dependencies สำหรับ task ordering:
```yaml
tasks:
  build:
    command: 'bun run build'
  test:
    command: 'bun test'
    deps:
      - build
```

### Use Parallel Execution
ใช้ parallel execution เมื่อเป็นไปได้:
```yaml
tasks:
  lint:
    command: 'bun run lint'
  format:
    command: 'bun run format'
```

## Performance

### Use Affected
ใช้ --affected เพื่อ efficiency:
```bash
bunx moon run build --affected
```

### Use Caching
เปิด caching เพื่อความเร็ว:
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
```

## Common Pitfalls

### Too Many Projects
หลีกเลี่ยง projects ที่เยอะเกินไป:
- Group projects
- Filter projects
- Use meaningful patterns

### No Inputs/Outputs
อย่าลืม inputs/outputs:
- Define inputs สำหรับ smart hashing
- Define outputs สำหรับ caching
- ปรับปรุง performance

### No Dependencies
อย่าลืม task dependencies:
- Define dependencies สำหรับ ordering
- Use deps อย่างสม่ำเสมอ
- Test task execution order

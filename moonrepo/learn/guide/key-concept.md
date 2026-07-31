# Key Concepts

แนวคิดหลักและหลักการทำงานของ moonrepo

## What is Moonrepo?

Moonrepo เป็น build system สำหรับ monorepos ที่:
- เขียนด้วย Rust (รวดเร็ว)
- มี native toolchain
- มี smart hashing
- มี remote caching

## Core Concepts

### Projects
Projects คือ packages ใน monorepo:
- กำหนดใน `moon.yml`
- สามารถ group ได้
- สามารถ filter ได้

### Tasks
Tasks คือ commands ที่รันใน projects:
- กำหนดใน `moon.yml`
- สามารถ dependent กันได้
- สามารถรัน parallel ได้

### Smart Hashing
Smart hashing คือการ hash inputs:
- Hash source files
- Hash dependencies
- Hash configuration
- ใช้สำหรับ caching

### Remote Caching
Remote caching คือการ cache outputs:
- Cache build outputs
- Cache test results
- Share cache ทั่ง team

## Configuration Structure

```yaml
projects:
  - 'apps/*'
  - 'packages/*'

tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'src/**/*'
```

## Task Dependencies

### Sequential
```yaml
tasks:
  build:
    command: 'bun run build'
  test:
    command: 'bun test'
    deps:
      - build
```

### Parallel
```yaml
tasks:
  build:
    command: 'bun run build'
  lint:
    command: 'bun run lint'
```

## Best Practices

1. **Use Smart Hashing**: ใช้ smart hashing เพื่อความเร็ว
2. **Use Remote Caching**: ใช้ remote caching เพื่อ sharing
3. **Use Affected**: ใช้ --affected เพื่อ efficiency
4. **Group Projects**: Group projects สำหรับ organization

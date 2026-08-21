# Tasks

Tasks ใน moonrepo

## What are Tasks?

Tasks คือ commands ที่รันใน projects:
- กำหนดใน `moon.yml`
- สามารถ dependent กันได้
- สามารถรัน parallel ได้

## Task Definition

### Basic Task
```yaml
tasks:
  build:
    command: 'bun run build'
```

### Task with Inputs
```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'src/**/*'
```

### Task with Outputs
```yaml
tasks:
  build:
    command: 'bun run build'
    outputs:
      - 'dist/**/*'
```

## Task Dependencies

### Sequential Execution
```yaml
tasks:
  build:
    command: 'bun run build'
  test:
    command: 'bun test'
    deps:
      - build
```

### Multiple Dependencies
```yaml
tasks:
  build:
    command: 'bun run build'
  lint:
    command: 'bun run lint'
  test:
    command: 'bun test'
    deps:
      - build
      - lint
```

## Task Options

### Caching
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
```

### Platform
```yaml
tasks:
  build:
    command: 'bun run build'
    platform: 'node'
```

### Environment Variables
```yaml
tasks:
  build:
    command: 'bun run build'
    env:
      NODE_ENV: production
```

## Best Practices

1. **Define Inputs**: Define inputs สำหรับ smart hashing
2. **Define Outputs**: Define outputs สำหรับ caching
3. **Use Dependencies**: Use dependencies สำหรับ ordering
4. **Use Options**: Use options สำหรับ optimization

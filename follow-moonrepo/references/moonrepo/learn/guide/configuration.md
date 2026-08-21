# Configuration

การตั้งค่า moonrepo

## moon.yml

Configuration file หลักของ moonrepo

## Basic Structure

```yaml
projects:
  - 'apps/*'
  - 'packages/*'

tasks:
  build:
    command: 'bun run build'
```

## Projects Configuration

### Define Projects
```yaml
projects:
  - 'apps/*'
  - 'packages/*'
```

### Group Projects
```yaml
projects:
  apps:
    - 'apps/*'
  packages:
    - 'packages/*'
```

### Filter Projects
```yaml
projects:
  - 'apps/*'
  - 'packages/*'
  - '!packages/internal/*'
```

## Tasks Configuration

### Define Tasks
```yaml
tasks:
  build:
    command: 'bun run build'
```

### Task Dependencies
```yaml
tasks:
  build:
    command: 'bun run build'
  test:
    command: 'bun test'
    deps:
      - build
```

### Task Inputs
```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'src/**/*'
```

### Task Outputs
```yaml
tasks:
  build:
    command: 'bun run build'
    outputs:
      - 'dist/**/*'
```

## Advanced Configuration

### Environment Variables
```yaml
tasks:
  build:
    command: 'bun run build'
    env:
      NODE_ENV: production
```

### Platform Specific
```yaml
tasks:
  build:
    command: 'bun run build'
    platform: 'node'
```

### Options
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
```

## Best Practices

1. **Group Projects**: Group projects สำหรับ organization
2. **Define Inputs**: Define inputs สำหรับ smart hashing
3. **Define Outputs**: Define outputs สำหรับ caching
4. **Use Dependencies**: Use dependencies สำหรับ task ordering

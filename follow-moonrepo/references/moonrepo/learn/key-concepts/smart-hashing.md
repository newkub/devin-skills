# Smart Hashing

Smart hashing ใน moonrepo

## What is Smart Hashing?

Smart hashing คือการ hash inputs:
- Hash source files
- Hash dependencies
- Hash configuration
- ใช้สำหรับ caching

## Hash Components

### Source Files
Hash source files:
```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'src/**/*'
```

### Dependencies
Hash dependencies:
```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'package.json'
```

### Configuration
Hash configuration:
```yaml
tasks:
  build:
    command: 'bun run build'
    inputs:
      - 'tsconfig.json'
```

## Hash Calculation

moon calculate hashes:
1. Read inputs
2. Calculate hash
3. Compare with cache
4. Return cached outputs if match

## Benefits

### Faster Builds
- Skip rebuilds ถ้า inputs ไม่เปลี่ยน
- Cache build outputs
- Reduce build time

### Efficient Caching
- Cache ตาม hash
- Invalidate cache เมื่อ inputs เปลี่ยน
- Share cache ทั่ง team

## Best Practices

1. **Define Inputs**: Define inputs สำหรับ smart hashing
2. **Include Dependencies**: Include dependencies ใน inputs
3. **Include Config**: Include config ใน inputs
4. **Test Hashing**: Test hashing สำหรับ correctness

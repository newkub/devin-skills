# Use Caching

ใช้ caching เพื่อ performance

## Principle

ใช้ caching เพื่อลดเวลาที่ใช้ในการ build และ test

## Why Use Caching?

1. **Faster Builds**: Skip rebuilds ถ้า inputs ไม่เปลี่ยน
2. **Resource Saving**: ลด resource usage
3. **Team Sharing**: Share cache ทั่ง team

## Types of Caching

### Local Caching
Cache บน local machine:
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
```

### Remote Caching
Cache บน remote server:
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
      remote: true
```

## Configuration

### Enable Caching
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: true
```

### Disable Caching
```yaml
tasks:
  build:
    command: 'bun run build'
    options:
      cache: false
```

## Best Practices

1. **Enable Caching**: เปิด caching สำหรับ tasks ที่เหมาะสม
2. **Define Inputs**: Define inputs สำหรับ smart hashing
3. **Define Outputs**: Define outputs สำหรับ caching
4. **Monitor Cache**: Monitor cache hit rate

# Best Practices

## แนวทางปฏิบัติที่ดีสำหรับ Turborepo

### 1. Task Dependencies

ใช้ `^` สำหรับ dependencies ของ dependencies:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]  // Build dependencies ก่อน
    }
  }
}
```

### 2. Cache Strategy

- **Cache build outputs** - Cache `dist/`, `.next/`, `build/`
- **Don't cache dev tasks** - Set `cache: false` สำหรับ dev/watch tasks
- **Use outputs pattern** - ระบุ outputs อย่างชัดเจน

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 3. Input Patterns

ใช้ `$TURBO_DEFAULT$` สำหรับ default inputs:

```json
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", "src/**"]
    }
  }
}
```

### 4. Environment Variables

ใช้ `globalEnv` สำหรับ env ที่ใช้ทั่วทั้ง monorepo:

```json
{
  "globalEnv": ["NODE_ENV"],
  "tasks": {
    "build": {
      "env": ["DATABASE_URL"]  // Env เฉพาะ task
    }
  }
}
```

### 5. Concurrency

ตั้งค่า concurrency ตาม resources:

```json
{
  "concurrency": "50%"  // ใช้ 50% ของ CPU cores
}
```

### 6. Workspace Organization

จัดโครงสร้าง monorepo อย่างชัดเจน:

```
monorepo/
├── apps/          # Applications
├── packages/      # Shared packages
└── turbo.json
```

### 7. Task Naming

ใช้ task names ที่สม่ำเสมอ:

```json
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev"
  }
}
```

### 8. Affected Mode

ใช้ affected mode ใน CI:

```bash
# CI pipeline
turbo run build test --affected
```

### 9. Remote Cache

เปิดใช้ remote cache สำหรับ teams:

```json
{
  "remoteCache": {
    "enabled": true
  }
}
```

### 10. CI/CD Integration

ใช้ Turborepo ใน CI pipelines:

```yaml
# GitHub Actions
- name: Build
  run: turbo run build

- name: Test
  run: turbo run test --affected
```

### 11. Cache Validation

ตรวจสอบ cache อย่างสม่ำเสมอ:

```bash
# Check cache status
turbo run build --dry=json

# Clear cache
rm -rf .turbo/cache
```

### 12. Performance Monitoring

ใช้ observability features:

```json
{
  "futureFlags": {
    "experimentalObservability": true
  }
}
```

### 13. Documentation

Document turbo.json configuration:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "$comment": "See docs/turbo.md for configuration details"
}
```

### 14. Version Control

Track turbo.json ใน git:

```bash
git add turbo.json
git commit -m "Add Turborepo configuration"
```

### 15. Testing

Test configuration ด้วย dry run:

```bash
turbo run build --dry
```

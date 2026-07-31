# Quick Start

## เริ่มต้นใช้งาน Turborepo

### 1. ติดตั้ง

```bash
bun add -D turbo
```

### 2. สร้าง turbo.json

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 3. ตั้งค่า Scripts

ใน root `package.json`:

```json
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}
```

### 4. Run Tasks

```bash
# Run build task
bun run build

# Run multiple tasks
bun run build test lint

# Dry run (preview without executing)
turbo run build --dry

# Force rebuild (ignore cache)
turbo run build --force
```

### 5. Filter Workspaces

```bash
# Run สำหรับ workspace เฉพาะ
turbo run build --filter=web

# Run สำหรับ web และ dependencies
turbo run build --filter=web...

# Exclude workspace
turbo run build --filter=!docs
```

### 6. Affected Mode

```bash
# Run เฉพาะ workspaces ที่ได้รับผลกระทบ
turbo run build --affected
```

### 7. Remote Cache

```bash
# Login to Vercel
turbo login

# Link repository
turbo link

# Run with remote cache
turbo run build
```

## ตัวอย่าง Monorepo

```
my-monorepo/
├── package.json
├── turbo.json
├── apps/
│   ├── web/
│   │   └── package.json
│   └── api/
│       └── package.json
└── packages/
    ├── ui/
    │   └── package.json
    └── utils/
        └── package.json
```

## Next Steps

- ดู [Configuration](configuration.md) สำหรับตั้งค่าเพิ่มเติม
- ดู [Best Practices](best-practices.md) สำหรับแนวทางปฏิบัติที่ดี
- ดู [Integration](integration.md) สำหรับการเชื่อมต่อกับ tools อื่นๆ

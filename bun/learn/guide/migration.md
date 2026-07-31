# Migration from Node.js

## Prerequisites

- ติดตั้ง Bun
- Backup โปรเจกต์
- Test อย่างละเอียดหลัง migration

## Migration Steps

### Install Bun

```bash
# Windows (PowerShell)
irm bun.sh/install.ps1 | iex

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### Replace package-lock.json

```bash
rm package-lock.json
bun install
```

### Update Scripts

```json
{
  "scripts": {
    "dev": "bun run src/index.js",
    "build": "bun build src/index.js --outdir ./dist",
    "test": "bun test",
    "start": "bun run src/index.js"
  }
}
```

### Update Environment Variables

```bash
bun remove dotenv
```

### Replace Node.js APIs

| Node.js | Bun | Notes |
|---------|-----|-------|
| `fs.readFile` | `Bun.file()` | Async by default |
| `http.createServer` | `Bun.serve()` | Faster |
| `crypto` | `crypto` | Mostly compatible |
| `path` | `path` | Compatible |

### Update TypeScript Config

```json
{
  "compilerOptions": {
    "types": ["bun-types"]
  }
}
```

### Test Migration

```bash
bun test
bun run dev
```

## Common Issues

### Native Modules

- หา alternatives ที่เป็น pure JavaScript
- ใช้ Node.js compatibility layer

### Platform-specific Code

```typescript
// ❌ อาจไม่รองรับ
const os = require('os');

// ✅ ใช้ Bun APIs
const os = require('bun:os');
```

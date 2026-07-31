# Migrate from Node.js

## Execute

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

- `fs` → `Bun.file()` หรือ `Bun.write()`
- `path` → `path` จาก Bun (รองรับส่วนใหญ่)
- `crypto` → `crypto` จาก Bun (รองรับส่วนใหญ่)
- `http`/`https` → `Bun.serve()` หรือ `fetch`

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

## Rules

- ตรวจสอบ dependencies ที่ใช้ native modules
- ตรวจสอบ APIs ที่ไม่รองรับใน Bun
- ใช้ `bun compat` เพื่อดู compatibility
- test อย่างละเอียดหลัง migration

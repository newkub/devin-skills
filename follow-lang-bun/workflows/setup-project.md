# Setup Bun Project Workflow

> Goal: สร้าง Bun project ใหม่พร้อมโครงสร้างมาตรฐาน

## 1. Scaffold

```bash
bun init            # interactive: blank | react | library
bun init -y         # defaults
bun create <tpl>    # community templates (vite, elysia, next)
```

`bun init` สร้าง `package.json`, `tsconfig.json`, `index.ts`, `.gitignore`, `bunfig.toml` (ตาม template)

## 2. Directory Structure

```text
my-app/
  src/
    index.ts        # entry point
    lib/            # modules
  tests/ หรือ src/**/*.test.ts
  package.json
  bunfig.toml
  tsconfig.json
  bun.lock          # generated — commit เสมอ
  .env              # auto-loaded — gitignore
  .env.example      # commit แทน .env
```

- Single package: `src/` flat พอ — อย่าสร้างโครงสร้างเกิน
- Monorepo: `packages/<name>/` + root `package.json` มี `"workspaces": ["packages/*"]`

## 3. package.json Essentials

```jsonc
{
  "name": "my-app",
  "module": "src/index.ts",     // entry สำหรับ bundlers
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "test": "bun test",
    "typecheck": "tsc --noEmit",
    "build": "bun build src/index.ts --outdir dist"
  },
  "devDependencies": {
    "bun-types": "latest",
    "typescript": "^5"
  }
}
```

- `module`/`main` ชี้ `.ts` ได้ — Bun/bundlers เข้าใจ
- อย่าใส่ `engines.bun` เว้นแต่จำเป็น — `packageManager` field ไม่จำเป็น (bun.lock พอ)

## 4. bunfig.toml Skeleton

```toml
# runtime
# preload = ["./src/preload.ts"]

[test]
coverage = true

[install]
# minimumReleaseAge = 259200

[build]
# sourcemap = "linked"
```

## 5. tsconfig

ใช้ recommended tsconfig ใน [../references/typescript.md](../references/typescript.md)

## 6. Verify

```bash
bun run src/index.ts     # runs TS directly
bun test                 # zero tests pass
bunx tsc --noEmit        # typecheck
```

## 7. Git Hygiene

`.gitignore` ขั้นต่ำ: `node_modules`, `dist`, `.env`, `*.log`, `coverage`
Commit: `bun.lock`, `bunfig.toml`, `tsconfig.json`, `.env.example`

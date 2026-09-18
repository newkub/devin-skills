# Migrate From Node.js To Bun Workflow

> Goal: ย้าย Node.js project มาใช้ Bun อย่างปลอดภัยและย้อนกลับได้

## 1. Prerequisites

- `bun --version` >= 1.4 ติดตั้งแล้ว (ดู [../references/install.md](../references/install.md))
- `git status` สะอาด — commit ก่อน migrate

## 2. Replace Package Manager

```bash
rm -rf node_modules package-lock.json   # หรือ yarn.lock / pnpm-lock.yaml
bun install                             # เขียน bun.lock
```

- `bun pm migrate` — แปลง lockfile เดิมเป็น `bun.lock` โดยรักษา resolved versions (ก่อนลบ lockfile เก่า)
- ตรวจ `trustedDependencies` — packages ที่เคยพึ่ง `postinstall` (esbuild, sharp, prisma, puppeteer ฯลฯ) ต้อง declare:

```jsonc
{ "trustedDependencies": ["esbuild", "prisma"] }
```

- รัน `bun pm untrusted` ดู packages ที่ถูก block

## 3. Update Scripts

| เดิม | ใหม่ |
|------|-----|
| `npm run dev` | `bun run dev` หรือ `bun dev` |
| `npm install` | `bun install` |
| `npx <tool>` | `bunx <tool>` |
| `node index.js` | `bun index.js` |
| `node --watch` | `bun --watch` |
| `jest` / `vitest` (basic) | `bun test` |
| `ts-node`, `tsx` | ลบออก — Bun รัน TS ตรงๆ |
| `dotenv` | ลบออก — `.env` auto-load |

- Scripts ที่มี `#!/usr/bin/env node` shebang → `bun run --bun <script>` หรือ `bunx --bun` บังคับ Bun
- `cross-env` → ลบได้ถ้าใช้แค่ set env (`KEY=v bun run x` ทำงานใน Bun shell ได้)

## 4. Compatibility Checklist

1. `node:*` imports — ทำงานได้เกือบทั้งหมด (Node.js 26.3.0 compat) ยกเว้น edge cases ดู /docs/runtime/nodejs-compat
2. Globals: `process`, `Buffer`, `__dirname`, `require` — ใช้ได้ แต่แนะนำ migrate เป็น ESM
3. Native addons (`.node`, node-gyp) — Node-API supported; packages ที่พึ่ง V8 internals อาจพัง
4. `import.meta.url` patterns ทำงานปกติ; `import.meta.dirname`/`filename` มีให้ใน Bun
5. TypeScript — ลบ `tsconfig` `module: "commonjs"`; ใช้ `bundler` resolution + `bun-types`
6. Test framework — jest/vitest API ส่วนใหญ่ map เข้า `bun:test` ได้ (`jest.mock` → `mock.module`)

## 5. Gradual Adoption (ไม่ต้องย้ายทั้งหมด)

- `bun install` แค่ PM อย่างเดียวก็ได้ — runtime ยัง node (`node server.js`)
- `bun test` แยกได้โดยไม่เปลี่ยน runtime หลัก
- Keep `node` fallback script: `"start:node": "node dist/index.js"`

## 6. Verify

```bash
bun run dev          # dev flow works
bun test             # tests pass
bun run build        # build works
bunx tsc --noEmit    # types ok
```

## 7. Rollback

- `bun.lock` ไม่ชน npm — `npm install` สร้าง `package-lock.json` ใหม่ได้เสมอ
- เก็บ `package-lock.json` เดิมไว้ใน git history — revert ได้ทุกเมื่อ

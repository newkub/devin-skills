# Workspace Package Setup

อธิบายการตรวจ `package.json` ของ `tools/analyze` และ root workspace configuration

## Package Identity

ตรวจ `tools/analyze/package.json` ว่ามี:

- `name: "tools-analyze"` — ชื่อ workspace package ต้องตรงกับที่ root อ้างถึง
- `type: "module"` — ใช้ ESM เป็น default module system

ถ้า `name` ไม่ใช่ `tools-analyze` → flag เป็น `Critical`
ถ้า `type` ไม่ใช่ `module` → flag เป็น `High`

## Scripts

ตรวจ `scripts` field ว่ามีครบ:

| Script | Command | วัตถุประสงค์ |
|---|---|---|
| `analyze` | `bun run src/presentation/cli.ts` | run CLI แบบ interactive |
| `analyze:json` | `bun run src/presentation/cli.ts --json` | output เป็น JSON |
| `lint` | `bunx biome check src/` | lint check |
| `typecheck` | `bunx tsc --noEmit` | type check |

ถ้า script ขาด → flag เป็น `Medium`

## Exports Field

ตรวจ `exports` field ใน `tools/analyze/package.json`:

```json
{
  "exports": {
    ".": "./src/index.ts"
  }
}
```

`exports` field ชี้ไปยัง `src/index.ts` เพื่อให้ workspace อื่น import ได้
ถ้าไม่มี `exports` field → flag เป็น `High`

ดู `references/exports.md` สำหรับรายละเอียด workspace API exports

## Root Workspace

ตรวจ root `package.json` ว่า:

1. `workspaces` รวม `tools/analyze` หรือ pattern ที่ match (เช่น `tools/*`)
2. มี script `analyze` ที่รันผ่าน workspace filter:

```json
{
  "scripts": {
    "analyze": "bun --filter tools-analyze analyze"
  }
}
```

ถ้า root `package.json` ไม่มี `workspaces` ที่รวม `tools/analyze` → flag เป็น `Critical`
ถ้าไม่มี script `analyze` ใน root → flag เป็น `Medium`

## Evidence Collection

บันทึก findings พร้อม:

- file path ของ `package.json` ที่ตรวจ
- ค่าจริงของ field ที่พบ
- expected value ที่ควรเป็น
- severity ตาม impact

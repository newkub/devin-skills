# Workspace API Exports

อธิบายการตรวจ workspace API exports ของ `tools/analyze`

## Src/Index.Ts Exports

ตรวจ `src/index.ts` ว่า export ฟังก์ชันสำหรับ workspace API:

| Export | Type | วัตถุประสงค์ |
|---|---|---|
| `runAllAnalyzers` | `function` | รัน analyzers ทั้งหมด คืน `AnalyzeReport` |
| `createAnalyzePorts` | `function` | สร้าง ports สำหรับ inject adapters |

ถ้า export ขาด → flag เป็น `High`

## Package.Json Exports Field

ตรวจ `package.json` ว่า `exports` field ชี้ไปยัง `src/index.ts`:

```json
{
  "exports": {
    ".": "./src/index.ts"
  }
}
```

ถ้า `exports` field ไม่ชี้ไป `src/index.ts` → flag เป็น `High`

ดู `references/workspace-package.md` สำหรับ `package.json` setup ทั้งหมด

## Process.Env.Analyze_Base

ตรวจว่ามีการอ่าน `process.env.ANALYZE_BASE` สำหรับ repo root:

- ใช้ใน `createAnalyzePorts` หรือ adapter initialization
- ค่า default ควรเป็น `process.cwd()` ถ้าไม่ได้ set
- ใช้สำหรับ resolve path ของ `walk` และ `gitGrep`

```typescript
const base = process.env.ANALYZE_BASE ?? process.cwd();
```

ถ้าไม่มีการอ่าน `ANALYZE_BASE` → flag เป็น `Medium`

## Import From Workspace

ตรวจว่า workspace อื่น import ได้ผ่าน:

```typescript
import { runAllAnalyzers, createAnalyzePorts } from "tools-analyze";
```

ถ้า import ไม่ได้ → flag เป็น `High`

ดู `references/review-integration.md` สำหรับการใช้งานใน `tools/review-codebase`

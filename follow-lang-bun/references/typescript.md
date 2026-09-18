# TypeScript On Bun

Bun รัน `.ts` และ `.tsx` โดยตรง — transpile ภายในไม่ต้อง `tsc`, `ts-node`, `tsx` หรือ build step Docs: https://bun.com/docs/typescript

## Key Facts

- **Runtime ไม่ typecheck** — Bun strip types แล้วรัน; typecheck แยกด้วย `bunx tsc --noEmit`
- Type-aware rules ไม่รองรับที่ runtime (เช่น `const enum`, `import =`) — ใช้ plain `enum` + ESM imports แทน
- JSX/TSX รองรับโดยตรง — config ผ่าน `tsconfig.json` (`jsx`, `jsxFactory`, `jsxImportSource`) หรือ `bunfig.toml`
- Decorators, `emitDecoratorMetadata` — ตาม `tsconfig.json` (experimental support)

## bun-types

```bash
bun add -d bun-types
```

ให้ type definitions ของ `Bun.*` globals, `bun:test`, `bun:jsc`, `bun:sqlite`, `bun:ffi` ฯลฯ

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "types": ["bun-types"],   // หรือ "bun" ใน tsconfig versions ใหม่
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "esnext",
    "lib": ["esnext"],
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

- `bun-types` ลง `node_modules/@types/bun` — `@types/node` ยังใช้ร่วมได้ถ้าต้องการ node compat types
- `/// <reference types="bun" />` เป็น alternative ไม่ต้องแก้ tsconfig

## Recommended tsconfig (official)

```jsonc
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "types": ["bun-types"]
  }
}
```

- `allowImportingTsExtensions` — Bun อนุญาต `import "./x.ts"` ตรงๆ
- `moduleResolution: "bundler"` — ตรง Bun's resolution algorithm
- `noEmit` — typecheck only (Bun ทำ execution)

## Typecheck In Workflow

```bash
bunx tsc --noEmit            # one-shot
bunx tsc --noEmit --watch    # watch mode
```

- package.json script: `"typecheck": "tsc --noEmit"`
- CI: `bun install && bunx tsc --noEmit && bun test`

## TypeScript Versions

- ใช้ `typescript` จาก devDependencies สำหรับ typecheck (`bun add -d typescript`)
- Docs เฉพาะ: https://bun.com/docs/typescript-6 สำหรับ TypeScript 6/7 (tsgo native compiler) — runtime ไม่ขึ้นกับ TS version เพราะ transpiler เป็นของ Bun เอง

## Common Gotchas

- `import type` / `export type` ปลอดภัยเสมอ; `verbatimModuleSyntax` ช่วยกัน type imports หลุม
- `enum` (plain) ใช้ได้; `const enum` ถูก inline เฉพาะกรณี — หลีกเลี่ยงใน libraries
- `paths` aliases ใน tsconfig — Bun เคารพ `tsconfig.json` paths ตอน runtime
- `.d.ts` files ไม่รัน — Bun ข้าม type declarations
- `tsc --noEmit` ยังจำเป็นสำหรับ CI — Bun จะไม่เตือน type errors ตอนรัน

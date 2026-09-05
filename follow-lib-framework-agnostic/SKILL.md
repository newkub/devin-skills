---
name: follow-lib-framework-agnostic
description: พัฒนา libraries แบบ core + adapters ให้ใช้ได้บน multiple frameworks
argument-hint: "[scope]"
related:
  - deep-validate
  - follow-lang-typescript
  - follow-package-manifest
  - follow-tool-tsdown
---

## Goal

พัฒนาโค้ดที่ทำงานได้บน multiple frameworks โดยไม่ผูกติดกับ framework ใด framework หนึ่ง ผ่าน Core + Adapters pattern

## Scope

พัฒนาโค้ดที่สามารถทำงานได้บน multiple frameworks (React, Vue, Svelte, Solid, Angular หรือ vanilla JS) โดยไม่ผูกติดกับ framework ใด framework หนึ่งเป็นพิเศษ ตามแนวทางที่ ecosystems อย่าง TanStack ใช้ (`*-core` package + framework adapters)

ใช้สำหรับ:

- สร้าง libraries ที่ใช้ได้หลาย frameworks
- แยก business logic ออกจาก UI framework
- สร้าง adapters สำหรับแต่ละ framework
- Design composable interfaces ที่ type-safe ข้าม frameworks

## Execute

### 1. Design Core API

> Goal: กำหนด interfaces และ adapters ที่ framework-agnostic

1. กำหนด interfaces หลักโดยไม่อ้างอิง framework-specific types
2. กำหนด public API ให้รับ/คืน plain data ผ่าน standard Web APIs (`URL`, `Request`, `Response`, `AbortSignal`, `EventTarget` ฯลฯ)
3. วางแผน adapter สำหรับแต่ละ framework
4. กำหนด framework-specific hooks/composables ที่ต้อง implement
5. ถ้าต้อง interop กับ validation libraries → implement `StandardSchemaV1` interface เพื่อรองรับ Zod, Valibot, ArkType โดยไม่ผูกตัวใดตัวหนึ่ง

### 2. Implement Core

> Goal: สร้าง framework-agnostic business logic

1. สร้าง `src/core/` directory (หรือ package `@scope/name-core` ใน monorepo)
2. Implement business logic ด้วย vanilla TypeScript
3. สร้าง utility functions โดยใช้ standard Web APIs เท่านั้น
4. ห้าม import framework dependencies ใน `src/core/` — ตรวจด้วย lint rule หรือ `check-circular-dependencies`

### 3. Create Adapters

> Goal: สร้าง adapters สำหรับแต่ละ framework

1. สร้าง `src/react/` directory และ hooks ที่ wrap core logic
2. สร้าง `src/vue/` directory และ composables ที่ wrap core logic
3. ทำซ้ำสำหรับ Svelte, Solid, Angular หรือ frameworks อื่น
4. รักษา consistent API ข้าม adapters — adapter ควรเป็น thin wrapper ที่ map กับ framework reactivity/lifecycle เท่านั้น
5. ใส่ framework เป็น `peerDependencies` ไม่ใช่ `dependencies` เพื่อเลี่ยง duplicate installs

### 4. Configure Package Exports

> Goal: ทำให้ consumers import adapter ได้เฉพาะ framework ที่ใช้

1. กำหนด `exports` field ใน `package.json` เป็น subpath exports:

```json
{
  "exports": {
    ".": { "types": "./dist/core/index.d.ts", "import": "./dist/core/index.js" },
    "./react": { "types": "./dist/react/index.d.ts", "import": "./dist/react/index.js" },
    "./vue": { "types": "./dist/vue/index.d.ts", "import": "./dist/vue/index.js" }
  },
  "peerDependencies": {
    "react": ">=18",
    "vue": ">=3"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "vue": { "optional": true }
  }
}
```

2. Build ด้วย library bundler ที่รองรับ multi-entry เช่น `tsdown`, `tsup` หรือ `unbuild`
3. ถ้า adapters ใหญ่หรือมี dependencies ต่างกันมาก → แยกเป็นหลาย packages (`@scope/name-core`, `@scope/name-react`) ใน monorepo ตาม `/follow-monorepo`

### 5. Test

> Goal: ทดสอบ core และ adapters

1. เขียน unit tests สำหรับ core ด้วย `Vitest` (framework-agnostic)
2. เขียน integration tests สำหรับแต่ละ adapter ด้วย testing library ของ framework นั้น
3. ทดสอบ edge cases ข้าม frameworks
4. Verify type safety ด้วย TypeScript strict mode ทุก entry point

## Rules

### 1. Core Principles

- Framework-agnostic core: core logic ไม่ import framework
- Adapter pattern: สร้าง thin adapters สำหรับแต่ละ framework
- Standard APIs: ใช้ Web APIs มาตรฐานแทน framework-specific APIs
- Type-safe: รองรับ TypeScript ทุก framework

### 2. Code Organization

```text
src/
├── core/                   # Framework-agnostic core
│   ├── index.ts
│   ├── logic.ts
│   ├── types.ts
│   └── utils.ts
├── react/                  # React adapter
│   ├── index.ts
│   └── useHook.ts
├── vue/                    # Vue adapter
│   ├── index.ts
│   └── composable.ts
└── shared/                 # Shared utilities
    └── helpers.ts
```

### 3. Safety

- ไม่ผูก core logic กับ framework lifecycle
- ไม่ใช้ framework-specific global state
- เก็บ types ใน `core/types.ts` ไม่ใช่ใน adapter
- ทุก framework dependency ต้องเป็น `peerDependencies` และ mark `optional` ใน `peerDependenciesMeta`

## Guide

- `/deep-validate` — ตรวจสอบความถูกต้องก่อนเริ่ม
- `/follow-lang-typescript` — TypeScript best practices
- `/follow-package-manifest` — ตั้งค่า `exports`/`peerDependencies` ให้ถูกต้อง
- `/follow-tool-tsdown` — build multi-entry library

## Expected Outcome

- Core logic ไม่ผูกติด framework และทดสอบแยกได้
- Adapters ทำงานได้ทุก frameworks ผ่าน subpath exports
- API consistent ข้าม frameworks
- Type safety ครบถ้วนทุก entry point

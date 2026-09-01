---
name: follow-create-tsdown-plugins
description: สร้าง tsdown plugins ด้วย Rolldown API และ tsdown-specific hooks
related:
  - follow-tool-tsdown
  - follow-create-rolldown-plugins
  - follow-create-vite-plugins
  - follow-lang-typescript
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-build-packages
---
## Goal

สร้าง tsdown plugins ด้วย Rolldown-compatible plugin API พร้อม tsdown-specific lifecycle hooks

## Scope

ใช้สำหรับสร้าง plugins สำหรับ `tsdown` bundler ด้วย TypeScript ครอบคลุม plugin object, hooks, build, tests, และ npm package

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Project

> Goal: สร้าง plugin package

1. สร้าง directory `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย name `tsdown-plugin-{name}` หรือ `unplugin-{name}`
3. ติดตั้ง `tsdown`, `rolldown`, `typescript`, `@types/bun`
4. ติดตั้ง build tool: `bunup` หรือ `tsdown`
5. สร้าง `tsconfig.json` ด้วย `strict: true`, `declaration: true`

### 3. Create Plugin Object

> Goal: implement plugin factory

1. สร้าง `src/index.ts` ด้วย factory function
2. Import type `TsdownPlugin` จาก `tsdown/plugins` ถ้าใช้ tsdown hooks
3. หรือใช้ type `Plugin` จาก `rolldown` สำหรับ pure Rolldown plugin
4. return object ด้วย `name` ที required:
   ```ts
   import type { TsdownPlugin } from "tsdown/plugins";
   export function myPlugin(options?: MyOptions): TsdownPlugin {
     return {
       name: "tsdown-plugin-my",
       // hooks
     };
   }
   ```

### 4. Add Rolldown Hooks

> Goal: ใช้ Rolldown plugin API

1. `options` — แก้ input options
2. `buildStart` — เริ่ม build
3. `resolveId` — resolve import
4. `load` — โหลด module
5. `transform` — แปลง code
6. `buildEnd` / `closeBundle` — cleanup
7. ใช้ hook filters สำหรับ `resolveId`, `load`, `transform`:
   ```ts
   transform: {
     filter: { id: /\.ts$/ },
     handler(code, id) { ... }
   }
   ```

### 5. Add tsdown-Specific Hooks

> Goal: ใช้ tsdown-specific lifecycle

1. `tsdownConfig` — แก้ `UserConfig` ก่อน resolved
2. `tsdownConfigResolved` — หลัง resolved config (call ต่อ format)
3. ใช้ mutation สำหรับ `config.plugins` ใน `tsdownConfig`
4. ระวังว่า `fromVite` plugins ไม่ได้รับ `tsdownConfig`

### 6. Build Package

> Goal: build plugin สำหรับ npm

1. สร้าง `bunup.config.ts` หรือ `tsdown.config.ts`
2. External `tsdown` และ `rolldown` จาก bundle
3. Output `esm` และ `cjs` พร้อม `.d.ts`
4. ระบุ `exports`, `types`, `main` ใน `package.json`
5. รัน `bun run build`

### 7. Add Tests

> Goal: ทดสอบ plugin

1. สร้าง `test/plugin.test.ts`
2. ใช้ `tsdown.build(...)` หรือ `rolldown.build(...)` ด้วย plugin
3. ตรวจสอบ bundle output
4. รัน `bun test`

### 8. Add Examples

> Goal: สร้างตัวอย่างใช้งาน

1. สร้าง `examples/basic/` ด้วย plugin พื้นฐาน
2. สร้าง `examples/tsdown-config/` แสดงการใช้ `tsdownConfig` hook
3. รันตัวอย่างให้ผ่าน

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-verify-cicd`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Naming

- ใช้ `tsdown-plugin-{name}` สำหรับ tsdown-specific
- ใช้ `unplugin-{name}` ถ้ารองรับหลาย bundlers
- ชื่อ plugin ใน `name` field ต้อง unique ใน build

### 2. Plugin Type

- ใช้ `TsdownPlugin` จาก `tsdown/plugins` ถ้าต้องการ tsdown hooks
- ใช้ `Plugin` จาก `rolldown` ถ้าไม่ต้องการ tsdown hooks
- รักษา compatibility กับ Rollup plugins เมื่องเป็นไปได้

### 3. Hook Filters

- ใช้ `filter` ใน `resolveId`, `load`, `transform` เพื่อลด overhead
- คืน `null` เร็วถ้าไม่ match
- ระบุ regex ให้ชัดเจน เช่น `/\.ts$/` สำหรับ TypeScript files

### 4. tsdown Hooks

- `tsdownConfig` สามารถ mutate `config.plugins` in place
- หลีกเลี่ยงการ return partial config ถ้า plugins จำเป็นต้อง append
- `tsdownConfigResolved` ใช้สำหรับ stash resolved config

### 5. Build And External

- external `tsdown`, `rolldown`, `vite` ใน build
- สร้าง `.d.ts` ด้วย `bunup` หรือ `tsdown`
- ใช้ `exports` field ใน `package.json`

### 6. Migration

- ใช้ `bunx tsdown-migrate` สำหรับ migrate จาก `tsup`
- ตรวจสอบ output หลัง migrate

## Expected Outcome

- tsdown plugin build ผ่าน
- Plugin ทำงานกับ `tsdown.build` ได้
- Hook filters ลด overhead ระหว่าง Rust และ JS
- Tests และ examples ผ่าน
- `.d.ts` สร้างครบถ้วน

## Examples

```text
packages/tsdown-plugin-example/
├── src/
│   └── index.ts
├── test/
│   └── plugin.test.ts
├── examples/
│   ├── basic/
│   └── tsdown-config/
├── package.json
├── tsconfig.json
├── bunup.config.ts
└── README.md
```

## Guide

- `follow-tool-tsdown` — tsdown bundler setup
- `follow-create-rolldown-plugins` — Rolldown plugin patterns
- `follow-create-vite-plugins` — Vite plugin patterns
- `follow-tool-build-packages` — package build pipeline
- `follow-lang-typescript` — TypeScript best practices
- [tsdown Plugin Architecture](https://github.com/rolldown/tsdown/blob/main/docs/advanced/plugins.md)
- [Rolldown Plugin API](https://rolldown.rs/apis/plugin-api)


---
name: follow-create-bun-plugin
description: สร้าง Bun plugins ด้วย Bun.plugin API สำหรับ runtime และ bundler
argument-hint: "[scope]"
related:
  - use-bun-native-api
  - follow-create-bun-cli
  - follow-tool-bunup
  - review-dependencies
  - follow-create-plugins
---
## Goal

สร้าง Bun plugins ด้วย `Bun.plugin` API พร้อมรองรับ runtime และ bundler ผ่าน `onResolve`, `onLoad`, `onStart`, `onEnd`, `onBeforeParse` (native)

## Scope

ใช้สำหรับสร้าง plugins สำหรับ Bun runtime และ `bun build` bundler ด้วย TypeScript ครอบคลุม `Bun.plugin`, namespaces, filters, loaders, build, และ tests

- Latest: Bun `1.4.2`, `bun-types@1.4.2` (verified 2026-09-12)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/review-dependencies` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review tech stack, dependencies, และ library design (create bun plugins)
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create bun plugins)

### 2. Setup Project

> Goal: สร้าง plugin package

1. สร้าง directory `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย name `bun-plugin-{name}` หรือ `{name}-bun-plugin`
3. ติดตั้ง `typescript`, `@types/bun`
4. ติดตั้ง build tool: `bunup` หรือ `tsdown`
5. สร้าง `tsconfig.json` ด้วย `strict: true`, `declaration: true`

### 3. Create Plugin With Bun.plugin

> Goal: implement Bun plugin factory

1. สร้าง `src/index.ts` ด้วย factory function
2. ใช้ `Bun.plugin` หรือ return object สำหรับ setup:
   ```ts
   import type { BunPlugin } from "bun";
   export function myBunPlugin(options?: MyOptions): BunPlugin {
     return {
       name: "bun-plugin-my",
       setup(build) {
         // hooks
       }
     };
   }
   ```
3. ลงทะเบียน runtime plugin ผ่าน preload file ทีเรียก `plugin(myPlugin())` แล้วใช้ `bun --preload ./preload.ts` หรือ `preload = ["./preload.ts"]` ใน `bunfig.toml` ถ้าจำเป็น

### 4. Add onResolve

> Goal: intercept และเปลี่ยน module resolution

1. ใช้ `build.onResolve({ filter: /\.ext$/ }, (args) => { ... })`
2. ระบุ `namespace` ถ้าต้องการ custom module namespace
3. คืน `path` และ optional `namespace`
4. คืน `undefined` หรือ `null` ถ้าไม่ match

### 5. Add onLoad

> Goal: โหลดและ transform module contents

1. ใช้ `build.onLoad({ filter: /\.ext$/ }, async (args) => { ... })`
2. คืน `contents`, `loader`, หรือ `exports` (คู่กับ `loader: "object"`)
3. รองรับ loaders: `js`, `jsx`, `ts`, `tsx`, `json`, `jsonc`, `toml`, `yaml`, `text`, `file`, `napi`, `wasm`, `css`, `html`, `object`
4. ใช้ `Bun.file(args.path).text()` สำหรับอ่านไฟล์
5. ใช้ `namespace` เมื่องสร้าง virtual modules
6. ใช้ `await args.defer()` ถ้า contents ของ module ต้องรอให้ modules อื่นโหลดก่อน
7. ใช้ `build.module(specifier, callback)` เป็น shorthand สำหรับ virtual module เดียว

### 6. Add Lifecycle Hooks

> Goal: จัดการ build lifecycle

1. `build.onStart(() => { ... })` — เริ่ม bundle (รองรับ async, bundler รอจนครบ)
2. `build.onEnd((result) => { ... })` — จบ build พร้อม `BuildOutput`
3. `build.onBeforeParse(constraints, { napiModule, symbol })` — สำหรับ native (NAPI/Rust) plugins เท่านั้น รันใน parser thread
4. ใช้ `build.config` อ่าน/แก้ `BuildConfig` ภายใน `setup()` (lifecycle callbacks แก้ config ไม่ได้)

### 7. Build Package

> Goal: build plugin สำหรับ npm

1. สร้าง `bunup.config.ts` หรือ `tsdown.config.ts`
2. External `bun` types แต่ bundle runtime code
3. Output `esm` และ `cjs` พร้อม `.d.ts`
4. ระบุ `exports`, `types`, `main` ใน `package.json`
5. รัน `bun run build`

### 8. Add Tests

> Goal: ทดสอบ plugin

1. สร้าง `test/plugin.test.ts`
2. ใช้ `Bun.build({ ... plugins: [myPlugin()] })` สำหรับ bundler tests
3. ใช้ runtime tests ด้วย `Bun.plugin` + `import` statement
4. ตรวจสอบ output contents
5. รัน `bun test`

### 9. Add Examples

> Goal: สร้างตัวอย่างใช้งาน

1. สร้าง `examples/basic/` ด้วย plugin พื้นฐาน
2. สร้าง `examples/virtual-module/` ด้วย `onResolve` + `onLoad`
3. รันตัวอย่างให้ผ่าน

### 10. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Naming

- ใช้ `bun-plugin-{name}` สำหรับ Bun-specific
- ชื่อ plugin ใน `name` field ต้อง unique
- ตั้งชื่อ namespace ให้ชัดเจน เช่น `yaml:`, `svg:`

### 2. Plugin Registration

- Runtime: เรียก `plugin(myPlugin())` (named import จาก `bun`) หรือ `Bun.plugin(myPlugin())` ใน preload file — ไม่ใช่ใน entry file หลัก เพราะ plugins อาจ register หลัง module ถูก resolve แล้ว
- Bundler: ส่งผ่าน `plugins` option ของ `Bun.build`
- `bunfig.toml`: ใช้ top-level `preload = ["./register-plugins.ts"]` — ไม่มี `plugins` field ใน bunfig; หรือรัน `bun --preload ./file.ts`

### 3. Filters And Namespaces

- ใช้ `filter` regex ที่ชัดเจน — hooks match เฉพาะ specifier ทีมี `.` หรือ `:` เท่านั้น
- ใช้ `namespace` แยก custom modules
- คืน `undefined` เร็วถ้าไม่ match
- ระวัง regex performance

### 4. Loaders

- เลือก loader ตาม output ทีต้องการ
- `object` สำหรับ virtual module exports
- `text` สำหรับ raw contents
- `json` สำหรับ parsed JSON

### 5. Native APIs

- ใช้ `Bun.file` และ `Bun.write` แทน `node:fs`
- ใช้ `Bun.spawn` สำหรับ child processes ถ้าจำเป็น
- ใช้ `Bun.Glob` สำหรับ file patterns

### 6. Build And External

- external `bun` types แต่ bundle runtime code
- สร้าง `.d.ts` ด้วย `bunup` หรือ `tsdown`
- ใช้ `exports` field ใน `package.json`

- ใช้ /follow-create-elysia-plugin ถ้าจำเป็น
- ใช้ /follow-create-plugins ถ้าจำเป็น


## Expected Outcome

- Bun plugin build ผ่าน
- Plugin ทำงานกับ `Bun.build` และ Bun runtime ได้
- Tests ครอบคลุม bundler และ runtime paths
- `.d.ts` สร้างครบถ้วน
- Examples รันได้

## Examples

```text
packages/bun-plugin-example/
├── src/
│   └── index.ts
├── test/
│   └── plugin.test.ts
├── examples/
│   ├── basic/
│   └── virtual-module/
├── package.json
├── tsconfig.json
├── bunup.config.ts
└── README.md
```

### `package.json` Scripts

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bunx bunup",
    "test": "bun test"
  }
}
```

### `src/index.ts`

```ts
import type { BunPlugin } from "bun";

export function yamlPlugin(): BunPlugin {
  return {
    name: "bun-plugin-yaml",
    setup(build) {
      build.onResolve({ filter: /\.yaml$/ }, (args) => ({
        path: args.path,
        namespace: "yaml"
      }));
      build.onLoad({ filter: /\.yaml$/, namespace: "yaml" }, async (args) => {
        const text = await Bun.file(args.path).text();
        const data = parseYaml(text); // implement parseYaml ตาม context
        return { exports: { default: data }, loader: "object" };
      });
    }
  };
}
```

## Guide

- `use-bun-native-api` — Bun native APIs
- `use-bun-native-api` — Bun runtime setup
- `follow-create-bun-cli` — Bun CLI setup
- `follow-tool-bunup` — Bunup bundler
- [Bun Plugin Docs](https://bun.com/docs/runtime/plugins)
- [Bun Bundler Plugins](https://bun.com/docs/bundler/plugins)


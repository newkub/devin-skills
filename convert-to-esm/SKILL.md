---
name: convert-to-esm
description: Migrate CommonJS เป็น ESM ทีละขั้น แก้ require/module.exports, imports และ config
argument-hint: "[package-or-path]"
related:
  - use-astgrep
  - run-typecheck
  - check-backward-compatibility
  - update-references
  - run-build
  - run-test
  - refactor
  - use-bun-native-api
---

## Goal

Migrate JavaScript/TypeScript project จาก CommonJS (`require`/`module.exports`) เป็น ESM (`import`/`export`) อย่างเป็นระบบ โดยไม่ทำ runtime พัง

## Scope

- ครอบคลุม: `require` → `import`, `module.exports` → `export`, `"type": "module"` config, file extensions (`.js` vs `.cjs` vs `.mjs`), dynamic requires, `__dirname`/`__filename` equivalents, JSON imports
- ทำทีละ package/module — monorepo ทีละ workspace
- Action-oriented: แก้ code จริง — verify ด้วย typecheck/build/test ทุกขั้น

## Execute

### 1. Assess Current State

> Goal: วัดขนาดงานและ blockers

1. นับ `require`/`module.exports` sites ด้วย `use-astgrep` หรือ `search-files-patterns`
2. ตรวจ `package.json` `"type"` field และ runtime/tooling support (Node version, bundler, test runner)
3. หา blockers: dynamic `require()` ที่ static ไม่ได้, conditional requires, CJS-only deps
4. ตรวจ dependencies ที่ import project นี้ — ทำ `/check-backward-compatibility`

### 2. Plan Migration Order

> Goal: เรียงลำดับเพื่อลด breakage

1. leaf modules ก่อน (ไม่มี internal dependents) → core modules ทีหลัง
2. ระบุ files ที่ต้อง rename (`.js` → `.mjs` ถ้า mixed mode) หรือ config changes
3. วางแผน `package.json`: `"type": "module"`, `exports` map, `engines`

### 3. Convert

> Goal: แปลงทีละชุดพร้อม verify

1. แปลง `require` → `import` และ `module.exports` → `export` ทีละ module
2. แทน `__dirname`/`__filename` ด้วย `import.meta.url` + `fileURLToPath`
3. แปลง dynamic `require()` → `await import()` หรือ static import ถ้าทำได้
4. JSON requires → `import ... with { type: 'json' }` หรือ `fs.readFile`
5. เพิ่ม `.js` extensions ใน relative imports ตาม ESM spec
6. ทำ `/update-references` ทุกครั้งที่เปลี่ยน export/import paths

### 4. Update Config

> Goal: ปรับ tooling ให้รองรับ ESM

1. `"type": "module"` ใน `package.json` + `exports` map
2. tsconfig: `module: "NodeNext"`/`"ESNext"`, `moduleResolution` ที่ตรง
3. Test runner, bundler, scripts — ตรวจทุก tool ที่อ่าน code
4. แก้ `.cjs` สำหรับ files ที่ต้องคง CJS (config files ที่ tools บังคับ)

### 5. Verify

> Goal: ยืนยันทุกอย่างทำงานบน ESM

1. `/run-typecheck` + `/run-lint` ผ่าน
2. `/run-build` ผ่าน — bundle/output correct
3. `/run-test` ผ่าน — ระวัง test mocks ที่พึ่ง CJS semantics (`jest.mock` vs `vi.mock`)
4. smoke test runtime entry points จริง

## Rules

### 1. Incremental

- แปลงทีละ module/package — ไม่ big-bang ทั้ง repo พร้อมกัน
- verify หลังแต่ละ batch — ถ้าพังให้รู้ว่าพังที่ไหน

### 2. Compatibility Aware

- ถ้า package เป็น published library → ตัดสินใจ dual-publish (ESM+CJS) หรือ ESM-only กับ user ก่อน
- ระวัง tools ที่ยัง CJS-only — ใช้ `.cjs` files หรือ interop แทนบังคับ migrate

### 3. No Semantic Changes

- แปลง syntax/module system เท่านั้น — ห้าม refactor logic ไปด้วย
- circular imports ที่ CJS ทนได้อาจพังใน ESM — flag ให้ `/check-circular-dependencies`

## Expected Outcome

- Codebase เป็น ESM ครบ — ไม่มี `require`/`module.exports` เหลือ (ยกเว้น `.cjs` ที่จำเป็น)
- typecheck/build/test ผ่านทั้งหมด
- `package.json` exports map ถูกต้องสำหรับ consumers

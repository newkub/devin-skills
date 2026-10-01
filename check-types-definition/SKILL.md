---
name: check-types-definition
description: Inspect type definitions ของ lib/config เป็น CLI table — name, type, options, default, comment — รองรับ .d.ts (TS), Rust และ type-def formats อื่น
argument-hint: "<package-or-path> [--json]"
related:
  - learn
  - learn-from-web
  - learn-from-cli
  - follow-default-config
  - use-lib-effective
  - report
---

## Goal

ดู type surface จริงของ library หรือ config type เป็น table เดียว — ชื่อ field, type, options (union/enum), default, comment — เพื่อเช็คว่า config/API มีอะไรให้ใช้และ default คืออะไร โดยไม่ต้องพึ่ง docs

## Scope

ใช้เมื่อต้องการ authoritative type surface:

- config file ก่อนเขียน → เช็คว่า option ไหนมี default แล้ว (ใช้คู่กับ `/follow-default-config`)
- library API surface จาก `.d.ts` ใน `node_modules` — types คือ source of truth ของ compile-time
- รองรับ TypeScript `.d.ts`, Rust (`pub struct`/`enum` + doc comments/`#[serde(default)]`), และ type-def formats อื่น (JSON Schema, `.proto`) ตามที่มีใน project
- docs ล้าสมัยหรือไม่ครบ → type definitions คือสัญญาจริง

ไม่ใช่เรียนรู้จาก web docs (ใช้ `/learn-from-web`) หรือ CLI binary (ใช้ `/learn-from-cli`)

## Execute

### 1. Locate Definitions

> Goal: หา type-definition entry ของ target

1. รับ package name หรือ path จาก user
2. TS: อ่าน `node_modules/<pkg>/package.json` — ดู `types`, `typings`, `exports["."].types`; ถ้าไม่มี bundled types → เช็ค `@types/<pkg>`
3. Rust: หา `pub struct`/`pub enum` ใน crate source หรือ `cargo doc` JSON ถ้ามี
4. Config schema: หา type/interface ของ config object (เช่น `defineConfig` param type)

### 2. Extract Members

> Goal: ได้ field-level data ครบ

1. parse members ของ interfaces/types/structs: `name`, `type`, optional marker (`?`)
2. union/literal types → `options` column (เช่น `mode: 'a' | 'b'`)
3. comments/JSDoc/doc comments เหนือ member → `comment` column; `@default`/`Default` impl/`#[serde(default)]` → `default` column
4. `@deprecated` → flag ใน comment — อย่าแนะนำ member ที่ deprecated

### 3. Render Table

> Goal: CLI table เดียวอ่านรู้เรื่อง

1. ใช้ CLI: `bun run scripts/types-def.ts <path-or-package> [--json]` — auto-detect language จาก extension/content
2. columns: `Name` | `Type` | `Options` | `Default` | `Comment`
3. `--json` → machine-readable array; nested types expand เป็น sub-tables
4. ถ้า parse ไม่ได้ด้วย CLI → extract manual ตาม step 2 แล้ว render table เอง

### 4. Report

> Goal: สรุป surface ที่ใช้งานได้จริง

สรุปตาม `/report`: public fields/options พร้อม defaults ที่ต้อง override, deprecated members ที่ต้องเลี่ยง, และ gaps ที่ docs ไม่บอก

## Rules

- Type definitions คือ source of truth — ห้ามเดา options/defaults ที่ไม่ได้ declare
- ทุก row ต้องมี evidence จาก definition จริง — `-` ถ้าไม่มีข้อมูล
- Report-only — ห้ามแก้ไฟล์ config หรือ types ใน skill นี้ (override decisions อยู่ที่ `/follow-default-config`)

## Expected Outcome

- Table ครบทุก member ของ type ที่ inspect: name/type/options/default/comment
- รู้ชัดว่า option ไหนมี default แล้วไม่ต้องเขียน และ option ไหนต้องตั้งเอง
- พร้อมใช้เป็น input ให้ `/follow-default-config` และ config authoring

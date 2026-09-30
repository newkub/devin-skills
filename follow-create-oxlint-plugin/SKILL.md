---
name: follow-create-oxlint-plugin
description: ตั้งค่าและใช้งาน Oxlint plugins ทั้ง built-in และ JavaScript
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - deep-review
  - follow-tool-eslint
  - ship-to-dev-branch
  - run-lint
  - run-format
---
## Goal

ตั้งค่าและใช้งาน Oxlint plugins ทั้ง built-in และ JavaScript plugins สำหรับ linting

## Scope

ใช้สำหรับตั้งค่า Oxlint plugins ทั้ง built-in (native) และ JavaScript plugins สำหรับ linting

- Packages: `oxlint`, `oxlint-tsgolint` (optional type-aware preview) — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create oxlint plugins)

### 2. Setup

> Goal: ติดตั้ง oxlint และตรวจสอบ config file เดิม

1. ติดตั้ง oxlint ด้วย `bun add -D oxlint`
2. ตรวจสอบว่ามี config file อยู่แล้ว

### 3. Create Config File

> Goal: สร้าง config file ที่ root ของโปรเจกต์

1. สร้าง `.oxlintrc.json`/`.oxlintrc.jsonc` (standalone binary หรือ Node) หรือ `oxlint.config.ts` (Node-based package เท่านั้น) ที่ root — เพิ่ม `"$schema": "./node_modules/oxlint/configuration_schema.json"` สำหรับ autocomplete
2. สร้าง starter config ได้ด้วย `oxlint --init`; ระบุ config เองด้วย `oxlint -c <path>` (ปิด nested lookup)
3. เลือกใช้ format ที่ต้องการ — `oxlint.config.ts` ต้องมี Node v22.18+ หรือ v24+; ใช้ได้เพียงหนึ่ง config file ต่อ directory (JSON กับ TS อยู่ร่วมกันไม่ได้)

### 4. Configure Built-in Plugins

> Goal: เปิดใช้งาน built-in plugins ผ่าน `plugins` field

1. เลือก built-in plugins ที่ต้องการ (react, unicorn, typescript, oxc, import, jest, vitest, jsx-a11y, nextjs — native ใน Rust)
2. กำหนดผ่าน `plugins` field ใน config
3. ตั้งค่า categories สำหรับ severity

### 5. Configure JS Plugins (Optional)

> Goal: กำหนด JavaScript plugins ผ่าน `jsPlugins` field

1. ติดตั้ง ESLint plugin ที่ต้องการ — Oxlint JS plugin API เข้ากันได้กับ ESLint v9+ ส่วนใหญ่ใช้ได้ทันที (alpha — ไม่อยู่ภายใต้ semver, พฤติกรรมต่างจาก ESLint ให้ report bug)
2. กำหนดผ่าน `jsPlugins` field ใน config — path เป็น import specifier ใดก็ได้ (`./plugin.js`, `eslint-plugin-foo`, `@foo/eslint-plugin`) resolve relative กับ config file
3. ใช้ custom name สำหรับ reserved plugin names

### 6. Verify

> Goal: ทดสอบ plugins กับ oxlint

1. รัน `oxlint` เพื่อทดสอบ plugins
2. ตรวจสอบว่า rules ทำงานได้ถูกต้อง

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-to-dev-branch`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Config File

- ใช้ `.oxlintrc.json` หรือ `oxlint.config.ts`
- วางไฟล์ที่ root ของโปรเจกต์
- oxlint จะ detect config file อัตโนมัติ

### 2. Built-in Plugins

- ใช้ `plugins` field สำหรับ native plugins
- ตั้งค่า plugins จะ overwrite default plugin set
- ระบุทุก plugin ที่ต้องการใน array
- ใช้ CLI flag เช่น `--import-plugin` สำหรับ enable plugin

### 3. JS Plugins

- ใช้ `jsPlugins` field สำหรับ JavaScript plugins — ผสม string (`"eslint-plugin-foo"` ใช้ชื่อ derive จาก specifier) กับ object (`{ "name": "alias", "specifier": "eslint-plugin-foo" }`) ใน array เดียวกันได้
- JS plugins อยู่ใน alpha stage ไม่ subject to semver
- ใช้ custom name (object form) สำหรับ reserved plugin names

### 4. Reserved Plugin Names

- Default-on: `eslint`, `typescript`, `unicorn`, `oxc`; opt-in: `react`, `react-perf`, `nextjs`, `import`, `jsdoc`, `jsx-a11y`, `node`, `promise`, `jest`, `vitest`, `vue`
- เหล่านี้ implemented natively ใน Rust — `plugins: []` ปิดทั้งหมด; enable ผ่าน CLI `--<name>-plugin`, disable `--disable-<name>-plugin`
- ต้องใช้ custom name ถ้าต้องการ JavaScript version

### 5. Categories

- Oxlint เปิด `correctness` เป็น default; severity values: `"off"`/`"allow"`, `"warn"`, `"error"`/`"deny"` — fields อื่นที่เกี่ยวข้อง: `rules`, `overrides` (ตาม file pattern), `settings` (แชร์ข้าม rules); CLI `-A`/`--allow` ปิด rule/category
- correctness: Code ที่ผิดหรือไม่มีประโยชน์แน่นอน
- suspicious: Code ที่น่าจะผิดหรือไม่มีประโยชน์
- pedantic: Rules เข้มข้นที่อาจมี false positives
- perf: Rules สำหรับปรับปรุง runtime performance
- style: Rules สำหรับ style ที่เป็นไปในทิศทางเดียวกัน
- restriction: Rules ที่ห้าม patterns หรือ features เฉพาะ
- nursery: Rules ที่อยู่ระหว่างพัฒนาอาจเปลี่ยนแปลง

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-tool-eslint ถ้าจำเป็น
- ใช้ /run-lint ถ้าจำเป็น
- ใช้ /run-format ถ้าจำเป็น

## Expected Outcome

- Config file สร้างขึ้นที่ root
- Built-in plugins กำหนดอย่างถูกต้อง
- JS plugins กำหนดอย่างถูกต้อง (ถ้าใช้)
- Rules ทำงานได้เมื่อรัน `oxlint`

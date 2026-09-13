---
name: follow-create-plugins-storybook-addon
description: สร้าง Storybook addon — manager UI, preview decorators, preset และ publish
argument-hint: "[addon-name]"
related:
  - follow-create-sdk
  - review-dependencies
  - follow-tool-release-it
  - ship
---

## Goal

สร้าง Storybook addon ตาม official architecture — manager API (panels/tools/tabs), preview decorators, preset และ packaging ที่ publish ได้

## Scope

ใช้สำหรับ project ที่ต้องการสร้าง Storybook addon ใหม่ หรือแปลง feature เดิมให้เป็น addon

- Latest: Storybook `10.6.0` (verified 2026-09-12) — addon API notes below อิง Storybook 9.x (`storybook/manager-api` ฯลฯ); ตรวจ SB10 migration guide ก่อนใช้
- Storybook 9 ใช้ imports จาก `storybook/manager-api`, `storybook/theming`, `storybook/internal/components` — **ห้ามใช้** `@storybook/addons`, `@storybook/api` (deprecated)
- `@storybook/addon-kit` ถูก archive แล้ว — scaffold ด้วยมือตาม structure ด้านล่าง

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/review-dependencies` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review libraries ที่จะใช้ (react, storybook version, bundler)
3. ตรวจว่า target Storybook version ตรงกับ API ที่ใช้ (9.x = `storybook/manager-api`)

### 2. Prepare

> Goal: ตรวจสอบ requirements ก่อนเริ่ม

1. Node >= 18, Bun/pnpm/npm พร้อมใช้
2. มี Storybook project สำหรับ test local (หรือสร้าง sandbox `bunx storybook@latest init` ใน subfolder)
3. ตั้งชื่อ package `storybook-addon-<name>` — prefix นี้จำเป็นสำหรับ addon catalog

### 3. Addon Structure

> Goal: สร้างโครง addon มาตรฐาน

```text
src/
  constants.ts     — ADDON_ID, PANEL_ID, TOOL_ID, PARAM_KEY, EVENTS
  manager.ts       — addons.register() + addons.add() (manager UI)
  preview.ts       — decorators / globals (preview-side)
  preset.ts        — managerEntries, previewAnnotations (node-side)
  index.ts         — public API exports
  components/      — React components สำหรับ panel/tool UI
```

### 4. Manager Side

> Goal: register addon ใน manager UI

1. `src/manager.ts` ใช้ `addons.register(ADDON_ID, api => ...)` จาก `storybook/manager-api`
2. เพิ่ม UI types ตามต้องการ:
   - `types.PANEL` — panel ใน addons panel (ใช้ `AddonPanel` จาก `storybook/internal/components`)
   - `types.TOOL` — toolbar button (ใช้ `ToggleButton`/`IconButton`)
   - `types.TAB` — tab ระดับ story
   - `types.SIDEBAR_BOTTOM`/`types.experimental_SIDEBAR_TOP` — sidebar
3. ใช้ `useGlobals`, `useStorybookApi`, `useChannel` สำหรับ state + communication
4. ตั้ง keyboard shortcut ผ่าน `api.setAddonShortcut()`
5. icons ใช้ `@storybook/icons`, theming ใช้ `storybook/theming` (`styled`, `themes`)

### 5. Preview Side

> Goal: ส่ง decorators/globals เข้า preview iframe

1. `src/preview.ts` export `decorators`, `globals`, `initialGlobals` ตามต้องการ
2. ใช้ `makeDecorator` จาก `storybook/preview-api` สำหรับ decorator ที่อ่าน parameters
3. สื่อสาร manager↔preview ผ่าน `useChannel` + `addons.getChannel()` (events ใน constants)

### 6. Preset And Packaging

> Goal: package addon ให้ Storybook resolve ได้

1. `package.json` ต้องมี `bundler` field:

```json
{
  "bundler": {
    "exportEntries": ["src/index.ts"],
    "managerEntries": ["src/manager.ts"],
    "previewEntries": ["src/preview.ts"],
    "nodeEntries": ["src/preset.ts"]
  },
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./manager": "./dist/manager.js",
    "./preview": "./dist/preview.js",
    "./preset": "./dist/preset.js",
    "./package.json": "./package.json"
  },
  "files": ["dist/**/*", "README.md"],
  "keywords": ["storybook", "storybook-addon", "storybook-addons"],
  "devDependencies": { "storybook": "^9.0.0" }
}
```

2. build ด้วย `tsup` (entries ตาม bundler field) — `tsup src/index.ts src/manager.ts src/preview.ts src/preset.ts --format esm,cjs --dts`
3. `storybook` ต้องเป็น `devDependency`/`peerDependency` — ห้าม bundle storybook packages เข้า dist

### 7. Test Locally

> Goal: verify addon ทำงานจริงใน Storybook

1. ลิงก์ addon เข้า test project: เพิ่มใน `.storybook/main.ts` → `addons: ['<path-or-package>']`
2. รัน `storybook dev` → เช็ค panel/tool/tab render ถูก, globals toggle ได้, channel events ส่งถึงกัน
3. เช็ค production build: `storybook build` ต้องไม่พัง
4. ใช้ `/capture-all-components-all-routes` capture panel UI เป็น evidence ถ้าต้องการ

### 8. Publish

> Goal: publish addon เข้า catalog

1. ใช้ `/follow-tool-release-it` หรือ `/follow-tool-auto-it` สำหรับ release flow
2. เพิ่ม `"keywords": ["storybook-addons"]` เพื่อให้ขึ้น addon catalog อัตโนมัติ
3. มี `README.md` พร้อม usage + screenshot — catalog ดึงจาก npm

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. API Correctness

- Storybook 9: ใช้ `storybook/manager-api`, `storybook/preview-api`, `storybook/theming`, `storybook/internal/components` เท่านั้น
- ห้าม import จาก `@storybook/addons`, `@storybook/api`, `@storybook/components` (ถูกย้าย/deprecated)
- `@storybook/icons` ยังใช้ได้ปกติ

### 2. Architecture Separation

- manager code ห้าม import preview-only code และกลับกัน — แชร์ผ่าน `constants.ts` เท่านั้น
- `src/preset.ts` เป็น node-side — ห้าม import React/browser APIs
- addon ต้องทำงานโดยไม่ต้อง config เพิ่มใน user project (convention over config)

### 3. Packaging

- `bundler` field ใน package.json เป็น required สำหรับ entry resolution
- ห้าม bundle `storybook`, `react`, `react-dom` เข้า dist — ใช้ peer/dev deps
- keyword `storybook-addons` จำเป็นสำหรับ catalog

## References

- Writing addons: https://storybook.js.org/docs/addons/writing-addons
- Addon API (manager): https://storybook.js.org/docs/addons/addons-api
- Addon migration guide: https://storybook.js.org/docs/addons/addon-migration-guide
- ใช้ Context7 `/storybookjs/storybook` ถ้าต้องการ docs เพิ่มเติม

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น

## Expected Outcome

- Addon ที่ register panel/tool/tab ทำงานใน Storybook 9
- Structure มาตรฐาน: `manager.ts`, `preview.ts`, `preset.ts`, `constants.ts`
- `package.json` มี `bundler` + `exports` + `keywords` ครบ publish ได้
- Tested ใน local Storybook project ทั้ง dev และ build

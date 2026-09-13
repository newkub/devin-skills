---
name: follow-tool-tsdown-migrate-from-tsup
description: Migrate tsup → tsdown — config translation, verify build
argument-hint: "[project-path]"
related:
  - follow-tool-tsdown
  - follow-tool-rolldown
  - check-deprecated-apis
  - report-before-after
---

## Goal

ย้าย tsup config ไป tsdown โดย output เทียบเท่าเดิม — ใช้ migration tool ก่อนแล้วแก้ส่วนที่เหลือด้วยมือ, rollback ได้

## Scope

- ใช้กับ library projects ที่มี `tsup.config.*` หรือ `tsup` ใน `package.json`
- ครอบคลุม `tsdown-migrate`, config option mapping, verify output
- project ใหม่ที่ไม่เคยใช้ tsup → ใช้ `subskills/setup-tsdown/SKILL.md`

## Execute

### 1. Baseline And Plan

> Goal: เก็บ state เดิมก่อนย้าย

1. อ่าน `tsup.config.*` / `tsup` field ใน `package.json` — list `entry`, `format`, `dts`, `external`, `esbuildOptions`, `onSuccess`, hooks
2. รัน `tsup` build เก็บ `dist/` file list + sizes เป็น baseline
3. อ่าน official migration guide ใน tsdown docs — ทำ `/learn` (web) ถ้าไม่แน่ใจ
4. commit state ก่อนเริ่ม — rollback path ต้องพร้อม

### 2. Run tsdown-migrate

> Goal: ใช้ official migration tool ก่อน manual edit

1. รัน `bunx tsdown-migrate` — tool แปลง `tsup.config.*` → `tsdown.config.ts` และปรับ `package.json`
2. review diff ทั้งหมดที่ tool ทำ — อย่า trust โดยไม่ตรวจ
3. ติดตั้ง `tsdown` ตามที่ tool ระบุ (`bun add -D tsdown`)

### 3. Manual Config Translation

> Goal: options ที่ tool ไม่ครอบคลุม

1. map options เหลือ: `esbuildOptions` → rolldown/hooks equivalents ตาม docs, `onSuccess` → hook ที่ tsdown รองรับ, `define`/`env` → ตรวจ counterpart
2. esbuild plugins ของ tsup → ต้องเป็น Rolldown/unplugin plugins — ดู official docs
3. options ที่ไม่มี counterpart → flag ชัดเจนใน report

### 4. Update Package Metadata

> Goal: scripts/exports ชี้ tsdown

1. scripts: `tsup` → `tsdown`, `tsup --watch` → `tsdown --watch`
2. ตรวจ `exports`/`main`/`types` ตรง output ที่ tsdown สร้าง — naming อาจต่างจาก tsup
3. ลบ `tsup` dep หลัง verify ผ่านเท่านั้น

### 5. Verify Output

> Goal: output เทียบเท่า tsup build

1. รัน `bun run build` → ผ่าน
2. compare `dist/` กับ baseline: file list, formats, `.d.ts` ครบ
3. import/require ทุก entry ใน consumer + รัน tests
4. ผ่าน → ลบ tsup config + dep, แยก commit, report `/report-before-after`
5. ไม่ผ่านใน 3 รอบ → rollback (tsup setup ยังอยู่ใน git history) แล้ว report

## Rules

### 1. Safety

- ใช้ `tsdown-migrate` ก่อน manual edit เสมอ
- migration แยก commit — ห้ามผสม feature work

### 2. Fidelity

- output formats/`.d.ts`/sourcemap ต้องเทียบเท่า tsup เดิม
- esbuild plugins ไม่ทำงานบน tsdown โดยตรง — ต้อง map ไม่ใช่ copy

## Expected Outcome

- `tsdown.config.ts` แทน tsup config, build ผ่าน output เทียบเท่า
- `tsup` dep ถูกลบ, scripts ชี้ tsdown

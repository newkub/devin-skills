---
name: follow-tool-biome-migrate-from-eslint-prettier
description: Migrate ESLint/Prettier → Biome — rules mapping, incremental, verify
argument-hint: "[project-path]"
related:
  - follow-tool-biome
  - follow-tool-eslint
  - deep-impact
  - run-lint
  - report-before-after
---

## Goal

ย้าย ESLint (+ Prettier) ไป Biome อย่าง incremental — `biome migrate` แปลง rules อัตโนมัติ, verify ว่า coverage เทียบเท่า, rollback ได้

## Scope

- ใช้กับ projects ที่มี `.eslintrc*`/`eslint.config.*` และ/หรือ `.prettierrc*`
- ครอบคลุม `biome migrate eslint`, `biome migrate prettier`, rules mapping, incremental adoption
- ถ้าต้องรัน ESLint คู่ Biome ชั่วคราว → วางแผน overlap ใน step 4

## Execute

### 1. Baseline

> Goal: รู้ coverage เดิมก่อนย้าย

1. รัน `eslint .` เก็บ error/warning counts ต่อ rule (ใช้ `--format json` ถ้าต้องการ diff ละเอียด)
2. รัน `prettier --check .` เก็บสถานะ format เดิม
3. list ESLint configs + plugins ทั้งหมด — ทำ `/deep-impact` ถ้า monorepo
4. commit state ก่อนเริ่ม — rollback path ต้องพร้อม

### 2. Install Biome And Migrate

> Goal: ใช้ official migrate commands

1. `bun add -D @biomejs/biome` แล้ว `bunx biome init` ถ้ายังไม่มี config
2. รัน `bunx biome migrate eslint --write` — แปลง ESLint config → Biome rules
3. รัน `bunx biome migrate prettier --write` — แปลง Prettier config → formatter options
4. review diff ที่ tool สร้าง — tool แปลงเฉพาะ rules ที่มี equivalent ที่เหลือต้องตัดสินใจเอง

### 3. Map Remaining Rules

> Goal: จัดการ rules ที่ไม่มี equivalent

1. list ESLint rules ที่ migrate ไม่ได้ — เช็ค Biome rules docs ว่ามี equivalent หรือไม่
2. plugin rules (react, import, ฯลฯ) → เช็ค Biome linter rules/domains ที่ครอบ
3. rules ที่ไม่มีใน Biome → ตัดสินใจ: ยอมรับ coverage ต่ำลง, เก็บ ESLint เฉพาะ rules นั้น, หรือใช้ Biome plugin — ดู official docs
4. เขียน mapping table ไว้ใน report

### 4. Incremental Adoption

> Goal: สลับทีละขั้น ไม่ big-bang

1. เปิด `biome check` บนไฟล์/โฟลเดอร์ทีละส่วนผ่าน `files.includes`/`overrides` ใน `biome.jsonc`
2. ระยะ transition: ESLint รันคู่ใน CI ได้ — ปิด rules ที่ Biome ครอบแล้วใน ESLint config เพื่อกัน double-report
3. formatter: สลับ Prettier → Biome format ทีเดียว (format diff ใหญ่ — เตรียม format commit แยก)
4. อัปเดต editor settings: disable ESLint/Prettier extensions บน scope ที่ Biome ครอบแล้ว

### 5. Verify And Clean Up

> Goal: Biome ครอบเทียบเท่า แล้วลบของเก่า

1. รัน `bunx biome check .` → diagnostics สมเหตุสมผลเทียบ ESLint baseline
2. รัน test suite — auto-fix อาจเปลี่ยน code ต้อง test
3. ผ่านครบ → ลบ `eslint`/`prettier` deps + configs, อัปเดต CI ไป `biome ci` — แยก commit
4. ไม่ผ่าน → เก็บ ESLint ไว้บน rules ที่ยังต้องการ, report สิ่งที่ค้าง

## Rules

### 1. Safety

- ใช้ `biome migrate` commands ก่อน manual edit เสมอ
- format commit แยกจาก logic changes
- ห้ามลบ ESLint จนกว่า verify coverage ผ่าน

### 2. Coverage

- report ต้องระบุ rules ที่หายไปชัดเจน — อย่าอ้าง "migrate สมบูรณ์" ถ้ามี rules ที่ไม่ได้ map
- auto-fix ของ Biome อาจต่างจาก ESLint — review fix diff ก่อน commit

## Expected Outcome

- `biome.jsonc` ครอบ lint+format เทียบเท่า ESLint/Prettier เดิม
- rules mapping ชัดเจน — รู้ว่าอะไรหายไปและทำไม
- CI รัน `biome ci`, deps เก่าถูกลบ (หรือเก็บไว้พร้อมเหตุผล)

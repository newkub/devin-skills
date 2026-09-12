---
name: follow-tool-eslint-migrate-to-oxlint
description: Migrate ESLint → oxlint — coverage check, side-by-side, switch, rollback
argument-hint: "[project-path]"
related:
  - follow-tool-eslint
  - run-lint
  - check-deprecated-apis
  - report-before-after
---

## Goal

ย้าย linting จาก ESLint ไป oxlint อย่างปลอดภัย — เช็ค rule coverage ก่อน, รันคู่กันช่วง transition, สลับเมื่อพร้อม, rollback ได้

## Scope

- ใช้กับ projects ที่มี ESLint setup และต้องการลด lint time ด้วย oxlint
- ครอบคลุม coverage assessment, `.oxlintrc.json`, side-by-side run, switch ใน CI, rollback
- oxlint ไม่ครอบทุก ESLint rules/plugins — migration อาจลงเอยเป็น "oxlint หลัก + ESLint เฉพาะ rules ที่เหลือ"

## Execute

### 1. Assess Coverage

> Goal: รู้ว่า rules ไหน oxlint ครอบ

1. list ESLint rules/plugins ที่เปิดจาก `eslint.config.*` — ใช้ `eslint --print-config` ถ้าต้องการ effective rules
2. เช็ค oxlint rule coverage ใน official docs — oxlint รองรับ rules จาก eslint, typescript, react, unicorn, import ฯลฯ แต่ไม่ครบ
3. แบ่ง rules เป็น covered / not covered / partial — เขียน mapping table
4. ถ้า critical rules ไม่ครอบ → วางแผน hybrid หรือหน่วง migration

### 2. Install And Configure oxlint

> Goal: oxlint รันขนาน ESLint ได้

1. `bun add -D oxlint` หรือ package manager ที่ project ใช้
2. สร้าง `.oxlintrc.json` — map plugins/categories/rules จาก ESLint config (ดู official docs สำหรับ config fields และ migration aids)
3. ใช้ `eslint-plugin-oxlint` ใน ESLint config เพื่อปิด rules ที่ oxlint ครอบแล้ว — กัน double-report ระหว่าง transition (ดู parent skill `references/oxlint.md`)

### 3. Run Side-By-Side

> Goal: compare diagnostics ก่อนสลับ

1. รัน `bunx oxlint` + `bunx eslint .` → compare findings
2. findings ที่ oxlint miss แต่ ESLint จับ = coverage gap — ตัดสินใจต่อ rule
3. วัด lint time ทั้งสอง — เก็บตัวเลขไว้ report
4. ระยะ transition: CI รันทั้งคู่ — oxlint เป็น fast gate, ESLint เฉพาะ rules ที่ยังต้องการ

### 4. Switch

> Goal: oxlint เป็น primary linter

1. อัปเดต package scripts: `"lint": "oxlint"` (และ `lint:eslint` ถ้าเก็บ hybrid)
2. อัปเดต CI: รัน oxlint เป็น required check — ถ้า hybrid ให้ ESLint เป็น job แยก
3. ตั้ง editor integration ตาม official docs (oxlint extension/LSP)
4. ถ้า coverage เพียงพอ → ลบ ESLint deps/config แยก commit; ถ้า hybrid → document rules ที่ ESLint ยังรับผิดชอบ

### 5. Verify And Rollback Path

> Goal: lint gate เทียบเท่าเดิม

1. รัน lint บน codebase ทั้งหมด → ไม่มี regression ใน findings ที่ตั้งใจครอบ
2. ทดสอบ `--fix` behavior ถ้าใช้ auto-fix
3. rollback path = คืน scripts/CI ไป ESLint (config เก่ายังอยู่ใน git history) — verify ว่าทำได้
4. report `/report-before-after`: lint time, rule coverage, decisions

## Rules

### 1. Coverage First

- ห้ามสลับก่อนเช็ค coverage — oxlint ไม่ใช่ drop-in replacement ครบ 100%
- rules ที่ oxlint ไม่ครอบต้องมีแผนชัดเจน: ESLint hybrid หรือยอมรับ

### 2. Transition

- side-by-side ก่อนสลับเสมอ — `eslint-plugin-oxlint` ปิด rules ที่ซ้ำ
- แยก commit: add oxlint → switch scripts/CI → remove ESLint
- ถ้า oxlint findings ต่างจาก ESLint มาก → หยุด review ก่อนสลับ

## Expected Outcome

- oxlint รันเป็น primary linter — lint time ลดลงอย่างมีนัยสำคัญ
- coverage mapping ชัดเจน — rules ที่ยังอยู่บน ESLint (ถ้ามี) ถูก document
- rollback path verified

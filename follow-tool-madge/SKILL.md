---
name: follow-tool-madge
description: Audit dependencies and circular imports with Madge
argument-hint: [path/to/module]
related:
- run-verify
- run-test
- run-scan
---

# Follow Tool Madge

## Goal

ใช้ `madge` วิเคราะห์ dependency graph ของ module — หา circular imports, orphan files, และ leaf/dependency queries แล้วส่งรายการที่ต้องแก้กลับให้คนขอ

## Scope

ใช้สำหรับ project JS/TS ที่ติดตั้ง `madge` แล้ว ครอบคลุม circular detection, per-file dependency queries, การ render graph และ CI gating — `madge` เช็ค dependency structure เท่านั้น; unused exports/files detection ใช้ `knip` และ jscpd ใช้สำหรับ duplicate code (ต่าง purpose)

- Latest: `madge@8.0.0` (npm, verified 2026-09-13)

## Execute

### 1. Check Prerequisites
> Goal: ให้แน่ใจว่า madge พร้อมรันก่อนสั่ง scan

```sh
madge --version
```

- ถ้า `command not found` → แนะนำ `npm install --save-dev madge` (รองรับ `pnpm`/`bun`) — ไม่ต้องติดตั้ง global
- ถ้า project ใหญ่และใช้ TS: มี `tsconfig.json` ให้ส่งผ่าน `--ts-config`

### 2. Run Circular Detection
> Goal: หา circular dependencies ที่ต้องแก้

```sh
madge --circular src/
madge --circular --ts-config tsconfig.json --extensions ts,tsx src/
```

- Circular imports ทำให้ bundle ใหญ่ขึ้น, init order ผิด และ test isolation แตก
- ถ้าเจอ cycle → list คู่ไฟล์ที่วนซ้ำให้คนขอตัดสินใจ (extract shared module / ใช้ dependency injection / ย้าย type-only import ด้วย `import type`)

### 3. Run Dependency Queries
> Goal: หา orphans, leaves และ dependents ของไฟล์เป้าหมาย

```sh
madge --orphans src/
madge --leaves src/
madge --depends path/to/file.ts src/
```

- `--orphans` = files ไม่มีใคร import → candidate สำหรับลบ
- `--leaves` = files ที่ไม่ import ใคร → leaf utilities/entry points
- `--depends` = ไฟล์ใดบ้างที่ (transitively) import target — ใช้วัด blast radius ก่อน refactor

### 4. Export And Render Graph
> Goal: สร้าง output ที่ใช้ต่อได้ (JSON สำหรับ CI/script, image สำหรับ review)

```sh
madge --json src/ > deps.json
madge --image graph.svg src/
madge --image graph.svg --layout dot --extensions ts,tsx src/
```

- `--image` ต้องมี Graphviz (`dot` binary) — ถ้าไม่มีให้ข้ามหรือใช้ `--json` แทน
- `--extensions ts,tsx` บังคับ parse เฉพาะ extension ที่ระบุ; `--exclude <regex>` ตัด path ออก
- `--warning` แสดง skipped files; `--debug` ดู parse details เมื่อผลดูแปลก

### 5. Wire Into CI
> Goal: fail pipeline เมื่อเกิด circular dependency ใหม่

```sh
madge --circular --exit-code 1 --extensions ts,tsx src/
```

- Default exit code คือ 0 แม้เจอ circular — ต้อง `--exit-code` (หรือ `--no-color` ร่วมกับ pipe)
- ใส่ใน CI lint job หรือ hook; ถ้า repo มี `.moon/workspace.yml` รันผ่าน moon task และ gate ด้วย `vcs.hooks`
- สำหรับ repo อื่นใช้ `hk` หรือ `lefthook` ถ้าต้องการ hook-level check

### 6. Verify
> Goal: ยืนยันผลก่อนรายงาน

- ถ้าเจอ circular → สรุปจำนวน cycle + ไฟล์ที่เกี่ยว + แนวทางแก้
- รัน `/run-verify` (build/typecheck/tests) เพื่อยืนยันไม่มีอะไรพังหลังแก้ cycle; ถ้าแก้โค้ดแล้วรัน `/run-test` เฉพาะ module ที่แตะ
- รัน `/run-scan` เมื่อต้องการ audit เพิ่ม (unused deps, secrets, lint)

## Rules

- ต้องมี `src/` path หรือ path ที่คนขอให้มา — ถ้าไม่มีให้ถามก่อน
- รายงาน circular ให้คนขอแก้ — อย่า refactor เองโดยไม่ได้รับมอบหมาย
- `--exit-code` ต้องมีใน CI เสมอ (default = 0)

- ใช้ `/run-verify` เมื่อต้องการยืนยัน build/typecheck/tests หลังแก้ cycle
- ใช้ `/run-test` เมื่อต้องการยืนยัน module ที่แตะหลัง refactor
- ใช้ `/run-scan` เมื่อต้องการ audit เพิ่มเติมนอกเหนือ dependency graph

## Expected Outcome

- Dependency graph report พร้อม circular list และ file impact
- Orphans/leaves candidates สำหรับ cleanup
- JSON/image artifact สำหรับ CI หรือ review

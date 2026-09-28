---
name: review-sdk-update-exports
description: Fix package exports surface — exports map, types condition, attw/publint verify
argument-hint: "[package-or-scope]"
related:
  - review-sdk
  - check-backward-compatibility
  - run-build
  - run-test
  - report-before-after
---

## Goal

แก้ exports findings จาก `/review-sdk` จริง — `exports` map ถูกต้อง types resolve และ consumers import ได้ตามตั้งใจ

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: `exports` map, `types` conditions, CJS/ESM dual surface, internal path hiding, semver impact

## Execute

### 1. Baseline

> Goal: รู้ surface ปัจจุบันก่อนแก้

ทำตาม `../../references/exports.md` + `../../references/packaging.md`

1. run `publint` + `attw --pack` — baseline errors/warnings
2. list current entrypoints + findings (missing subpaths, wrong types resolution)
3. flag breaking changes → `/check-backward-compatibility` first

### 2. Fix Exports Map

> Goal: surface ตรง intent

1. `exports` conditions order ถูก — `types` ก่อน `import`/`require`/`default`
2. subpaths ครบที่ตั้งใจ public — internals ซ่อนด้วย map (ไม่มี `*` wildcard leak)
3. dual ESM/CJS — interop ถูก (default export interop, file extensions)
4. `types` condition ต่อ subpath — `.d.ts` resolve ทุก entry

### 3. Verify

> Goal: packaging tools ผ่าน + consumer smoke

1. `publint` clean + `attw --pack` errors เหลือ 0
2. smoke install ใน fresh project — `import`/`require` ทุก entrypoint resolve + types work
3. `/run-build` + `/run-test` ผ่าน + `/report-before-after` — attw/publint results

## Rules

- exports changes เป็น breaking เมื่อ consumers พึ่ง subpaths เดิม — semver bump + migration note
- `types` ต้องแก้ condition order ไม่ใช่ fallback hack
- preserve entrypoints ที่ client ใช้จริง — ลบได้เฉพาะ undocumented internals
- verify consumer-side (`attw`) ไม่ใช่แค่ build ผ่าน

## Expected Outcome

- `attw --pack` + `publint` clean
- Exports map resolve ถูกทุก condition พร้อม types

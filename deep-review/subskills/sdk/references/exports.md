# Exports Checklist — review-sdk

## Exports Map

- [ ] `exports` field ครบ — `.` entry + ทุก intended subpath (`./utils`, `./types`)
- [ ] condition order ถูก — `types` ก่อน `import`/`require`/`default`
- [ ] ทุก subpath resolve ได้จริง — `require("pkg/sub")` + `import "pkg/sub"` ทำงาน
- [ ] ไม่มี `exports` ที่ชี้ไฟล์ไม่มีจริง (stale paths หลัง restructure)
- [ ] `main`/`module`/`types` legacy fields ตรงกับ `exports` — fallback consistency

## Internal Leakage

- [ ] deep imports ที่ไม่ declare — `pkg/dist/internal/x` reachable โดยไม่ตั้งใจ
- [ ] `_internal`/`private`/test fixtures ไม่ expose ผ่าน exports หรือ `files`
- [ ] `files` field whitelist — publish เฉพาะ `dist/`, `README`, `LICENSE`; src/tests/configs ไม่หลุด
- [ ] secrets ไม่หลุดใน package — `.env`, credentials, internal URLs ใน tarball

## Barrel Discipline

- [ ] named exports เท่านั้น — ไม่มี `export *` ที่ลาก internals ออกไปโดยไม่รู้
- [ ] public API stable surface — barrel re-export เฉพาะ intended API
- [ ] type exports แยกชัด — `export type` สำหรับ pure types (isolatedModules-safe)

## Tree-Shaking

- [ ] `sideEffects` ถูก — `false` เมื่อ pure, list เมื่อมี side-effect files
- [ ] import บางส่วนไม่ลากทั้ง package — per-module ESM structure
- [ ] no top-level side effects ใน modules ที่ claim pure

## Detection

- `npm pack --dry-run` — tarball contents
- `publint` — exports/files/types issues
- import smoke test ใน fresh project ทั้ง ESM และ CJS

Severity: secrets leak = Critical, unresolvable subpath = High, internal leak = Medium, sideEffects ผิด = Medium

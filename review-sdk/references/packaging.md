# Packaging And Interop Checklist — review-sdk

## publint Findings

- [ ] `npx publint` — no errors on types resolution, missing files, ESM/CJS interop
- [ ] `types` condition resolves to real `.d.ts` — ไม่ชี้ไฟล์หายหรือ `.ts` source
- [ ] `files` field ครบ — runtime files + types + README + LICENSE

## attw (arethetypeswrong) Findings

- [ ] `npx attw --pack` — types work ทุก consumer setup
- [ ] node16/nodenext — ESM types import ได้, CJS types import ได้
- [ ] bundler resolution — webpack/vite/rollup เห็น types
- [ ] no "masquerading as CJS/ESM" — type mismatch ระหว่าง runtime และ declarations

## Dual Publish

- [ ] ESM ไม่ import CJS โดยตรง — wrapper เท่านั้น
- [ ] CJS ไม่ import ESM — `require()` fails silently or wraps incorrectly
- [ ] no dual-package hazard — same module 2 copies ใน dep graph
- [ ] `module`/`exports` conditions ไม่ขัดกัน — bundler เลือก ESM, Node เลือกตาม format

## Runtime Targets

- [ ] `engines` field ตรง claim — `"node": ">=18"` test จริงบน Node 18
- [ ] Bun/Deno compat ถ้า claim — import + core APIs ทำงาน
- [ ] browser build ถ้า claim — ไม่มี `fs`/`path`/`process` hard dep ใน browser path
- [ ] edge runtime (workers) ถ้า claim — no Node-only APIs

## Bundle And Deps

- [ ] bundle size budget — package ไม่ลาก deps หนัก (moment, lodash full, axios ใน thin wrapper)
- [ ] `bundlephobia` / `size-limit` check — install size + import size
- [ ] optional deps แยก `peerDependencies`/`optionalDependencies` ไม่บังคับติดตั้ง
- [ ] no polyfills bundled โดยไม่จำเป็น — target env supports natively

## Install Smoke

- [ ] `npm install <pkg>` ใน fresh dir — works ทั้ง ESM และ CJS
- [ ] `import` + `require` paths resolve — no missing files
- [ ] postinstall scripts ไม่พัง/ไม่ network-call โดยไม่จำเป็น

Severity: publint/attw errors = High, dual-package hazard = High, missing engines = Medium, bundle bloat = Medium

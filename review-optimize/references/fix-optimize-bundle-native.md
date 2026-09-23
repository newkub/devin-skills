# Fix Guide — Bundle And Native Build

## Goal

ลด initial parse + binary cost — slim imports, lazy heavies, release profile เหมาะสม

## Scope

ใช้กับ Vite/Rolldown/Webpack bundles และ Rust/native release profiles — preserve deliberate splitting เดิม

## Execute

### 1. Slim Full-Library Imports

> Goal: lib ที่มี core/subset ทางเลือก — ใช้เฉพาะที่ต้อง

1. `import hljs from "highlight.js"` → `highlight.js/lib/core` + `registerLanguage` เฉพาะภาษาที่ codebase map จริง — สร้าง shared instance เดียว (`utils/hljs.ts`)
2. ทุก consumer ใช้ instance เดียวกัน — `highlight`, `getLanguage`, `highlightAuto`, `registerLanguage` API เหมือนเดิม
3. `lodash` → `lodash-es` named imports; `moment` → `date-fns`/`Intl`; `@iconify-json/*/icons.json` → per-icon imports
4. grep ยืนยันไม่มี full import ค้าง — `from "highlight.js"` ต้องหมด
5. audit language/feature maps — ทุก key ที่ map ได้ต้องมี registered counterpart; ภาษาที่ไม่ register → fallback เหมือนเดิม

### 2. Verify Chunk Boundaries

> Goal: deliberate splits คงอยู่, entry เบาลง

1. รัน `/run-build` — เทียบ chunk sizes กับ baseline จาก scope step
2. เช็ค manual chunks ยังแยก heavies (mermaid, katex, xterm, icons) — ห้าม merge เข้า entry
3. build `target` ตรง runtime — WebView2/WKWebView modern → `es2022`; `reportCompressedSize: false` ลด build time
4. dynamic imports ของ features ยังเป็น separate chunks — ไม่มี eager chain กลับเข้า entry

### 3. Tune Native Release Profile

> Goal: runtime optimization โดยไม่จ่าย build time เกิน

1. `[profile.release]`: `opt-level = 3`, `lto = "thin"` (ไม่ fat — build นานมาก), `codegen-units = 1`, `strip = true`, `panic = "abort"`
2. dev profile: `debug = 0` ลด PDB/linker issues บน Windows
3. build scripts: รันเฉพาะเมื่อ config เปลี่ยน, skip expensive generation ใน dev
4. binary size — unused features/plugins off, embedded assets compress

### 4. Audit Eager Module Graph

> Goal: entry chain ไม่ดึงหนักมาก่อนจำเป็น

1. barrel files (`index.ts` re-export ทุกอย่าง) ที่ดึง heavy modules เข้า entry — split exports หรือ deep imports
2. side-effect imports (`import "./polyfill"`, CSS) — เช็ค `sideEffects` flag ใน package.json
3. top-level work ใน modules — code ที่รันตอน import (DOM queries, timers, connects) ที่ควร init lazily

### 5. Verify

> Goal: bytes ลด, runtime เหมือนเดิม

1. chunk table before/after — entry chunk, lib chunks, total dist
2. features ที่ใช้ slimmed lib ทำงานครบ — highlight ทุกภาษาที่เคย, icons render
3. typecheck + lint + tests + build ผ่าน
4. cold-start smoke — app เปิด, deep link, features lazy-load ได้

## Rules

- ทุก slimming ต้อง audit usage ก่อน — register/keep เฉพาะที่ code ใช้จริง ไม่ใช่เดา
- shared instance เดียวต่อ lib — ห้าม core+full instances ผสม (bundle รวมทั้งคู่)
- ห้ามลบ deliberate `manualChunks`/lazy boundaries — ดู comments ก่อน
- `codegen-units = 1` คุ้มสำหรับ runtime แต่ build ช้าขึ้น — ระบุ trade-off ใน report
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- full-lib chunks หดเป็น subset (เช่น highlight 978KB → ~140KB)
- entry chunk เบาลง, heavies ยัง lazy
- release binary optimize เต็มในงบ build time ที่ยอมรับได้

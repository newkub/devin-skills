---
name: scan-bundle
description: Scan bundle composition — full-library imports, chunking, eager deps
---

# Scan Bundle And Chunks

## Goal

initial parse น้อยลง — หนักไป lazy, full lib → subset, duplicate instances รวมกัน

## Checks

1. Full-library imports ที่มี core/subset ทางเลือก — `highlight.js` (→ `lib/core` + registered langs), `lodash` (→ `lodash-es` named), `moment` (→ `date-fns`/`Intl`), `@iconify-json/*/icons.json` (2-3MB JSON)
2. Same lib imported หลายรูปแบบ — full + core instances ใน code เดียวกัน → chunk รวมทั้งคู่
3. Heavy deps ที่ไม่ lazy — mermaid, katex, xterm, chart libs, media encoders — เช็คว่า route/feature chunk แยกอยู่
4. `manualChunks`/vendor split — deliberate splits (เช็ค comments) vs accidental merge ของหนักเข้า entry chunk
5. Entry chunk size — modules ที่ถูก eager import ผ่าน barrel files, `import *` 
6. Build target — `es2015`/legacy transpile ทั้งที่ runtime เป็น modern (WebView2, evergreen Chromium)
7. `reportCompressedSize`, sourcemap, cssMinify settings — build time + output size
8. Dependencies ใน `package.json` ที่ไม่มีใคร import — devDeps รั่วเข้า prod bundle

## Severity

- Critical: entry chunk > 1MB ที่ parse ก่อน interactive, full-lib import ที่ subset ได้ชัดเจน
- High: heavy feature lib ไม่ lazy, duplicate lib instances
- Medium: chunk split tuning, build target เก่า
- Low: tree-shake เล็กน้อย, dep cleanup

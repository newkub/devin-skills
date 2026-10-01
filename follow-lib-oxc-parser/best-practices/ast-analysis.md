# Best Practices: oxc-parser (AST Analysis)

แนวทาง parse JS/TS เป็น AST ด้วย Oxc NAPI binding ให้เร็วและถูกต้องสำหรับงาน analysis/tooling

## Recommended Patterns

- ใช้ `parseSync(filename, sourceText, options)` เป็น default — AST deserialization ทำบน main thread อยู่แล้ว async `parse()` มักช้ากว่า
- ตั้ง `filename` ให้ตรง extension จริง — parser เลือก dialect (`.ts`/`.tsx`/`.jsx`/`.mts`/`.cts`/`.d.ts`) จากชื่อไฟล์
- เช็ค `result.errors` ทุกครั้ง — parser เป็น error-tolerant ไม่ throw; code เสียยังได้ AST บางส่วน
- เดิน AST ด้วย `new Visitor({ NodeType(node) {} })` — declarative กว่า manual recursion
- อ่าน `result.module` สำหรับ import/export graph โดยไม่ต้อง walk AST เอง
- ใช้ `oxc-walker` เมื่อต้องการ walk utilities เพิ่ม (parent tracking, scope ง่ายๆ)
- Filter ไฟล์ก่อน parse — ข้าม `node_modules`, build output, ไฟล์ใหญ่เกินด้วย glob ก่อน

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `parseSync` ใน hot path | ใช้ `parse()` async หวัง parallelize — thread overhead เกินกำไร |
| Parallel ด้วย worker threads + `parseSync` | spawn thread per file โดยไม่ pool |
| เช็ค `result.errors` ก่อนใช้ AST | assume parse สำเร็จเสมอ |
| ใช้ `result.module` สำหรับ imports/exports | walk AST หา `ImportDeclaration` เองถ้าไม่จำเป็น |
| Cache parse result ตาม file hash/mtime | re-parse ทุกไฟล์ทุก run ของ incremental tool |
| เลือก oxc-parser เมื่อต้องการ full AST + types | ใช้ oxc-parser สำหรับ pattern match ง่ายๆ — ใช้ ast-grep |

## Common Pitfalls

- `filename` ผิด extension → dialect ผิด เช่น parse `.tsx` เป็น `.ts` ทำ JSX เจอ parse errors
- AST เป็น ESTree-compatible — แต่มี oxc-specific nodes บางส่วน; ตรวจ node type ก่อน assume ESTree ล้วน
- `parse()` async ไม่ได้เร็วกว่า — deserialization บน main thread; async เหมาะเฉพาะ I/O-bound
- `options.lang` override เมื่อ filename หลอก (เช่น parse content จาก stdin) — อย่าลืมตั้ง
- Bun compatibility: NAPI `.node` binary อาจมีปัญหา — ทดสอบก่อน, fallback `tsx`/Node
- AST ใหญ่กิน memory — ประมวลผลทีละไฟล์ ปล่อย AST ทิ้งหลังใช้ อย่าเก็บรวมทั้ง repo

## Performance Notes

- Oxc parse เร็วกว่า Babel ~3x และ SWC ~2x — sequential parse หลายพันไฟล์มักพอ ไม่ต้อง worker
- Worker threads เหมาะเมื่อไฟล์หลายหมื่นหรือ CPU-bound post-analysis หนัก
- `sourceType: 'unambiguous'` default ดี — ตั้งชัดเมื่อรู้ (ลด ambiguity detection)
- `showSemanticErrors` มี cost เพิ่ม — เปิดเฉพาะเมื่อต้องเช็คลึกกว่า syntax
- Streaming/early-exit: เจอข้อมูลที่ต้องการแล้ว stop walk — Visitor ไม่มี built-in bail, track flag เอง

## Ecosystem / Integration

- Pattern matching แบบ declarative rules → `/use-astgrep-programmatic` (kind/pattern/has/inside)
- Transform/compile → `oxc-transform`; minify → `oxc-minify`; resolve → `oxc-resolver`
- Print AST → code ด้วย `esrap` (`esrap/languages/ts`)
- Linting เต็มรูปแบบ → `oxlint` (package แยก)
- File traversal จำนวนมาก → `/use-scripts`

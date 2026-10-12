# Sonda — Best Practices

Bundle analyzer ที่อ่าน final source maps — สะท้อน tree-shaking/minification จริง ไม่ใช่ pre-build estimate

## Recommended Patterns

- เปิด `sourcemap: true` ใน build config ก่อนเสมอ — Sonda ไม่ทำงานถ้าไม่มี source maps
- `format: ['html', 'json']` — html สำหรับคนดู, json เป็น input ให้ scripts/CI และ `/report-bundle`
- `gzip: true` + `brotli: true` เมื่อเทียบขนาดที่ user โหลดจริง — ตัวเลข raw บอกเล่าไม่ครบ
- `deep: true` เมื่อต้องแตก dependencies เป็น source files ต้นทาง — หา dep ตัวใหญ่จริงใน vendor chunk
- `open: false` ใน CI/headless; เก็บ JSON report เป็น artifact เพื่อ diff ข้าม commits
- ใช้ `include`/`exclude` scope report เมื่อ monorepo output เยอะ — เช่น `include: [/\.js$/]`

## Common Pitfalls

- Vite CSS: Vite ไม่ generate source maps สำหรับ CSS → CSS ไม่โผล่ใน Sonda report (limitation, ไม่ใช่ bug config)
- `sources: true` embed source code เต็มใน report — report ใหญ่มากและรั่วโค้ดถ้า share ออกนอก
- `deep`/`sources`/`gzip`/`brotli` ทุกตัวเพิ่ม build time — อย่าเปิดหมดใน dev loop ที่ iterate บ่อย
- ค่า gzip/brotli เป็น estimate — เทียบ trend ข้าม builds ได้ แต่อย่าเอาไปเคลมเลข absolute กับ infra จริง
- Report ไม่เทียบ historical เอง — เก็บ JSON ต่อ commit/tag แล้ว diff เองถ้าต้องการ regression tracking

## Bundle Report Workflow

- `/report-bundle` ใช้ JSON output เป็น source of truth สำหรับตาราง chunks/dependencies — แม่นกว่า `du`
- Treemap view → หา chunk ใหญ่ผิดปกติ; dependency tree → trace ว่า dep เข้า bundle ผ่าน path ไหน
- Pair กับ `/follow-tool-node-modules-inspector` — Sonda บอกอะไรอยู่ใน bundle, inspector บอก versions/duplicates ใน `node_modules`

## Do / Don't

| Do | Don't |
|----|-------|
| enable sourcemaps ก่อนใช้ Sonda | expect report โดยไม่มี source maps |
| `format: 'json'` + `open: false` ใน CI | auto-open browser บน CI |
| scope ด้วย `include`/`exclude` | analyze ทุก asset ใน monorepo ใหญ่ |
| เก็บ JSON reports เป็น artifacts | rely on memory/eyeball ระหว่าง builds |
| share report หลังเช็ค `sources` ปิด | share report ที่ embed source code |

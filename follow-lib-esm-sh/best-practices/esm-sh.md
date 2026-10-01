# esm.sh — Best Practices

ESM CDN imports — pinning, stability และ prod-readiness discipline

## Recommended Patterns

- Pin versions เสมอ: `https://esm.sh/zod@3.25.76` — bare `esm.sh/pkg` = floating latest = non-reproducible
- ใช้ใน Bun/TS scripts ชั่วคราวหรือ edge workers ที่ไม่มี node_modules — production web apps ควร bundle แทน
- Subpath + query flags: `?bundle`, `?deps`, `?external`, `?target=es2022` — คุม output ตาม runtime
- Shared dep (react/solid) ต้อง `?external=` หรือ pin เวอร์ชันเดียวกันทุก import — มิฉะนั้น duplicate instances
- `?worker` suffix สำหรับ module ที่ต้องรันใน worker context

## Common Pitfalls

- Duplicate React/Solid instances = hooks break — import maps/`?deps`/`?external` เพื่อ dedupe
- CDN = runtime dependency บน network — offline/CI flaky → vendor หรือ bundle สำหรับ critical paths
- TS types: esm.sh serve types แต่ `bun`/tsserver ต้อง `?dts` หรือ import map เสริม — test typecheck จริง
- Version drift: script ที่ pin เก่า vs package.json ใหม่ → sync เมื่อ upgrade dep หลัก
- Cache headers แรง — pin version เปลี่ยน URL = bust cache ธรรมชาติ (ดี)

## Security / Supply Chain

- esm.sh = third-party CDN — code ไม่ผ่าน lockfile integrity; pin + ตรวจ source เมื่อใช้ข้อมูล sensitive
- ถ้า package มี postinstall/native binding → esm.sh ไม่รัน scripts — pure JS/WASM เท่านั้น

## Do / Don't

| Do | Don't |
|----|-------|
| pin `@x.y.z` ทุก import | `esm.sh/pkg` floating |
| `?deps`/`?external` dedupe shared libs | import react สองเวอร์ชัน |
| bundle/vendor สำหรับ prod | rely CDN บน critical path |
| `?target=` ตาม runtime | assume default target เข้ากันเสมอ |

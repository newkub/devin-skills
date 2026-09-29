---
name: scope-and-baseline
description: Scope target, capture baselines, inventory existing optimizations before scanning
---

# Scope And Baseline

## Goal

รู้ว่า optimize อะไร มี baseline วัดได้ และไม่ไปแตะ optimization ที่ตั้งใจไว้แล้ว

## Checks

1. ระบุ target จาก argument — app/package/feature; ถ้าไม่ชัด → `/ask-me` ถาม scope (ทั้ง app / เฉพาะ startup / เฉพาะ bundle / เฉพาะ runtime)
2. อ่าน entry points และ build config ก่อน: `package.json` scripts, `vite.config.*`, `Cargo.toml` `[profile.*]`, `tsup.config.*`, `wrangler.jsonc`, main/index file, mount/boot path
3. เก็บ baseline ที่วัดได้: `dist/` chunk sizes จาก `/run-build`, build time, test time, profiler output ถ้ามี — ไม่มี baseline = ไม่มี before/after ที่พิสูจน์ได้
4. Inventory existing optimizations — grep `lazy(`, `import(`, `manualChunks`, `debounce`, `throttle`, `requestIdleCallback`, `createMemo`, `useMemo`, pooling, `keep-alive` — สิ่งที่ codebase optimize ไว้แล้วคือ constraints
5. อ่าน comments ที่อธิบายเหตุผลของ optimization เดิม ("deliberate", "keep", "don't warm") — ห้าม undo โดยไม่วัด
6. ทำ `/check-bottlenecks` หรือ `/run-profiler` เมื่อต้องวัด hot path จริงก่อนแก้

## Severity

- Critical: ไม่มี baseline เลย + user ต้องการ proof of improvement
- High: existing optimization ถูกมองข้ามแล้ว fix ไป undo มัน
- Medium: scope กว้างเกินที่เวลาให้ครอบคลุม — ต้องตัดเป็น phases
- Low: missing profiler tool — scan จาก code patterns แทนได้

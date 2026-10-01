# Elysia — Best Practices

Bun-native web framework — type-safe routes, plugins และ lifecycle discipline

## Recommended Patterns

- `new Elysia()` + chain `.get`/`.post`/`.group` — group routes ด้วย prefix แทน flat list ยาว
- TypeBox schemas (`t.Object`, `t.String`) บน `body`/`query`/`params` — validation + type inference + OpenAPI ฟรี
- Plugins: `app.use(plugin)` สำหรับ reusable modules — plugin = `new Elysia().derive(...)` ที่ export
- `derive`/`decorate` สำหรับ request-scoped values (`derive` = computed per request) vs app-level (`decorate`)
- Lifecycle hooks: `onRequest` → `derive` → `beforeHandle` → handler → `afterHandle`/`onError` — รู้ลำดับเพื่อวาง logic ถูกจุด

## Common Pitfalls

- `derive` vs `decorate` สลับกัน: decorate = global object share (ระวัง mutation), derive = per-request
- `onError` ไม่ catch errors ที่ throw ใน `onRequest` เกิน early — วาง auth/validation ใน `beforeHandle`/`derive`
- Type inference chain พังถ้าไม่ chain ใน file เดียว — Elysia infer ผ่าน method chaining; export `app` เป็น `App` type สำหรับ Eden client
- Bun.serve manual บน Elysia app — ใช้ `.listen()` ของ Elysia หรือ `app.fetch` ตาม adapter

## Perf Notes

- Elysia เร็วบน Bun — keep handlers sync/async minimal; heavy CPU → offload worker
- `staticPlugin`/file serving ใช้ built-in แทน handler ที่ readFile เอง
- Schema validation has cost — validate เฉพาะ boundary ไม่ซ้ำทุก middleware

## Do / Don't

| Do | Don't |
|----|-------|
| `t.*` schemas ทุก input | validate มือใน handler |
| plugins สำหรับ reuse | copy-paste routes ข้าม modules |
| `derive` per-request state | mutate `decorate` objects ต่อ request |
| Eden treaty สำหรับ client types | re-declare API types ฝั่ง client |

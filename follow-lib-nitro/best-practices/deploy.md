# Nitro — Presets, Deploy และ Runtime Portability

## Recommended Patterns

### Preset Selection

- เลือก preset ตาม deploy target: `bun`, `node-server`, `cloudflare-module`, `deno-server`, `vercel`, `netlify`, edge providers อื่นๆ
- v3: `nitro()` vite plugin ไม่รับ `preset` option — ตั้งผ่าน `NITRO_PRESET` env หรือ `nitro.config.ts` เท่านั้น
- เลือกวิธีเดียว — `process.env.NITRO_PRESET ??= 'bun'` ใน vite.config ก่อน defineConfig หรือ `nitro.config.ts` — ห้ามตั้งขัดกัน
- preset ผิด = output รันไม่ได้บน target — เช็ค https://nitro.build/deploy สำหรับชื่อ preset ล่าสุด

### Build Output

- `bun run build` → `.output/` เป็น portable artifact — `bun .output/server/index.mjs` / `node .output/server/index.mjs` ตาม preset
- `.output/public/` serve static assets อัตโนมัติ — public dir ของ app map เข้าไป
- `.output/` เป็น generated — ห้าม commit, gitignore เสมอ
- portable = code เดียวกันรันได้ทุก runtime — conditional logic ผ่าน env vars ไม่ใช่ compile-time branches

### Cloudflare Bindings

- preset `cloudflare-module` → output เป็น Worker module — deploy ด้วย `wrangler deploy`
- declare bindings ใน `wrangler.jsonc`: `d1_databases`, `kv_namespaces`, `r2_buckets`, `vars`
- access ผ่าน `env.*` ใน handler — gen types ด้วย `wrangler types` → `worker-configuration.d.ts`
- secrets ผ่าน `wrangler secret put` เท่านั้น — ห้าม `vars` หรือ hardcode

### Custom Server Entry

- wrap `fetch` handler เมื่อต้อง middleware/custom logic:

```ts
export default {
  fetch(request: Request, env: unknown, ctx: unknown) {
    // pre-process → delegate to framework handler
  },
}
```

- ใช้สำหรับ auth, logging, request transformation ก่อนถึง framework handler

## Do / Don't

| Do | Don't |
|---|---|
| ตั้ง `NITRO_PRESET` env หรือ `nitro.config.ts` | ส่ง `preset` เข้า `nitro()` plugin options (v3 ไม่รับ) |
| เลือกวิธีตั้ง preset วิธีเดียว | env + config ขัดกัน |
| `.output/` ใน `.gitignore` | commit build artifacts |
| secrets ผ่าน `wrangler secret` / env | `vars` หรือ hardcode ใน config |
| conditional ผ่าน runtime env | compile-time branches ต่อ preset |
| gen `worker-configuration.d.ts` ด้วย `wrangler types` | เดา bindings types เอง |

## Common Pitfalls

- `nitro({preset: 'bun'})` → v3 ไม่รับ — ใช้ env หรือ config file
- `NITRO_PRESET` + `nitro.config.ts` ตั้งคนละค่า → behavior ไม่แน่นอน
- deploy Cloudflare โดยไม่ declare bindings → `env.X` undefined runtime
- assume Node APIs บน edge preset → `fs`, `path` ไม่มีบน Cloudflare — ใช้ portable APIs
- commit `.output/` → repo bloat + stale artifacts
- server entry `fetch` ไม่ delegate framework → app routes ไม่ทำงาน

## Performance Notes

- `.output` bundle เร็ว + cold start ต่ำบน edge presets — Nitro tree-shake ดี
- static assets ใน `.output/public/` serve จาก CDN/edge อัตโนมัติ — ไม่ต้อง CDN แยก
- code splitting: Nitro split routes/handlers — lazy load ตาม request path
- cache headers ตั้งผ่าน route rules หรือ custom entry — static assets มี defaults

## Ecosystem / Integration

- TanStack Start, Analog, Nuxt ใช้ Nitro อยู่แล้ว — skill นี้สำหรับ Nitro เมื่อต้อง config เองหรือเข้าใจ layer
- deploy docs: https://nitro.build/deploy — preset list + provider guides
- `/follow-service-cloudflare` สำหรับ deploy/secrets/rollback เชิงลึก
- `/follow-tool-vite` สำหรับ Vite config integration
- `/deep-research` ยืนยัน preset names ล่าสุด — Nitro เพิ่ม providers บ่อย

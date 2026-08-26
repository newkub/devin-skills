# Dependencies

## Runtime

- `bun` >= 1.3.0 — package manager และ runtime
- `vite` >= 5.0.0 — dev server และ bundler
- `vite-plugin-solid` — คอมไพล์ Solid TSX
- `solid-js` >= 1.9.0 — UI library
- `@tanstack/solid-router` — type-safe routing ตาม `/follow-solid-tanstack`
- `unocss` — atomic CSS ตาม `/follow-lib-unocss`
- `@iconify-json/mdi` — iconify Material Design icons สำหรับ `presetIcons`

## Optional

- `@wrikka/web-inspector` — inspect Solid components ใน dev mode
- `arktype` — runtime validation สำหรับ config

## External Services

- ไม่มี API key หรือ secret จำเป้น
- ใช้ local Vite server หรือ CDN สำหรับ runtime assets
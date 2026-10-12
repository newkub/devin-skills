| key | value |
|---|---|
| package | `takumi-js` |
| install | `bun add takumi-js` |
| stable version | 2.14.0 (verified 2026-10-03) |
| license | MIT / Apache-2.0 |
| docs | https://takumi.kane.tw/docs |
| repository | https://github.com/kane50613/takumi |

| api | description | signature/example |
|---|---|---|
| `render` | render JSX/HTML/node tree → image bytes (PNG, JPEG, WebP) | `await render(<div tw="w-full h-full" />, { width: 1200, height: 630 })` |
| `renderSvg` | render → SVG output | `await renderSvg(node, { width, height })` |
| `ImageResponse` | web `Response` subclass สำหรับ route handlers (API เหมือน `next/og`) | `import { ImageResponse } from 'takumi-js/response'` → `new ImageResponse(jsx, { width: 1200, height: 630 })` |
| `googleFonts` | โหลด Google Fonts ครั้งเดียว → `fonts` entries (รองรับ variable axes) | `import { googleFonts } from 'takumi-js/helpers'` → `fonts: googleFonts([{ name: 'Fraunces', weight: '100..900' }])` |
| `Renderer` | pre-register fonts/images ครั้งเดียว reuse ข้าม renders | `new Renderer({ fonts, images })` |
| `measure` | วัด layout ของ node tree ก่อน render | `await measure(node, { width, height, fonts })` |
| `tw` attribute | Tailwind utility classes บน JSX elements | `<div tw="flex items-center justify-center" />` |
| `fonts` option | font sources — bytes, descriptor, URL string | `{ fonts: [fontBytes \| { name, data, weight, style } \| urlString] }` |
| `format` option | output format PNG/JPEG/WebP/SVG หรือ animation WebP/APNG/GIF | `{ format: 'webp' }` |
| `paint tree` | export layout/paint tree ไป drawing API อื่น (เช่น PPTX writer) | ดู docs `/docs/paint-tree` |
| PDF generation | render documents เป็น PDF | ดู docs `/docs/pdf` |
| `@takumi-rs/core` | native binding (auto-selected บน Node/Bun) | bundled ใน `takumi-js` |
| `@takumi-rs/wasm` | WASM binding (auto-selected บน Workers/Edge/Deno/browser) | bundled ใน `takumi-js` |
| Nuxt OG Image renderer | ใช้ Takumi เป็น renderer ใน Nuxt OG Image | ดู https://nuxtseo.com/docs/og-image/renderers/takumi |

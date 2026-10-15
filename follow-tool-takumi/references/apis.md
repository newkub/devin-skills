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
| `ImageResponse` | web `Response` subclass for route handlers (same API as `next/og`) | `import { ImageResponse } from 'takumi-js/response'` → `new ImageResponse(jsx, { width: 1200, height: 630 })` |
| `googleFonts` | load Google Fonts once → `fonts` entries (supports variable axes) | `import { googleFonts } from 'takumi-js/helpers'` → `fonts: googleFonts([{ name: 'Fraunces', weight: '100..900' }])` |
| `Renderer` | pre-register fonts/images once and reuse across renders | `new Renderer({ fonts, images })` |
| `measure` | measure the layout of the node tree before render | `await measure(node, { width, height, fonts })` |
| `tw` attribute | Tailwind utility classes on JSX elements | `<div tw="flex items-center justify-center" />` |
| `fonts` option | font sources — bytes, descriptor, URL string | `{ fonts: [fontBytes \| { name, data, weight, style } \| urlString] }` |
| `format` option | output format PNG/JPEG/WebP/SVG or animation WebP/APNG/GIF | `{ format: 'webp' }` |
| `paint tree` | export the layout/paint tree to other drawing APIs (e.g. PPTX writer) | see docs `/docs/paint-tree` |
| PDF generation | render documents as PDF | see docs `/docs/pdf` |
| `@takumi-rs/core` | native binding (auto-selected on Node/Bun) | bundled in `takumi-js` |
| `@takumi-rs/wasm` | WASM binding (auto-selected on Workers/Edge/Deno/browser) | bundled in `takumi-js` |
| Nuxt OG Image renderer | use Takumi as the renderer in Nuxt OG Image | see https://nuxtseo.com/docs/og-image/renderers/takumi |

# Vite DevTools — API Reference

Source: <https://devtools.vite.dev/> (`/guide/`, `/kit/`, `/rolldown/`, `/vite/`, `/vitest/`, `/oxc/`, `/errors/`) + npm registry — verified 2026-10-14

## Packages

| Package | Latest | Role |
|---------|--------|------|
| `@vitejs/devtools` | `0.7.6` | ตัวหลักที่ เปิดใช้ผ่าน `devtools` option |
| `@vitejs/devtools-kit` | `0.7.6` | integration hub — dock, palette, terminals, `Plugin.devtools.setup` |
| `@vitejs/devtools-rolldown` | `0.7.6` | build analysis (module graph, chunks, assets, plugins) |
| `@vitejs/devtools-vite` | `0.7.6` | plugin inspector + module transforms (upstream: "work in progress") |
| `@vitejs/devtools-vitest` | `0.7.6` | Vitest UI ใน dock |
| `@vitejs/devtools-oxc` | `0.7.6` | Oxlint/Oxfmt inspector (donated from `yuyinws/oxc-inspector`) |

License MIT — VoidZero Inc. & Vite Contributors. ทั้งหมดออก version พร้อมกัน

## `devtools` Config Option

| Key | Type / Values | Default | หมายเหตุ |
|-----|---------------|---------|-----------|
| (shorthand) | `true` | off | เปิดทั้ง `vite dev` และ `vite build` |
| `apply` | `'all'` \| `'serve'` \| `'build'` | `'all'` | จำกัดเฉพาะคำสั่งที่ต้องการ |
| `embeddedVisibility` | `'normal'` \| `'passive'` \| `'hidden'` | `'normal'` | `passive`/`hidden` ใช้ `Shift + Alt + D`; `passive` จำสถานะที่เคยเปิด, `hidden` ไม่จำ |
| `dockPreferences.defaultMode` | string (เช่น `'edge'`) | — | layout เริ่มต้น; user แก้ใน DevTools ได้ |
| `dockPreferences.defaultPosition` | string (เช่น `'bottom'`) | — |เหมือนข้างบน |
| `build.withApp` | `boolean` | `false` | เขียน static DevTools ข้าง build; `build.outDir` override ได้ |
| `build.injection` | `boolean` | `false` | โชว์ dock ในแอปที่ build แล้ว; ต้องคู่กับ `build.withApp: true` |

Paths: `/__devtools/` (full-page UI), `/__devtools/embedded.js` (embed dock ใน built app)

## Client Injector Subpaths

ใช้เมื่อ Vite ไม่ได้เสิร์ฟ HTML (JS-only entry, backend integration, middleware mode) — import ตัวเดียวจาก browser entry ตาม mode ที่ต้องการ

| Subpath | Mode |
|---------|------|
| `@vitejs/devtools/client/inject` | normal — โชว์ dock ทันที |
| `@vitejs/devtools/client/inject-passive` | passive — ซ่อนจนกด shortcut แล้วจำ |
| `@vitejs/devtools/client/inject-hidden` | hidden — ซ่อนทุก session |

docs ยังไม่มี type declarations สำหรับ subpath เหล่านี้ → ใช้ `// @ts-expect-error` ชั่วคราว

## Kit Context Surface (`Plugin.devtools.setup(ctx)`)

| Feature | API | ใช้ทำอะไร |
|---------|-----|-----------|
| Dock | `ctx.docks.register({ id, title, icon, type, url })` | ประเภท: `iframe`, `action`, `custom`, `launcher`, `json-render`; มี categories, when-clauses, remote dock |
| Commands | `ctx.commands.register({ id, title, handler })` | shared palette + keybindings + children + when-gating |
| RPC | ผ่าน Kit (Devframe birpc + valibot) | bidirectional type-safe server↔client |
| Shared State | patch-synced | bridge server ↔ client ข้ามทุก integration |
| Streaming | Kit streaming | chunk feeds |
| Messages | toasts + unified messages dock | แจ้งเตือนข้าม tool |
| Terminals | aggregation | รวม output จากทุก integration ไว้ panel เดียว |
| Diagnostics | structured | error reporting (DTK error codes) |
| Isomorphic Views | embedded panels / browser extension / standalone webpage | deploy UI เดียวหลาย surface |

## Devframe Bridge

```ts
// vite.config.ts
import { createPluginFromDevframe } from '@vitejs/devtools-kit/node'
import devtool from './my-devtool'

export default {
  plugins: [
    createPluginFromDevframe(devtool, {
      setup(ctx) {
        ctx.commands.register({ id: 'my-devtool:clear-cache', title: 'Clear Cache', handler: () => {} })
      },
    }),
  ],
}
```

Kit synthesise dock iframe entry จาก definition fields: `id`, `name`, `icon`, `basePath`

## Layering

```
Vite DevTools (@vitejs/devtools)
  └─ DevTools Kit (@vitejs/devtools-kit)   hub: dock, palette, terminals, devtools.setup
       └─ Devframe (devframe)               framework-neutral: SPA, CLI, static, MCP
```

Standalone tool ที่ไม่พึ่ง Vite → ใช้ Devframe ตรง ๆ (`/follow-tool-devframe`) ไม่ใช่ Kit

## Built-in Integration Behaviour

- ตัวที่ไม่ได้อยู่ในโปรเจกต์จะแสดงเป็น **launcher** ใน dock — กดแล้วติดตั้ง package on demand แล้วต้อง restart dev server
- ตัวที่โปรเจกต์มีอยู่แล้ว → mount อัตโนมัติ
- Vitest: dock โผล่เมื่อโปรเจกต์ depends on `vitest`; launch แล้วติดตั้ง `@vitest/ui` + รัน `vitest --ui` เป็น iframe
- Oxc: รัน standalone ได้ด้วย `npx @vitejs/devtools-oxc`; ถ้าตรวจเจอ Vite Plus จะรัน oxlint/oxfmt ผ่าน `vp`

## Ecosystem Users Of Kit

- Nuxt DevTools v4
- `@vitejs/devtools-oxc` (first-party, custom RPC functions)
- UnoCSS Inspector (dock integration)
- `vite-plugin-vue-tracer` (action button → DOM inspector)
- repo ที่ ship ขึ้น GitHub → tag `vite-devtools` ตาม docs ขอ

## Requirements / Misc

- Vite `^8.3.0` ขึ้นไป (docs ใช้ `pnpm add -D @vitejs/devtools`; สลับ package manager ตามโปรเจกต์)
- Error reference: Kit = `DTK00xx`, Rolldown = `RDDT00xx` ในหน้า `/errors/`
- Docs เป็น VitePress SPA — sidebar sub-pages (`/kit/` DevTools Plugin, Dock System, RPC, Shared State, Streaming, Commands, When Clauses, Messages, Diagnostics, JSON Render, Terminals, Remote Client, Examples) ต้อง navigate จาก `/kit/`; Chrome extension guide อยู่ใน `/guide/` nav

# Vite Plugin API Reference

Vite plugins ขยาย plugin interface ของ Rolldown ด้วย Vite-specific options
ทำให้เขียนครั้งเดียวแล้วใช้ได้ทั้ง dev และ build

> แนะนำให้อ่าน [Rolldown Plugin Documentation](https://rolldown.rs/apis/plugin-api) ก่อน

## Plugin Object Structure

เขียน plugin เป็น factory function ที่ return plugin object:

```js
export default function myPlugin(options = {}) {
  return {
    name: 'my-plugin', // required, แสดงใน warnings และ errors
    enforce: 'pre',    // optional: 'pre' | 'post'
    apply: 'build',    // optional: 'build' | 'serve' | function
    // ...hooks
  }
}
```

### `name` (required)

ทุก plugin ต้องมี `name` ใช้ใน error messages และ debugging

### `enforce` — ลำดับการทำงาน

ควบคุมลำดับ plugin คล้าย webpack loaders ค่าเป็น `'pre'` หรือ `'post':

1. Alias
2. User plugins ที่มี `enforce: 'pre'`
3. Vite core plugins
4. User plugins ไม่มี `enforce`
5. Vite build plugins
6. User plugins ที่มี `enforce: 'post'`
7. Vite post build plugins (minify, manifest, reporting)

> `enforce` แยกจาก hook ordering ซึ่งควบคุมด้วย `order` attribute ของ Rolldown hooks

### `apply` — เงื่อนไขการใช้งาน

ค่าเริ่มต้น plugin ทำงานทั้ง `serve` และ `build`:

```js
const myPlugin = () => ({
  name: 'build-only',
  apply: 'build', // หรือ 'serve' หรือ function: (config, { command }) => command === 'build'
})
```

## Universal Hooks (Rolldown)

Hooks จาก Rolldown ทำงานทั้งใน dev และ build เป็น per-environment hooks

### เรียกครั้งเดียวตอน server start
- `options` — แทนที่หรือแก้ไข Rolldown input options
- `buildStart` — เริ่ม build ใช้สำหรับเริ่ม resource หรือ cache

### เรียกทุก module request (dev) / ทุก module (build)
- `resolveId(source, importer)` — resolve import path คืน id หรือ null
- `load(id)` — โหลด source code ของ module
- `transform(code, id)` — แปลง source code คืน `{ code, map }`

### เรียกตอน server close

- `buildEnd(error?)` — สิ้นสุด build phase
- `closeBundle()` — ปิด bundle ใช้สำหรับ cleanup

> `moduleParsed` ไม่ถูกเรียกใน dev เพราะ Vite หลีกเลี่ยง full AST parse
> Output Generation Hooks (ยกเว้น `closeBundle`) ไม่ถูกเรียกใน dev

### ตัวอย่าง: Transform Custom File Types

```js
const fileRegex = /\.(my-file-ext)$/
export default function myPlugin() {
  return {
    name: 'transform-file',
    transform: {
      filter: { id: fileRegex },
      handler(src, id) {
        return { code: compileFileToJS(src), map: null }
      },
    },
  }
}
```

### ตัวอย่าง: Virtual Module

```js
import { exactRegex } from '@rolldown/pluginutils'

export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'my-plugin',
    resolveId: {
      filter: { id: exactRegex(virtualModuleId) },
      handler() { return resolvedVirtualModuleId },
    },
    load: {
      filter: { id: exactRegex(resolvedVirtualModuleId) },
      handler() { return `export const msg = "from virtual module"` },
    },
  }
}
```

## Vite-Specific Hooks

Hooks เฉพาะ Vite (Rollup จะไม่สนใจ)

### `config`

แก้ไข Vite config ก่อน resolve คืน partial config (recommended) หรือ mutate ตรงๆ:

```js
const partialConfigPlugin = () => ({
  name: 'return-partial',
  config: () => ({
    resolve: { alias: { foo: 'bar' } },
  }),
})
```

### `configResolved`

เรียกหลัง config resolve เสร็จ ใช้เก็บ final config เพื่อใช้ใน hooks อื่น:

```js
const examplePlugin = () => {
  let config
  return {
    name: 'read-config',
    configResolved(c) { config = c }, // config.command: 'serve' | 'build'
    transform(code, id) { /* branch ตาม config.command */ },
  }
}
```

### `configureServer`

กำหนดค่า dev server เช่นเพิ่ม custom middleware:

```js
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use((req, res, next) => { /* custom handle request */ })
  },
})
```

> คืน function จาก `configureServer` เพื่อ inject middleware หลัง internal middlewares
> `configureServer` ไม่ถูกเรียกตอน production build

### `configurePreviewServer` / `closeServer`

- `configurePreviewServer(server)` — เหมือน `configureServer` แต่สำหรับ `vite preview` server
- `closeServer({ reason })` — เรียกเมื่อ dev server restart หรือ close (`reason: 'restart' | 'close'`) ใช้ dispose resources ที่สร้างใน `configureServer`

### `transformIndexHtml`

แปลง HTML entry point เช่น `index.html`:

```js
const htmlPlugin = () => ({
  name: 'html-transform',
  transformIndexHtml(html) {
    return html.replace(
      /<title>(.*?)<\/title>/,
      `<title>Title replaced!</title>`,
    )
  },
})
```

รองรับ `order: 'pre' | 'post'` และคืนได้ทั้ง string, tag descriptors array หรือ `{ html, tags }`

### `handleHotUpdate`

จัดการ HMR update แบบ custom สามารถ filter modules หรือส่ง custom events:

```js
handleHotUpdate({ server, modules, timestamp }) {
  for (const mod of modules)
    server.moduleGraph.invalidateModule(mod, new Set(), timestamp, true)
  server.ws.send({ type: 'full-reload' })
  return []
}
```

### `hotUpdate` (Vite 6+, per-environment)

Hook ใหม่ที่จะแทนที่ `handleHotUpdate` ในอนาคต ทำงาน per-environment และรับ `HotUpdateOptions`:

```ts
interface HotUpdateOptions {
  type: 'create' | 'update' | 'delete'; file: string; timestamp: number
  modules: Array<EnvironmentModuleNode> // เฉพาะ environment ปัจจุบัน
  read: () => string | Promise<string>; server: ViteDevServer
}
```

- เข้าถึง environment ปัจจุบันผ่าน `this.environment` ใน hook (universal hooks เป็น per-environment ทั้งหมดใน Vite 8)
- `modules` เป็น module nodes ของ environment นั้นเท่านั้น

## Rolldown Compatibility Notes

- Vite 8+ ใช้ Rolldown เป็น bundler, Vite 7 และต่ำกว่าใช้ Rollup
- ใช้ `this.meta.viteVersion` อ่าน Vite version และ `this.meta.rolldownVersion` ตรวจว่าเป็น Rolldown-powered Vite (Vite 8+):

```js
const versionCheckPlugin = () => ({
  name: 'version-check',
  buildStart() {
    if (this.meta.rolldownVersion) { /* Rolldown (Vite 8+) */ } else { /* Rollup */ }
  },
})
```

- Rolldown plugins ส่วนใหญ่ทำงานเป็น Vite plugin ได้โดยตรง ถ้า:
  - ไม่ใช้ `moduleParsed` hook
  - ไม่พึ่งพา `transform.inject` ของ Rolldown
  - ไม่มี coupling ระหว่าง bundle-phase และ output-phase hooks
- ใช้ `build.rolldownOptions.plugins` สำหรับ build-only plugins
- Hook filters ลด overhead ระหว่าง Rust และ JS runtime (Rollup 4.38.0+, Vite 6.3.0+):

```js
const jsFileRegex = /\.js$/
export default () => ({
  name: 'my-plugin',
  transform: {
    filter: { id: jsFileRegex },
    handler: (code, id) =>
      jsFileRegex.test(id) ? { code: transformCode(code), map: null } : null,
  },
})
```

- ใช้ `normalizePath` จาก `vite` แปลง path เป็น POSIX separators

## Sources

- https://vite.dev/guide/api-plugin.html
- https://rolldown.rs/apis/plugin-api
- https://rolldown.rs/apis/plugin-api/hook-filters

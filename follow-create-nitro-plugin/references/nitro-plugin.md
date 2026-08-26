# Nitro Plugin Reference

## Official Sources

- Nitro Plugins: https://nitro.build/docs/plugins
- Nuxt Server Hooks: https://nuxt.com/docs/3.x/guide/going-further/hooks
- Nitro Runtime Types: https://github.com/unjs/nitro/tree/main/src/runtime

## Plugin Definition

Nitro project plugin วางใน `server/plugins/*.ts`:

```typescript
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    html.bodyAppend.push('<script>console.log("hello")</script>')
  })
})
```

ใน package:

```typescript
import { defineNitroPlugin } from 'nitropack/runtime/plugin'

export default defineNitroPlugin((nitroApp) => {
  // ...
})
```

## Common Hooks

- `request`: `(event) => void` ตอนเริ่ม request
- `response`: `(response, { event }) => void` หลังสร้าง response
- `error`: `(error, context) => void` เมื่อมี error
- `render:html`: `(html, { event }) => void` แก้ HTML ก่อนส่ง
- `render:response`: `(response, { event }) => void` แก้ response
- `close`: `() => Promise<void>` เมื่อ server ปิด

## nitroApp Context

- `nitroApp.hooks`: Hookable instance
- `nitroApp.h3App`: H3 app
- `nitroApp.fetch`: internal fetch
- `nitroApp.captureError`: capture error

## package.json

```json
{
  "name": "nitro-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "nitropack": "^2.0.0"
  }
}
```

## build.config.ts with unbuild

```typescript
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  externals: ['nitropack'],
  rollup: { emitCJS: true },
})
```

## Testing

```typescript
import { describe, it, expect } from 'bun:test'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nitro plugin', () => {
  await setup({
    server: true,
    nuxtConfig: { modules: ['nitro-my-plugin'] },
  })

  it('injects script', async () => {
    const html = await $fetch('/')
    expect(html).toContain('hello')
  })
})
```

## Nuxt Module Integration

ถ้าต้องการใช้ผ่าน Nuxt module ให้ใช้ `addServerPlugin` จาก `@nuxt/kit`:

```typescript
import { createResolver, defineNuxtModule, addServerPlugin } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    const resolver = createResolver(import.meta.url)
    addServerPlugin(resolver.resolve('./runtime/plugin'))
  },
})
```

## Best Practices

- ใช้ `defineNitroPlugin` อย่างเดียว ไม่ export function ทั่วไป
- ระวังเรื่อง top-level await ใน plugin
- ใช้ `useStorage()` ภายใน hook ไม่เป้น global

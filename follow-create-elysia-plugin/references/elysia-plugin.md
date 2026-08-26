# Elysia Plugin Reference

## Official Sources

- Elysia Plugin Docs: https://elysiajs.com/essential/plugin
- Elysia API: https://elysiajs.com/eden
- GitHub: https://github.com/elysiajs/elysia

## Plugin Pattern

Plugin คือ `Elysia` instance ที return จาก factory function:

```typescript
import { Elysia } from 'elysia'

export const myPlugin = (options = { log: false }) =>
  new Elysia({ name: 'my-plugin' })
    .decorate('plugin', 'hello')
    .onBeforeHandle(({ request }) => {
      if (options.log) console.log(request.url)
    })
    .get('/plugin', ({ plugin }) => plugin)
```

## Deduplication

- ใช้ `name` ใน `Elysia({ name })` เพื่อป้องกัน register ซ้ำ
- ใช้ `seed` ถ้า plugin สามารถมีหลาย instance ด้วย config ต่างกัน

## Functional Callback

```typescript
import { Elysia } from 'elysia'

export const myPlugin = (app: Elysia) =>
  app.get('/from-callback', () => 'ok')

const app = new Elysia().use(myPlugin)
```

## State And Decorators

- `.state(key, value)` เก็บ state ใน `store`
- `.decorate(key, value)` เก็บ value ใน context
- `.derive(fn)` สร้าง derived context จาก request

## Lifecycle Hooks

- `onBeforeHandle` ก่อน route handler
- `onAfterHandle` หลัง route handler
- `onError` เมื่อเกิด error
- `onParse`, `onTransform` สำหรับ request body

## Type Propagation

- Type ของ `decorators`, `state`, `derive` จะ merge เข้า app ที `.use()`
- ต้อง method chaining `new Elysia().use().get()` เพื่อให้ type inference ทำงาน

## package.json

```json
{
  "name": "elysia-my-plugin",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "elysia": ">= 1.0.0"
  },
  "devDependencies": {
    "elysia": "^1.0.0",
    "typescript": "^5.8.0"
  }
}
```

## Testing

```typescript
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { myPlugin } from '../src/index'

describe('myPlugin', () => {
  it('returns decorated value', async () => {
    const app = new Elysia().use(myPlugin()).get('/', ({ plugin }) => plugin)
    const res = await app.handle(new Request('http://localhost/'))
    expect(await res.text()).toBe('hello')
  })
})
```

## Recommended Naming

- Plugin package: `elysia-{name}`
- GitHub repo: `elysia-{name}`
- Export name: camelCase

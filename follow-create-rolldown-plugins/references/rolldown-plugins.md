# Rolldown Plugin API

## Official Sources

- Rolldown Plugin API: https://rolldown.rs/apis/plugin-api
- Hook Filters: https://rolldown.rs/apis/plugin-api/hook-filters
- Vite Plugin Docs: https://vite.dev/guide/api-plugin.html

## Plugin Object

```typescript
import type { Plugin } from 'rolldown'

export default function myPlugin(options = {}): Plugin {
  return {
    name: 'my-plugin',
    resolveId: {
      filter: { id: /^virtual:/ },
      handler(source) {
        if (source === 'virtual:foo') return '\0virtual:foo'
        return null
      },
    },
    load: {
      filter: { id: /\0virtual:foo/ },
      handler() {
        return 'export const msg = "hello"'
      },
    },
  }
}
```

## Universal Hooks

- `options`: แก้ input options
- `buildStart`: เริ่ม build
- `resolveId`: resolve id
- `load`: โหลด source
- `transform`: แปลง source
- `buildEnd`: สิ้นสุด build
- `closeBundle`: ปิด bundle

## Output Generation Hooks

- `renderStart`: เริ่ม output generation
- `renderChunk`: แก้ chunk
- `generateBundle`: แก้ bundle assets
- `writeBundle`: หลังเขียนไฟล์
- `closeBundle`: ปิด

> Output hooks ไม่ถูกเรียกใน Vite dev mode

## Hook Filters

Hook filters ช่วยให้ Rust runtime ข้าม JS callback ถ้าไม่ match:

```typescript
{
  name: 'filter-example',
  transform: {
    filter: {
      id: /\.ts$/,
      moduleType: ['ts'],
    },
    handler(code, id) {
      return { code: code.replace('foo', 'bar') }
    },
  },
}
```

## Virtual Module

```typescript
const virtualModuleId = 'virtual:my-module'
const resolvedVirtualModuleId = '\0' + virtualModuleId

export default function virtualModulePlugin() {
  return {
    name: 'virtual-module',
    resolveId: {
      filter: { id: new RegExp(`^${virtualModuleId}$`) },
      handler(id) {
        if (id === virtualModuleId) return resolvedVirtualModuleId
        return null
      },
    },
    load: {
      filter: { id: /\0virtual:my-module/ },
      handler() {
        return `export const msg = "from virtual module"`
      },
    },
  }
}
```

## Vite Compatibility

- Vite 8+ ใช้ Rolldown เป้น bundler
- หลีกเลี่ยง `moduleParsed` hook
- หลีกเลี่ยง `transform.inject` ของ Rolldown
- ใช้ `build.rolldownOptions.plugins` สำหรับ build-only plugins

## package.json

```json
{
  "name": "rolldown-plugin-example",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "rolldown": ">= 1.0.0"
  }
}
```

## Testing

```typescript
import { build } from 'rolldown'
import myPlugin from '../src/index'

const bundle = await build({
  input: 'src/index.js',
  plugins: [myPlugin()],
})

const { output } = await bundle.generate({ format: 'esm' })
console.log(output[0].code)
```

## Best Practices

- ต้องมี `name`
- ใช้ hook filters
- คืน `null` เร็วถ้าไม่ match
- ไม่ couple bundle-phase hooks กับ output-phase hooks
- external bundler packages

# Plugin API Reference

Vitest Plugin API (3.1.0+) สำหรับสร้าง plugin ที่ทำงานกับ Vitest lifecycle ในระดับ config resolution

## configureVitest Hook

Hook ที่ Vitest เรียก early in lifecycle ก่อนที่ reporters จะถูกสร้าง ทำให้แก้ไข config เช่น `coverage` และ `reporters` ได้

```ts
import type { Vite, VitestPluginContext } from 'vitest/node'

export function plugin(): Vite.Plugin {
  return {
    name: 'vitest:my-plugin',
    configureVitest(context: VitestPluginContext) {
      // plugin logic
    },
  }
}
```

ถ้าเขียน plugin สำหรับทั้ง Vite และ Vitest ให้ใช้ `Plugin` type จาก `vite` และเพิ่ม reference:

```ts
/// <reference types="vitest/config" />

import type { Plugin } from 'vite'

export function plugin(): Plugin {
  return {
    name: 'vitest:my-plugin',
    transform() {
      // transform logic
    },
    configureVitest(context) {
      // plugin logic
    },
  }
}
```

> แตกต่างจาก `reporter.onInit` ซึ่งทำงานช้ากว่า `configureVitest` ทำงานก่อน reporters ถูกสร้าง

## Context Properties

### project

Test project ปัจจุบันที่ plugin อยู่ เป็น instance ของ `TestProject`

> ถ้าใช้ browser feature ฟิลด์ `project.browser` ยังไม่ถูก set ให้ใช้ `reporter.onBrowserInit` แทน

### vitest

Global `Vitest` instance แก้ไข global config ได้โดยตรงผ่าน `vitest.config`:

```ts
configureVitest({ vitest }) {
  vitest.config.coverage.enabled = false
  vitest.config.reporters.push([['my-reporter', {}]])
}
```

> Config ถูก resolved แล้ว บาง properties มี type ต่างจาก user config
> `setupFile` ไม่ resolved อีกครั้ง - resolve เองถ้า add new files
> การแก้ `vitest.reporters` ตรงๆ ไม่มีผล เพราะจะถูก overwrite - แก้ `vitest.config` แทน

### injectTestProjects

```ts
function injectTestProjects(
  config: TestProjectConfiguration | TestProjectConfiguration[]
): Promise<TestProject[]>
```

Inject test projects เพิ่ม รับ config glob pattern, filepath หรือ inline configuration คืน array ของ resolved `TestProject`

```ts
configureVitest({ project, injectTestProjects }) {
  const newProjects = await injectTestProjects({
    extends: project.vite.config.configFile,
    test: {
      name: 'my-custom-alias',
      alias: {
        customAlias: resolve('./custom-path.js'),
      },
    },
  })
}
```

> ดูรายละเอียดเพิ่มเติมใน `test-project.md`

### experimental_defineCacheKeyGenerator (4.0.11+)

```ts
interface CacheKeyIdGeneratorContext {
  environment: DevEnvironment
  id: string
  sourceCode: string
}

function experimental_defineCacheKeyGenerator(
  callback: (context: CacheKeyIdGeneratorContext) => string | undefined | null | false
): void
```

กำหนด generator ที่ใช้ก่อน hashing cache key ใช้เมื่อ plugin ถูก register ด้วย options ต่างกัน

```ts
interface PluginOptions {
  replacePropertyKey: string
  replacePropertyValue: string
}

export function plugin(options: PluginOptions) {
  return {
    name: 'plugin-that-replaces-property',
    transform(code) {
      return code.replace(options.replacePropertyKey, options.replacePropertyValue)
    },
    configureVitest({ experimental_defineCacheKeyGenerator }) {
      experimental_defineCacheKeyGenerator(() => {
        return options.replacePropertyKey + options.replacePropertyValue
      })
    },
  }
}
```

- Return `false` เพื่อ disable file system caching ของ module นั้น
- ทำงานเฉพาะเมื่อมี `experimental.fsModuleCache` ใน config

## Config Mutations

สรุปการแก้ไข config ใน `configureVitest`:

| Action | วิธี | หมายเหตุ |
| --- | --- | --- |
| Disable coverage | `vitest.config.coverage.enabled = false` | แก้ไขตรงๆ ได้ |
| Add reporter | `vitest.config.reporters.push(...)` | แก้ config ไม่ใช่ `vitest.reporters` |
| Add setup file | resolve path เองก่อน push | `setupFile` ไม่ resolved อีก |
| Include injected project | `vitest.config.project.push('name')` | มีผลเฉพาะ `injectTestProjects` |

## Sources

- [Plugin API | Vitest](https://vitest.dev/api/advanced/plugin)
- [Vitest Instance | Vitest](https://vitest.dev/api/advanced/vitest)
- [Test Project | Vitest](https://vitest.dev/api/advanced/test-project)

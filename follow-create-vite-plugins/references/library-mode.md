# Vite Library Mode Build Reference

Library mode ใช้สำหรับ build browser-oriented library สำหรับ distribution
โดยใช้ `build.lib` config option ใน `vite.config.js`

## Basic Config

### Single Entry

```js
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      // Vite จะเพิ่ม extension ที่เหมาะสมให้อัตโนมัติ
      fileName: 'my-lib',
    },
    rolldownOptions: {
      // externalize deps ที่ไม่ต้องการ bundle
      external: ['vue'],
      output: {
        // global variables สำหรับ UMD build ของ externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

### Multiple Entries

```js
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(import.meta.dirname, 'lib/main.js'),
        secondary: resolve(import.meta.dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
```

## `build.lib` Options

| Option | Type | Description |
|--------|------|-------------|
| `entry` | `string \| Record<string, string>` | Entry point หรือ map ของ entries |
| `name` | `string` | ชื่อ library สำหรับ UMD/IIFE global variable |
| `fileName` | `string \| (format, entryName) => string` | ชื่อไฟล์ output ไม่รวม extension |
| `formats` | `Array<'es' \| 'cjs' \| 'umd' \| 'iife'>` | รูปแบบ output ที่ต้องการ |
| `cssFileName` | `string` | ชื่อ CSS file output (default: ตาม `fileName`) |

### Default Formats

- Single entry: `es` และ `umd`
- Multiple entries: `es` และ `cjs`

กำหนดเองด้วย `build.lib.formats`:

```js
export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.js'),
      name: 'MyLib',
      fileName: 'my-lib',
      formats: ['es', 'cjs', 'umd'],
    },
  },
})
```

## Entry File

Entry file ควร export สิ่งที่ users จะ import:

```js
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

## External Dependencies

ทำให้ dependencies เป็น external แทนการ bundle:

```js
rolldownOptions: {
  external: ['vue', 'react'],
  output: {
    globals: {
      vue: 'Vue',
      react: 'React',
    },
  },
}
```

> `external` ใช้สำหรับ dependencies ที่ consumers จะติดตั้งเอง
> `globals` จำเป็นสำหรับ UMD format เพื่อ map external dep ไปยัง global variable

## `package.json`

### Single Entry

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

### Multiple Entries

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

### Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:types": "tsc --emitDeclarationOnly",
    "preview": "vite preview"
  }
}
```

## CSS Support

ถ้า library import CSS, Vite จะ bundle เป็น CSS file เดียว เช่น `dist/my-lib.css`
ชื่อไฟล์ default ตาม `build.lib.fileName` หรือกำหนดด้วย `build.lib.cssFileName`
ส่งออก CSS ใน `package.json` exports: `"./style.css": "./dist/my-lib.css"`

## File Extensions

ถ้า `package.json` ไม่มี `"type": "module"`:
- `.js` จะกลายเป็น `.mjs`
- `.cjs` จะกลายเป็น `.js`

## `tsconfig.json`

สำหรับ TypeScript library:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationDir": "./dist/types",
    "outDir": "./dist",
    "strict": true,
    "skipLibCheck": true,
    "emitDeclarationOnly": true
  },
  "include": ["src"]
}
```

> ใช้ `emitDeclarationOnly: true` เพราะ Vite build JS ให้ สร้าง type declarations แยกด้วย `tsc`
> Build script: `"build": "vite build && tsc --emitDeclarationOnly"`

## Environment Variables

ใน library mode, `import.meta.env.*` ถูก replace แบบ static ตอน build
แต่ `process.env.*` ไม่ถูก replace เพื่อให้ consumers เปลี่ยนได้

ถ้าต้องการ replace `process.env.NODE_ENV`:

```js
export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
```

## Advanced Usage

Library mode เหมาะสำหรับ browser-oriented และ JS framework libraries
ถ้า build non-browser library หรือต้องการ advanced build flows
ใช้ [tsdown](https://tsdown.dev/) หรือ [Rolldown](https://rolldown.rs/) โดยตรง

## Sources

- https://vite.dev/guide/build.html#library-mode
- https://vite.dev/config/build-options.html#build-lib

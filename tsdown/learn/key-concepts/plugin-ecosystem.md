# Plugin Ecosystem

tsdown รองรับ plugins หลากหลายสำหรับ extend functionality

## ประเภท Plugins ที่รองรับ

### Rollup Plugins
- รองรับ Rollup plugins ส่วนใหญ่
- ใช้ API เดียวกับ Rollup
- ใช้ `plugins` option ใน config

### unplugin
- Universal plugin system
- ทำงานได้ทั้ง Rollup, Vite, Webpack, esbuild
- ใช้ `unplugin` สำหรับ cross-platform plugins

### Vite Plugins
- รองรับบาง Vite plugins
- ใช้สำหรับ plugins ที่ไม่มี Rollup version
- ต้องทดสอบ compatibility

## การใช้งาน Plugins

```typescript
// tsdown.config.ts
import commonjs from '@rollup/plugin-commonjs'
import { unplugin } from 'unplugin'

export default {
  plugins: [
    commonjs(),
    unplugin(() => ({
      name: 'my-plugin',
      transform(code) {
        // Transform code
      }
    }))
  ]
}
```

## Plugins ที่นิยม

- `@rollup/plugin-commonjs` - Convert CommonJS to ESM
- `@rollup/plugin-node-resolve` - Resolve node modules
- `@rollup/plugin-json` - Import JSON files
- `unplugin-auto-import` - Auto import APIs
- `unplugin-vue-components` - Auto import Vue components

## ข้อจำกัด

- ไม่รองรับทุก Rollup plugin
- Plugins ที่ใช้ Rollup-specific APIs อาจไม่ทำงาน
- ต้องทดสอบ plugin compatibility

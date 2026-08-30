---
title: Migrate from Rollup - API and Plugin Compatibility
description: ความเข้ากันได้ของ API และ plugin migration จาก Rollup ไปยัง Rolldown
auto_execution_mode: 3
---

## Goal

ตรวจสอบความเข้ากันได้ของ APIs และ plugins ระหว่าง Rollup และ Rolldown

## Scope

- API compatibility
- Plugin migration

## API Compatibility

### Compatible APIs

Rolldown เข้ากันได้กับ Rollup APIs ส่วนใหญ่:

- `input` - Entry points
- `output` - Output options
- `plugins` - Plugin system
- `external` - External dependencies
- `treeshake` - Tree shaking options

### Minor Differences

Output Options:
- Rolldown รองรับ options ส่วนใหญ่ของ Rollup
- บาง advanced options อาจยังไม่รองรับ

Plugin Hooks:
- Rolldown รองรับ plugin hooks หลักของ Rollup
- บาง advanced hooks อาจยังไม่รองรับ

## Plugin Migration

### Common Plugins

| Rollup Plugin | Rolldown Plugin | Status |
|---------------|----------------|--------|
| `@rollup/plugin-commonjs` | `@rolldown/plugin-commonjs` | ✅ Compatible |
| `@rollup/plugin-node-resolve` | `@rolldown/plugin-node-resolve` | ✅ Compatible |
| `@rollup/plugin-terser` | `@rolldown/plugin-terser` | ✅ Compatible |
| `@rollup/plugin-babel` | `@rolldown/plugin-babel` | ✅ Compatible |

### Custom Plugins

Custom plugins ที่ใช้ Rollup API สามารถใช้กับ Rolldown ได้:

```typescript
// Custom plugin compatible with both
const myPlugin = () => ({
  name: 'my-plugin',
  transform(code, id) {
    // transform logic
  },
})
```

## Rules

- ตรวจสอบ plugin compatibility ก่อน migration
- ใช้ Rolldown plugin versions เมื่อมี
- Custom plugins ที่ใช้ hooks พื้นฐานสามารถใช้ได้ทันที

## Expected Outcome

- APIs และ plugins เข้ากันได้กับ Rolldown
- Custom plugins ทำงานได้ปกติ

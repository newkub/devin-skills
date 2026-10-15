---
title: Migrate from Rollup - API and Plugin Compatibility
description: API and plugin compatibility for migration from Rollup to Rolldown
auto_execution_mode: 3
---

## Goal

Check API and plugin compatibility between Rollup and Rolldown

## Scope

- API compatibility
- Plugin migration

## API Compatibility

### Compatible APIs

Rolldown is compatible with most Rollup APIs:

- `input` - Entry points
- `output` - Output options
- `plugins` - Plugin system
- `external` - External dependencies
- `treeshake` - Tree shaking options

### Minor Differences

Output Options:
- Rolldown supports most Rollup options
- Some advanced options may not be supported yet

Plugin Hooks:
- Rolldown supports the main Rollup plugin hooks
- Some advanced hooks may not be supported yet

## Plugin Migration

### Common Plugins

| Rollup Plugin | Rolldown Plugin | Status |
|---------------|----------------|--------|
| `@rollup/plugin-commonjs` | `@rolldown/plugin-commonjs` | ✅ Compatible |
| `@rollup/plugin-node-resolve` | `@rolldown/plugin-node-resolve` | ✅ Compatible |
| `@rollup/plugin-terser` | `@rolldown/plugin-terser` | ✅ Compatible |
| `@rollup/plugin-babel` | `@rolldown/plugin-babel` | ✅ Compatible |

### Custom Plugins

Custom plugins that use the Rollup API can be used with Rolldown:

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

- Check plugin compatibility before migration
- Use Rolldown plugin versions when available
- Custom plugins that use basic hooks can be used immediately

## Expected Outcome

- APIs and plugins are compatible with Rolldown
- Custom plugins work normally

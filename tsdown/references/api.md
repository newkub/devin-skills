# API

tsdown public API reference.

## defineConfig

Main configuration function:

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig(options)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `options` | `TsdownOptions` | Yes | Configuration options |

## TsdownOptions

### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entry` | `string \| string[]` | - | Entry file(s) |
| `outDir` | `string` | `'dist'` | Output directory |
| `format` | `Format[]` | `['esm', 'cjs']` | Output formats |
| `plugins` | `Plugin[]` | `[]` | Bundler plugins |

### DTS Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dts` | `boolean \| DtsOptions` | `false` | Enable declaration generation |
| `dts.sourcemap` | `boolean` | `false` | Generate .d.ts.map |

### Other Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `treeshake` | `boolean` | `true` | Enable tree-shaking |
| `sourcemap` | `boolean \| SourcemapOptions` | `false` | Generate source maps |
| `external` | `string[]` | `[]` | External dependencies |
| `target` | `string` | `'esnext'` | Target environment |

## Formats

```typescript
type Format = 'esm' | 'cjs' | 'iife' | 'umd'
```

| Format | Extension | Use Case |
|--------|-----------|----------|
| `esm` | `.mjs` | ES Modules |
| `cjs` | `.cjs` | CommonJS |
| `iife` | `.iife.js` | Browser globals |
| `umd` | `.umd.js` | Universal |

## Plugin API

### Plugin Structure

```typescript
interface Plugin {
  name: string
  buildStart?: () => void
  buildEnd?: () => void
  resolveId?: (id: string) => string | null
  load?: (id: string) => string | null
  transform?: (code: string, id: string) => string
  renderChunk?: (code: string, chunk: Chunk) => string
  generateBundle?: (bundle: Bundle) => void
  writeBundle?: (bundle: Bundle) => void
}
```

### Plugin Hooks

| Hook | Timing | Description |
|------|--------|-------------|
| `buildStart` | Start | Called at build start |
| `resolveId` | Each module | Resolve module path |
| `load` | Each module | Load module content |
| `transform` | Each module | Transform code |
| `renderChunk` | Each chunk | Transform chunk |
| `generateBundle` | Before write | Process bundle |
| `writeBundle` | After write | Finalize output |
| `buildEnd` | End | Called at build end |

## Programmatic Usage

### Build Function

```typescript
import { build } from 'tsdown'

await build({
  entry: ['./src/index.ts'],
  outDir: 'dist',
})
```

### Watch Function

```typescript
import { watch } from 'tsdown'

const watcher = watch({
  entry: ['./src/index.ts'],
  outDir: 'dist',
})

watcher.on('change', (id) => {
  console.log(`Changed: ${id}`)
})
```

### Stop Watcher

```typescript
watcher.close()
```

## TypeScript

### Config Types

```typescript
import type { TsdownOptions } from 'tsdown'
```

### Plugin Types

```typescript
import type { Plugin } from 'rollup'
```

## Export Types

```typescript
// Named exports
export { defineConfig, build, watch }

// Type exports
export type { TsdownOptions, Format, Plugin }
```

## Examples

### Basic Config

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
})
```

### With Plugins

```typescript
import { defineConfig } from 'tsdown'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  entry: ['./src/index.ts'],
  plugins: [vue() as any],
})
```

### Multi-entry

```typescript
export default defineConfig({
  entry: ['./src/index.ts', './src/utils.ts'],
})
```

### With DTS

```typescript
export default defineConfig({
  entry: ['./src/index.ts'],
  dts: true,
})
```

## Summary

| API | Description |
|-----|-------------|
| `defineConfig` | Create config |
| `build` | Programmatic build |
| `watch` | Watch mode |
| `TsdownOptions` | Config interface |
| `Plugin` | Plugin interface |
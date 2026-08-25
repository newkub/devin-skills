# Programmatic API - Config and Build Options

## Config Function

### defineConfig

```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### Async Config

```typescript
import { defineConfig } from 'rolldown'

export default defineConfig(async () => {
  const external = await getExternalPackages()

  return {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    external,
  }
})
```

## Build Options

### Input Options

| Option | Type | Description |
|--------|------|-------------|
| `input` | `string \| string[] \| object` | Entry point(s) |
| `external` | `string[] \| function \| RegExp` | External dependencies |
| `plugins` | `Plugin[]` | Plugin list |

### Output Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dir` | `string` | - | Output directory |
| `file` | `string` | - | Output file |
| `format` | `string` | `esm` | Output format |
| `name` | `string` | - | IIFE/UMD name |
| `sourcemap` | `boolean \| string` | `false` | Sourcemap |
| `minify` | `boolean` | `false` | Minify |
| `globals` | `object` | `{}` | UMD globals |
| `entryFileNames` | `string` | `[name].js` | Entry file pattern |
| `chunkFileNames` | `string` | `[name]-[hash].js` | Chunk file pattern |

### Tree-shaking Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `treeshake` | `boolean \| object` | `true` | Enable tree-shaking |
| `treeshake.moduleSideEffects` | `string` | `'no-external'` | Side effects |
| `treeshake.treeshakeLiterals` | `boolean` | `true` | Tree-shake literals |

### Other Options

| Option | Type | Description |
|--------|------|-------------|
| `tsconfig` | `string \| object` | TypeScript config |
| `logLevel` | `string` | Log level |
| `clear` | `boolean` | Clear output dir |

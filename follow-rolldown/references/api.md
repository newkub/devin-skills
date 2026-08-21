# Programmatic API

## Purpose

Programmatic API reference สำหรับการใช้งาน Rolldown ใน code

## Scope

- Build Function
- Watch Function
- Config Types
- Return Values

## Build Function

### Basic Usage

```typescript
import { build } from 'rolldown'

const options = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
}

const result = await build(options)
```

### With Plugins

```typescript
import { build } from 'rolldown'
import commonjs from '@rolldown/plugin-commonjs'
import nodeResolve from '@rolldown/plugin-node-resolve'

const result = await build({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ],
})
```

### With TypeScript

```typescript
import { build } from 'rolldown'

const result = await build({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  tsconfig: './tsconfig.json',
})
```

### With Options

```typescript
import { build } from 'rolldown'

const result = await build({
  input: {
    main: 'src/main.ts',
    util: 'src/util.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    minify: true,
  },
})
```

## Watch Function

### Basic Watch

```typescript
import { watch } from 'rolldown'

const watcher = watch({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})

watcher.on('event', (event) => {
  if (event.code === 'START') {
    console.log('Build started')
  }
  if (event.code === 'END') {
    console.log('Build ended')
  }
  if (event.code === 'ERROR') {
    console.error(event.error)
  }
})
```

### Watch with Close

```typescript
import { watch } from 'rolldown'

const watcher = watch({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})

// Close watcher
watcher.close()
```

### Watch Events

```typescript
watcher.on('event', (event) => {
  switch (event.code) {
    case 'START':
      console.log('Building...')
      break
    case 'BUNDLE':
      console.log('Bundle complete')
      break
    case 'END':
      console.log('Watch mode ended')
      break
    case 'ERROR':
      console.error(event.error)
      break
  }
})
```

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

## Return Values

### BuildResult

```typescript
interface BuildResult {
  output: OutputChunk[]
  error?: Error
}
```

### OutputChunk

```typescript
interface OutputChunk {
  type: 'chunk'
  fileName: string
  code: string
  map?: SourceMap
  modules: Record<string, ModuleJSON>
}
```

### OutputAsset

```typescript
interface OutputAsset {
  type: 'asset'
  fileName: string
  source: string | Buffer
}
```

## Summary

| Function | Usage |
|----------|-------|
| `build(options)` | Bundle project |
| `watch(options)` | Watch mode |
| `defineConfig(options)` | Create config |
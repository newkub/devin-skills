# Programmatic API - Build and Watch

## Purpose

Programmatic API reference สำหรับการใช้งาน Rolldown ใน code

## Scope

- Build Function
- Watch Function

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

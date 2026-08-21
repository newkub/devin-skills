# Getting Started

## Purpose

เริ่มต้นใช้งาน Rolldown สำหรับ bundle JavaScript/TypeScript project ด้วยความเร็วสูง

## Scope

- Installation
- Hello World example
- Basic configuration
- Build and watch mode

## What is Rolldown

Rolldown เป็น JavaScript bundler ที่เขียนด้วย Rust ให้ความเร็วสูงกว่า bundlers อื่นๆ และมี API เข้ากันได้กับ Rollup ทำให้ migration จาก Rollup เป็นเรื่องง่าย

**Benefits:**
- **Performance**: เร็วกว่า Rollup และ esbuild ในหลายกรณี
- **Compatibility**: API เข้ากันได้กับ Rollup และ plugins
- **TypeScript**: Built-in TypeScript support
- **Tree-shaking**: Efficient tree-shaking algorithm
- **Code Splitting**: Automatic code splitting

## Installation

### Using Bun (Recommended)

```bash
bun add -D rolldown
```

### Using bun

```bash
bun install -D rolldown
```

### Using bun

```bash
bun add -D rolldown
```

### Using yarn

```bash
yarn add -D rolldown
```

## Hello World Example

### 1. Create Project Structure

```bash
mkdir my-rolldown-project
cd my-rolldown-project
```

### 2. Initialize Project

```bash
bun init -y
```

### 3. Install Rolldown

```bash
bun add -D rolldown
```

### 4. Create Source Files

**src/index.ts:**
```typescript
export function greet(name: string): string {
  return `Hello, ${name}!`
}

export const version = '1.0.0'
```

**src/main.ts:**
```typescript
import { greet, version } from './index'

console.log(greet('World'))
console.log(`Version: ${version}`)
```

### 5. Create Config File

**rolldown.config.ts:**
```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### 6. Build Project

```bash
bunx rolldown
```

### 7. Run Output

```bash
node dist/main.js
```

Output:
```
Hello, World!
Version: 1.0.0
```

## Basic Configuration

### Single Entry

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

### Multiple Entries

```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: {
    main: 'src/main.ts',
    worker: 'src/worker.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### With TypeScript

```typescript
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  tsconfig: './tsconfig.json',
})
```

### With Plugins

```typescript
import { defineConfig } from 'rolldown'
import commonjs from '@rolldown/plugin-commonjs'
import nodeResolve from '@rolldown/plugin-node-resolve'

export default defineConfig({
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

## Build Options

### Development Build

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
})
```

### Production Build

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    minify: true,
  },
})
```

### Multiple Formats

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
})
```

## Watch Mode

### Basic Watch

```bash
bunx rolldown --watch
```

### Watch with Config

```bash
bunx rolldown --watch --config rolldown.config.ts
```

### Programmatic Watch

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

## Common Output Formats

### ESM (ES Modules)

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### CJS (CommonJS)

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
})
```

### IIFE (Immediately Invoked Function Expression)

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'MyLibrary',
  },
})
```

### UMD (Universal Module Definition)

```typescript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MyLibrary',
  },
})
```

## Next Steps

- **Key Concepts**: เรียนรู้เกี่ยวกับ [Three-stage pipeline](../key-concepts/three-stage-pipeline.md)
- **Configuration**: ดู [Configuration Reference](../../references/configuration.md)
- **Plugins**: เรียนรู้เกี่ยวกับ [Plugin System](../key-concepts/plugin-system.md)
- **Migration**: ดู [Migration Guide from Rollup](./migrate-from-rollup.md)

## Summary

| Step | Command |
|------|---------|
| Install | `bun add -D rolldown` |
| Config | Create `rolldown.config.ts` |
| Build | `bunx rolldown` |
| Watch | `bunx rolldown --watch` |

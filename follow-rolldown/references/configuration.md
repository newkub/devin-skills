# Configuration Reference

## Purpose

Configuration options reference สำหรับ Rolldown

## Scope

- Top-level Options
- Output Options
- Tree-shake Options
- Plugin Options

## Top-level Options

### Input

```javascript
export default defineConfig({
  // Single entry
  input: 'src/index.ts',

  // Multiple entries
  input: ['src/a.ts', 'src/b.ts'],

  // Named entries
  input: {
    main: 'src/main.ts',
    util: 'src/util.ts',
  },
})
```

### External

```javascript
export default defineConfig({
  // Array
  external: ['react', 'react-dom'],

  // Function
  external: (id) => id.startsWith('react'),

  // RegExp
  external: /node_modules/,
})
```

### Plugins

```javascript
import commonjs from '@rolldown/plugin-commonjs'

export default defineConfig({
  plugins: [commonjs()],
})
```

### Tree-shake

```javascript
export default defineConfig({
  // Enable (default)
  treeshake: true,

  // Disable
  treeshake: false,

  // With options
  treeshake: {
    moduleSideEffects: 'no-external',
    treeshakeLiterals: true,
    treeshakeClassStaticBlocks: true,
  },
})
```

### Log Level

```javascript
export default defineConfig({
  logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
})
```

### Clear Output

```javascript
export default defineConfig({
  clear: true, // Clear output directory before build
})
```

## Output Options

### Basic

```javascript
export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### Output Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dir` | `string` | - | Output directory |
| `file` | `string` | - | Single output file |
| `format` | `string` | `esm` | Output format |
| `name` | `string` | - | IIFE/UMD name |
| `sourcemap` | `boolean \| string` | `false` | Generate sourcemap |
| `minify` | `boolean` | `false` | Minify output |
| `globals` | `object` | `{}` | UMD globals |
| `assetFileNames` | `string` | - | Asset file pattern |
| `chunkFileNames` | `string` | - | Chunk file pattern |
| `entryFileNames` | `string` | - | Entry file pattern |
| `intro` | `string \| function` | - | Intro content |
| `outro` | `string \| function` | - | Outro content |

### Format Options

| Format | Extension | Use Case |
|--------|-----------|----------|
| `esm` | `.mjs` | Modern browsers |
| `cjs` | `.cjs` | Node.js |
| `iife` | `.js` | Browser global |
| `umd` | `.js` | Universal |

### Sourcemap Options

```javascript
output: {
  sourcemap: true,       // linked
  sourcemap: 'linked',   // linked
  sourcemap: 'inline',   // inline
  sourcemap: 'hidden',   // hidden
}
```

### Manual Chunks

```javascript
output: {
  manualChunks: {
    vendor: ['react', 'react-dom'],
    utils: ['lodash'],
  },
}
```

### Paths

```javascript
output: {
  paths: {
    react: 'https://cdn.example.com/react.js',
  },
}
```

## Tree-shake Options

### Module Side Effects

| Value | Description |
|-------|-------------|
| `'all'` | All modules have side effects |
| `'no-external'` | Only external modules have side effects |
| `false` | No side effects |

```javascript
treeshake: {
  moduleSideEffects: 'no-external',
}
```

### Tree-shake Literals

```javascript
treeshake: {
  treeshakeLiterals: true, // default
}
```

### Class Static Blocks

```javascript
treeshake: {
  treeshakeClassStaticBlocks: true, // default
}
```

## Config File Options

### File Names

| Option | Default | Description |
|--------|---------|-------------|
| `entryFileNames` | `[name].js` | Entry chunk names |
| `chunkFileNames` | `[name]-[hash].js` | Dynamic chunk names |
| `assetFileNames` | `[name]-[hash][extname]` | Asset names |

```javascript
output: {
  entryFileNames: 'entries/[name].js',
  chunkFileNames: 'chunks/[name]-[hash].js',
  assetFileNames: 'assets/[name]-[hash][extname]',
}
```

### Intro / Outro

```javascript
output: {
  intro: '/* License */',
  outro: '/* End of file */',
}
```

```javascript
output: {
  intro: (chunk) => `// Chunk: ${chunk.name}`,
}
```

## Environment Variables

### .env Files

```env
# .env
API_URL=https://api.example.com
```

### Config Usage

```javascript
export default defineConfig({
  define: {
    'import.meta.env.API_URL': JSON.stringify(process.env.API_URL),
  },
})
```

## TypeScript

### tsconfig Path

```javascript
export default defineConfig({
  tsconfig: './tsconfig.json',
})
```

### Inline Options

```javascript
export default defineConfig({
  tsconfig: {
    target: 'es2020',
    module: 'esnext',
    strict: true,
  },
})
```

## Summary

| Category | Options |
|----------|---------|
| **Input** | `input`, `external`, `plugins`, `treeshake` |
| **Output** | `dir`, `format`, `sourcemap`, `minify` |
| **Chunks** | `manualChunks`, `entryFileNames`, `chunkFileNames` |
| **Tree-shake** | `moduleSideEffects`, `treeshakeLiterals` |

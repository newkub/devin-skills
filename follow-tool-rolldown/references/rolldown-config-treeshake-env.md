# Configuration Reference - Tree-shake, File Options, and Environment

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
| Input | `input`, `external`, `plugins`, `treeshake` |
| Output | `dir`, `format`, `sourcemap`, `minify` |
| Chunks | `manualChunks`, `entryFileNames`, `chunkFileNames` |
| Tree-shake | `moduleSideEffects`, `treeshakeLiterals` |

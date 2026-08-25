# Configuration Reference - Output Options

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

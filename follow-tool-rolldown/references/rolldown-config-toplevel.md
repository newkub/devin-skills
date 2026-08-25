# Configuration Reference - Top-level Options

## Purpose

Configuration options reference สำหรับ Rolldown

## Scope

- Top-level Options

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

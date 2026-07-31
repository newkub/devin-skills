# Performance First

## Performance First Principle

Vite ถูกออกแบบมาเพื่อ performance สูงสุดในทุกขั้นตอน

## Core Principles

### 1. Native Speed

ใช้ native browser capabilities แทน bundling

```typescript
// Good - use native ESM
import { add } from './utils/math.js'

// Avoid - unnecessary bundling in dev
```

### 2. Lazy Loading

Load modules เมื่อจำเป็นเท่านั้น

```javascript
// Good - dynamic import
const heavyModule = await import('./heavy-module.js')

// Avoid - eager load
import heavyModule from './heavy-module.js'
```

### 3. Minimal Overhead

ลด overhead ให้น้อยที่สุด

```typescript
// Good - minimal config
export default defineConfig({
  // Only necessary config
})

// Avoid - excessive config
export default defineConfig({
  // Many unnecessary options
})
```

## Development Performance

### 1. Fast Startup

```typescript
// Good - let Vite handle dependencies
export default defineConfig({
  // No optimizeDeps config
})

// Avoid - manual pre-bundling unless needed
```

### 2. Fast HMR

```typescript
// Good - enable HMR
export default defineConfig({
  server: {
    hmr: true,
  },
})
```

### 3. Efficient Watch

```typescript
// Good - default watch
export default defineConfig({
  server: {
    // Default watch is efficient
  },
})
```

## Build Performance

### 1. Efficient Bundling

```typescript
// Good - use esbuild
export default defineConfig({
  build: {
    minify: 'esbuild',
  },
})
```

### 2. Code Splitting

```javascript
// Good - dynamic imports
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
]
```

### 3. Tree Shaking

```javascript
// Good - named exports
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// Avoid - default exports for multiple functions
```

## Runtime Performance

### 1. Minimal Bundle Size

```typescript
// Good - manual chunks
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
```

### 2. Asset Optimization

```typescript
// Good - asset limits
export default defineConfig({
  build: {
    assetsInlineLimit: 4096,
  },
})
```

### 3. Compression

```typescript
// Good - enable compression
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression(),
  ],
})
```

## Best Practices

### 1. Measure Performance

```bash
# Measure build time
bun run build

# Measure bundle size
bunx rollup-plugin-visualizer
```

### 2. Optimize Dependencies

```typescript
// Good - optimize only when needed
export default defineConfig({
  optimizeDeps: {
    include: ['problematic-lib'],
  },
})
```

### 3. Use Modern Targets

```typescript
// Good - modern target
export default defineConfig({
  build: {
    target: 'esnext',
  },
})
```

## สรุป

Performance First Principle ของ Vite:
- ใช้ native browser capabilities
- Lazy load modules
- Minimal overhead
- Efficient bundling
- Code splitting
- Tree shaking

ทำตาม principle นี้จะได้ performance ที่ดีที่สุด

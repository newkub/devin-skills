# Performance

## Performance Characteristics ของ Vite

Vite ถูกออกแบบมาเพื่อ performance สูงในทุกขั้นตอนของ development และ production

## Development Performance

### Cold Start Speed

Vite ใช้ Native ESM ทำให้ cold start เร็วกว่า bundlers แบบเดิมมาก

| Scenario | Time | Comparison |
|----------|------|------------|
| Vite (small project) | < 1s | 10-100x faster |
| Vite (large project) | 1-3s | 10-50x faster |
| Webpack (small project) | 5-10s | Baseline |
| Webpack (large project) | 30-60s | Baseline |

### HMR (Hot Module Replacement)

Vite ให้ HMR ที่รวดเร็วและ preserve state ได้ดี

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,  // Show error overlay
    },
  },
})
```

**HMR Performance:**
- CSS changes: < 100ms
- Component changes: < 200ms
- Large file changes: < 500ms

## Build Performance

### Build Speed

Vite ใช้ Rollup สำหรับ production build ซึ่งเร็วและ optimized

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'esbuild',  // Use esbuild for minification (default)
    sourcemap: true,    // Generate sourcemaps
  },
})
```

| Build Mode | Time | Output Size |
|------------|------|-------------|
| Development | Instant | Not bundled |
| Production | 10-30s | Optimized |
| Library Mode | 5-15s | ESM + CJS |

### Code Splitting

Vite ทำ code splitting อัตโนมัติตาม dynamic imports

```typescript
// Automatic code splitting
const module = await import('./heavy-module.ts')
```

**Benefits:**
- Load only needed code
- Faster initial load
- Better caching

## Optimization Techniques

### 1. Dependency Pre-bundling

Vite pre-bundle dependencies ด้วย esbuild เพื่อความเร็ว

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['lodash'],  // Force pre-bundling
    exclude: ['some-esm-only-lib'],  // Skip pre-bundling
  },
})
```

### 2. Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',           // Target modern browsers
    minify: 'terser',           // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true,     // Remove console logs
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {          // Manual chunk splitting
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
```

### 3. Asset Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    assetsInlineLimit: 4096,   // Inline assets < 4KB
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
```

## Performance Monitoring

### Build Analysis

ใช้ `rollup-plugin-visualizer` เพื่อ visualize bundle size

```bash
bun add -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({ open: true }),
  ],
})
```

### Bundle Size Monitoring

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    reportCompressedSize: true,  // Report compressed size
    chunkSizeWarningLimit: 500,  // Warn if chunk > 500KB
  },
})
```

## Best Practices

### 1. Use Dynamic Imports

```typescript
// Good - Lazy load
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

// Bad - Load immediately
import HeavyComponent from './HeavyComponent.vue'
```

### 2. Optimize Dependencies

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
    ],
  },
})
```

### 3. Use Modern Build Targets

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',  // Use modern syntax
  },
})
```

### 4. Enable Compression

```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
})
```

## Performance Benchmarks

### Development Server

| Metric | Vite | Webpack | Parcel |
|--------|------|---------|--------|
| Cold Start | 1-3s | 30-60s | 10-20s |
| HMR Update | < 200ms | 1-2s | 500ms-1s |
| Memory Usage | ~200MB | ~500MB | ~300MB |

### Production Build

| Metric | Vite | Webpack | Parcel |
|--------|------|---------|--------|
| Build Time | 10-30s | 30-60s | 20-40s |
| Bundle Size | Optimized | Optimized | Optimized |
| Tree Shaking | Excellent | Good | Good |

## Troubleshooting

### Slow HMR

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: false,  // Disable polling (default)
    },
  },
})
```

### Slow Build

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'esbuild',  // Use esbuild instead of terser
  },
})
```

### Large Bundle Size

1. Analyze bundle with `rollup-plugin-visualizer`
2. Use dynamic imports for heavy modules
3. Configure manual chunks
4. Remove unused dependencies

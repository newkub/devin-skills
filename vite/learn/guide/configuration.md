# Configuration

## Purpose

แนะนำการตั้งค่า Vite configuration ด้วย vite.config.ts

## Scope

- Config File
- Server Options
- Build Options
- Resolve Options
- CSS Options
- OptimizeDeps Options

## Config File

Vite รองรับ config file หลาย format:

| File | Type | Description |
|------|------|-------------|
| `vite.config.ts` | TypeScript | แนะนำ - พร้อม type checking |
| `vite.config.js` | JavaScript | สำหรับ CJS projects |
| `vite.config.mts` | TypeScript | ESM syntax |
| `vite.config.mjs` | JavaScript | ESM syntax |

## Basic Configuration

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  // Configuration options
})
```

## Server Options

```typescript
export default defineConfig({
  server: {
    port: 5173,           // Dev server port
    host: false,         // Expose to network (true = '0.0.0.0')
    https: false,        // Enable HTTPS
    open: false,         // Open browser on startup
    proxy: {},           // Proxy configuration
    cors: true,          // Enable CORS
    hmr: {},             // HMR configuration
    watch: {},           // File watcher options
    strictPort: false,   // Exit if port is in use
  },
})
```

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|--------|
| `port` | `number` | `5173` | Dev server port |
| `host` | `string \| boolean` | `false` | Host ที่ bind |
| `https` | `ServerOptions \| boolean` | `false` | HTTPS configuration |
| `open` | `boolean \| string` | `false` | เปิด browser อัตโนมัติ |
| `proxy` | `Record<string, string \| ProxyOptions>` | `{}` | Proxy settings |
| `strictPort` | `boolean` | `false` | ไม่ใช้ port อื่นถ้าใช้แล้ว |

## Build Options

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',            // Output directory
    assetsDir: 'assets',       // Static assets directory
    sourcemap: false,          // Generate source maps
    minify: 'esbuild',         // Minifier
    target: 'es2020',         // Build target
    cssCodeSplit: true,       // CSS code splitting
    cssMinify: true,          // Minify CSS
    rollupOptions: {},         // Rollup options
    lib: {},                  // Library mode
    ssr: {},                  // SSR options
  },
})
```

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|--------|
| `outDir` | `string` | `dist` | Output directory |
| `assetsDir` | `string` | `assets` | Assets subdirectory |
| `sourcemap` | `boolean \| 'inline'` | `false` | Source map generation |
| `minify` | `'esbuild' \| 'terser' \| false` | `'esbuild'` | Minifier |
| `target` | `string \| string[]` | `'es2020'` | Build target |
| `cssCodeSplit` | `boolean` | `true` | แบ่ง CSS เป็น chunks |

## Resolve Options

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '~': '/src',
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
})
```

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|--------|
| `alias` | `Record<string, string>` | `{}` | Path aliases |
| `extensions` | `string[]` | (see list) | File extensions |

## CSS Options

```typescript
export default defineConfig({
  css: {
    devSourcemap: true,          // CSS source maps
    preprocessorOptions: {},    // Preprocessor settings
    modules: {},                // CSS modules settings
    postcss: {},                 // PostCSS configuration
  },
})
```

| Option | คำอธิบาย |
|--------|----------|
| `devSourcemap` | เปิด source map ใน dev mode |
| `preprocessorOptions` | Settings สำหรับ CSS preprocessors |
| `modules` | CSS modules configuration |
| `postcss` | PostCSS config หรือ path |

## OptimizeDeps Options

```typescript
export default defineConfig({
  optimizeDeps: {
    include: [],              // Dependencies ที่ต้อง pre-bundle
    exclude: [],              // Dependencies ที่ไม่ต้อง pre-bundle
    force: false,             // Force re-bundle
  },
})
```

| Option | คำอธิบาย |
|--------|----------|
| `include` | Dependencies เพิ่มเติมสำหรับ pre-bundle |
| `exclude` | Dependencies ที่ยกเว้นจาก pre-bundle |
| `force` | Force ทำการ re-bundle ใหม่ |

## Common Patterns

### Conditional Config

```typescript
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      server: { port: 5173 }
    }
  } else {
    return {
      build: { outDir: 'dist' }
    }
  }
})
```

### With Multiple Plugins

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    react(),
  ],
})
```

### Proxy Configuration

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

## Summary

| Category | Key Options |
|----------|-------------|
| **Server** | `port`, `host`, `proxy`, `https` |
| **Build** | `outDir`, `minify`, `target`, `sourcemap` |
| **Resolve** | `alias`, `extensions` |
| **CSS** | `preprocessorOptions`, `modules` |
| **Optimization** | `optimizeDeps.include`, `optimizeDeps.exclude` |

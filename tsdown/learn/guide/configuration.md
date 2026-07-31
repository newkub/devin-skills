# Configuration

## การตั้งค่า tsdown

### Basic Configuration

สร้าง `tsdown.config.ts` ที่ root ของ project:

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
});
```

## Configuration Options

### entry

Entry point ของ library

```typescript
{
  entry: './src/index.ts',  // Single entry
  // หรือ multiple entries
  entry: {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
  },
}
```

### format

Output formats ที่ต้องการ

```typescript
{
  format: ['esm', 'cjs'],  // รองรับทั้ง ESM และ CJS
  // หรือ
  format: ['esm', 'cjs', 'iife', 'umd'],
}
```

**Available formats:**
- `esm` - ES Modules
- `cjs` - CommonJS
- `iife` - Immediately Invoked Function Expression
- `umd` - Universal Module Definition

### dts

สร้าง TypeScript declarations

```typescript
{
  dts: true,  // Enable declaration generation
}
```

### outDir

Output directory

```typescript
{
  outDir: './dist',  // Default: './dist'
}
```

### clean

Clean output directory ก่อน build

```typescript
{
  clean: true,  // Default: false
}
```

### sourcemap

Generate source maps

```typescript
{
  sourcemap: true,  // Default: false
}
```

### external

Mark dependencies as external

```typescript
{
  external: ['react', 'lodash'],  // Don't bundle these
  // หรือใช้ regex
  external: [/^react/],
}
```

### minify

Minify output

```typescript
{
  minify: true,  // Default: false
}
```

### target

Target environment

```typescript
{
  target: 'es2020',  // Default: 'esnext'
  // หรือ
  target: ['chrome90', 'node16'],
}
```

### plugins

Add plugins

```typescript
import { defineConfig } from 'tsdown';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: './src' },
      ],
    }),
  ],
});
```

### tsconfig

Custom TypeScript config path

```typescript
{
  tsconfig: './tsconfig.build.json',
}
```

### watch

Watch mode สำหรับ development

```typescript
{
  watch: true,  // Enable watch mode
}
```

## ตัวอย่าง Configuration ทั้งหมด

```typescript
import { defineConfig } from 'tsdown';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  // Entry point
  entry: {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
  },
  
  // Output formats
  format: ['esm', 'cjs'],
  
  // TypeScript declarations
  dts: true,
  
  // Output directory
  outDir: './dist',
  
  // Clean before build
  clean: true,
  
  // Source maps
  sourcemap: true,
  
  // External dependencies
  external: ['react', 'react-dom'],
  
  // Target environment
  target: 'es2020',
  
  // TypeScript config
  tsconfig: './tsconfig.json',
  
  // Plugins
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: './src' },
      ],
    }),
  ],
});
```

## CLI Options

```bash
# Build with custom config
tsdown --config tsdown.config.ts

# Watch mode
tsdown --watch

# Clean build
tsdown --clean

# Custom output directory
tsdown --outDir ./build

# Enable source maps
tsdown --sourcemap
```

## Environment Variables

```bash
# Set environment
NODE_ENV=production tsdown

# Custom config path
TSDOWN_CONFIG=./custom.config.ts tsdown
```

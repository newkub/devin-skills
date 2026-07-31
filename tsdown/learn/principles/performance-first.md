# Performance First

## Performance First Principle

tsdown ถูกออกแบบมาเพื่อ performance สูงสุดในทุกขั้นตอน

## Core Principles

### 1. Rust Speed

ใช้ Rolldown (Rust-based) สำหรับความเร็วสูง

```typescript
// Good - let tsdown handle bundling
tsdown build

// Avoid - manual bundling
```

### 2. Automatic DTS

สร้าง TypeScript declarations อัตโนมัติด้วย Oxc

```typescript
// Good - automatic DTS
export default {
  dts: true,
}

// Avoid - manual tsc
```

### 3. Minimal Overhead

ลด overhead ให้น้อยที่สุด

```typescript
// Good - minimal config
export default {
  // Only necessary config
}

// Avoid - excessive config
```

## Development Performance

### 1. Fast Build

```typescript
// Good - let tsdown handle everything
tsdown build

// Avoid - manual configuration unless needed
```

### 2. Efficient Watch

```typescript
// Good - default watch
tsdown build --watch

// Avoid - custom watch unless needed
```

### 3. Quick Iteration

```bash
# Good - fast rebuild
tsdown build

# Avoid - slow rebuilds
```

## Build Performance

### 1. Efficient Bundling

```typescript
// Good - use Rolldown
export default {
  // Rolldown is fast by default
}
```

### 2. Code Splitting

```typescript
// Good - multiple entry points
export default {
  entry: {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
  },
}
```

### 3. Tree Shaking

```javascript
// Good - named exports
export const add = (a: number, b: number) => a + b
export const subtract = (a: number, b: number) => a - b

// Avoid - default exports for multiple functions
```

## Runtime Performance

### 1. Minimal Bundle Size

```typescript
// Good - tree shaking enabled by default
export default {
  // Rolldown tree shakes automatically
}
```

### 2. Efficient Formats

```typescript
// Good - choose appropriate formats
export default {
  format: ['esm', 'cjs'],
}
```

### 3. No Runtime Overhead

```typescript
// Good - no runtime helpers
// tsdown bundles without runtime overhead
```

## Best Practices

### 1. Measure Performance

```bash
# Measure build time
tsdown build

# Measure bundle size
ls -lh dist/
```

### 2. Optimize Entry Points

```typescript
// Good - minimal entry points
export default {
  entry: './src/index.ts',
}

// Avoid - too many entry points
```

### 3. Use Modern Targets

```typescript
// Good - modern target
export default {
  target: 'esnext',
}
```

## สรุป

Performance First Principle ของ tsdown:
- ใช้ Rolldown (Rust-based)
- Automatic TypeScript declarations
- Minimal overhead
- Efficient bundling
- Code splitting
- Tree shaking

ทำตาม principle นี้จะได้ performance ที่ดีที่สุด

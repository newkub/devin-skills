# Convention Over Configuration

## Convention Over Configuration Principle

tsdown ใช้ conventions เพื่อลด configuration และเพิ่ม developer experience

## Core Conventions

### 1. File Structure

```
my-lib/
├── src/
│   └── index.ts        # Entry point (convention)
├── package.json        # Dependencies (convention)
└── tsdown.config.ts    # Config (optional)
```

### 2. Entry Point

```typescript
// Convention: src/index.ts
export const add = (a: number, b: number) => a + b
export const subtract = (a: number, b: number) => a - b
```

### 3. Config File

```typescript
// Convention: tsdown.config.ts at root
export default {
  // Config here
}
```

## Default Behavior

### 1. Auto-Detect Entry Points

```bash
# Convention: auto-detect from package.json
tsdown build
```

### 2. Build Output

```bash
# Convention: dist/ directory
tsdown build
```

### 3. Multiple Formats

```bash
# Convention: ESM and CJS by default
tsdown build
```

## When to Configure

### 1. Custom Entry Points

```typescript
// Configure when auto-detect doesn't work
export default {
  entry: {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
  },
}
```

### 2. Custom Formats

```typescript
// Configure when default formats aren't enough
export default {
  format: ['esm', 'cjs', 'iife', 'umd'],
}
```

### 3. Custom Plugins

```typescript
// Configure when adding plugins
export default {
  plugins: [commonjs()],
}
```

## Best Practices

### 1. Follow Conventions

```bash
# Good - follow conventions
tsdown build

# Avoid - custom structure unless necessary
```

### 2. Minimal Config

```typescript
// Good - minimal config
export default {
  dts: true,
}

// Avoid - excessive config
export default {
  // Many unnecessary options
}
```

### 3. Use Defaults

```typescript
// Good - use defaults
export default {
  // No config needed
}

// Avoid - override defaults unnecessarily
```

## สรุป

Convention Over Configuration Principle ของ tsdown:
- ใช้ file structure conventions
- Auto-detect entry points
- Default behavior ที่ reasonable
- Configure เมื่อจำเป็นเท่านั้น
- Minimal config
- Follow standards

ทำตาม principle นี้จะได้ developer experience ที่ดีขึ้น

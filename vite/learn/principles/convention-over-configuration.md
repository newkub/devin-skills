# Convention Over Configuration

## Convention Over Configuration Principle

Vite ใช้ conventions เพื่อลด configuration และเพิ่ม developer experience

## Core Conventions

### 1. File Structure

```
my-vite-app/
├── index.html          # Entry point (convention)
├── src/
│   └── main.ts         # Main entry (convention)
├── package.json        # Dependencies (convention)
└── vite.config.ts      # Config (optional)
```

### 2. Entry Point

```html
<!-- Convention: index.html at root -->
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 3. Config File

```typescript
// Convention: vite.config.ts at root
export default defineConfig({
  // Config here
})
```

## Default Behavior

### 1. Dev Server

```bash
# Convention: port 5173
bun run dev

# Convention: host localhost
```

### 2. Build Output

```bash
# Convention: dist/ directory
bun run build
```

### 3. Environment Variables

```bash
# Convention: VITE_ prefix for client vars
VITE_API_URL=https://api.example.com
```

## When to Configure

### 1. Custom Port

```typescript
// Configure when default doesn't work
export default defineConfig({
  server: {
    port: 3000,
  },
})
```

### 2. Custom Build

```typescript
// Configure when default build isn't enough
export default defineConfig({
  build: {
    outDir: 'build',
  },
})
```

### 3. Custom Plugins

```typescript
// Configure when adding plugins
export default defineConfig({
  plugins: [vue()],
})
```

## Best Practices

### 1. Follow Conventions

```bash
# Good - follow conventions
bunx create-vite my-app

# Avoid - custom structure unless necessary
```

### 2. Minimal Config

```typescript
// Good - minimal config
export default defineConfig({
  plugins: [vue()],
})

// Avoid - excessive config
export default defineConfig({
  // Many unnecessary options
})
```

### 3. Use Defaults

```typescript
// Good - use defaults
export default defineConfig({
  // No config needed
})

// Avoid - override defaults unnecessarily
```

## สรุป

Convention Over Configuration Principle ของ Vite:
- ใช้ file structure conventions
- Default behavior ที่ reasonable
- Configure เมื่อจำเป็นเท่านั้น
- Minimal config
- Follow standards

ทำตาม principle นี้จะได้ developer experience ที่ดีขึ้น

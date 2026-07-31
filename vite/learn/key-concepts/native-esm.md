# Native ESM

## Native ESM คืออะไร

Native ECMAScript Modules (ESM) คือมาตรฐาน module system ของ JavaScript ที่รองรับโดย browsers และ Node.js โดยตรง

## ทำงานอย่างไร

### 1. Module Syntax

```javascript
// Named exports
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// Default export
export default function multiply(a, b) {
  return a * b
}

// Import
import { add, subtract } from './math.js'
import multiply from './math.js'
```

### 2. Dynamic Imports

```javascript
// Load module on demand
const module = await import('./heavy-module.js')
```

### 3. Module Resolution

Vite ใช้ browser's native module resolution แทน bundling ใน development

```javascript
// Vite resolves this natively
import Button from './components/Button.vue'
```

## ข้อดีของ Native ESM

### 1. Performance

- **No Bundling**: ไม่ต้อง bundle ใน development
- **Fast Load**: Browser โหลด modules แยกกัน
- **Cache**: Browser cache modules แยกกัน

### 2. Developer Experience

- **Standard Syntax**: ใช้ syntax มาตรฐาน
- **Better Debugging**: Source maps ทำงานได้ดีขึ้น
- **Hot Reload**: HMR ทำงานได้รวดเร็ว

### 3. Modern

- **Future-Proof**: เป็นมาตรฐานของ JavaScript
- **Tree Shaking**: Native tree shaking support
- **Async Loading**: Built-in dynamic imports

## Vite และ Native ESM

### Development Mode

Vite ใช้ Native ESM ใน development mode

```typescript
// vite.config.ts
export default defineConfig({
  // Native ESM is used by default in dev
})
```

### Production Mode

Vite bundle ด้วย Rollup สำหรับ production

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Rollup bundles for production
  },
})
```

## ตัวอย่างการใช้งาน

### 1. Basic Module

```javascript
// src/utils/math.js
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b
```

```javascript
// src/main.js
import { add, subtract } from './utils/math.js'

console.log(add(1, 2)) // 3
```

### 2. Dynamic Import

```javascript
// src/main.js
const heavyModule = await import('./heavy-module.js')
heavyModule.doSomething()
```

### 3. Re-exports

```javascript
// src/utils/index.js
export { add, subtract } from './math.js'
export { formatDate } from './date.js'
```

```javascript
// src/main.js
import { add, formatDate } from './utils/index.js'
```

## ข้อจำกัด

### 1. Browser Support

ต้องใช้ browsers ที่รองรับ ESM

```javascript
// Check for ESM support
if (typeof Symbol !== 'undefined' && Symbol.asyncIterator) {
  // ESM supported
}
```

### 2. File Extensions

ต้องระบุ file extensions ใน imports

```javascript
// Required
import { add } from './math.js'

// Not required in some cases but recommended
import { add } from './math'
```

### 3. Protocol

ต้องใช้ correct protocol

```javascript
// In browser
import { add } from '/src/math.js'

// In Node.js
import { add } from './math.js'
```

## Best Practices

### 1. Use Named Exports

```javascript
// Good
export const add = (a, b) => a + b

// Avoid
export default const add = (a, b) => a + b
```

### 2. Keep Modules Small

```javascript
// Good - small, focused modules
export const add = (a, b) => a + b
export const subtract = (a, b) => a - b

// Avoid - large, unfocused modules
export const math = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  // ... many more functions
}
```

### 3. Use Dynamic Imports for Heavy Modules

```javascript
// Good - lazy load
const heavyModule = await import('./heavy-module.js')

// Avoid - eager load
import heavyModule from './heavy-module.js'
```

## สรุป

Native ESM เป็นมาตรฐาน module system ของ JavaScript ที่ Vite ใช้ใน development mode เพื่อ:
- Performance ที่ดีขึ้น
- Developer experience ที่ดีขึ้น
- Modern JavaScript ที่ future-proof

ใน production mode Vite ใช้ Rollup เพื่อ bundle modules สำหรับ performance ที่ดีขึ้น

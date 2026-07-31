# Code Organization Patterns

## 1. Barrel Exports

ใช้ `index.ts` สำหรับ re-export

```typescript
// src/components/index.ts
export { default as Button } from './Button.vue'
export { default as Input } from './Input.vue'
export { default as Modal } from './Modal.vue'

// Usage
import { Button, Input, Modal } from '@/components'
```

## 2. Path Aliases

ตั้งค่า path aliases สำหรับ clean imports

```typescript
// vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
})
```

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

## 3. Dynamic Imports

Lazy load components และ modules

```typescript
// Vue
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

// React
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Router
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
]
```

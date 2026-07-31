# Integrations

## 1. Testing Frameworks

### Vitest

Unit testing framework ที่ built-in กับ Vite

```bash
bun add -D vitest @vitest/ui
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

### Playwright

E2E testing สำหรับ Vite projects

```bash
bun add -D @playwright/test
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
})
```

## 2. CSS Frameworks

### Tailwind CSS

```bash
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

```css
/* tailwind.config.js */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### UnoCSS

```bash
bun add -D unocss
```

```typescript
// vite.config.ts
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
})
```

## 3. State Management

### Pinia (Vue)

```bash
bun add pinia
```

```typescript
// src/stores/index.ts
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
```

### Zustand (React)

```bash
bun add zustand
```

```typescript
// src/store.ts
import create from 'zustand'

export const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

## 4. Routing

### Vue Router

```bash
bun add vue-router
```

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

export default router
```

### React Router

```bash
bun add react-router-dom
```

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---
title: Setup SolidJS
description: ติดตั้งและตั้งค่า SolidJS ใน project
auto_execution_mode: 3
---

## Goal

ติดตั้งและตั้งค่า SolidJS สำหรับสร้าง reactive applications

## Scope

- ติดตั้ง SolidJS ด้วย Bun
- ตั้งค่า Vite สำหรับ SolidJS
- ตั้งค่า TypeScript
- สร้าง component แรก
- ตั้งค่า JSX transform

## Execute

### 1. ติดตั้ง SolidJS

```bash
# สร้าง project ใหม่
bun create vite my-app --template solid-ts

# หรือติดตั้งใน project ที่มีอยู่
bun add solid-js
bun add -D vite-plugin-solid
```

### 2. ตั้งค่า Vite config

สร้างหรือแก้ไข `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
})
```

### 3. ตั้งค่า TypeScript

สร้าง `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. สร้าง component แรก

สร้าง `src/App.tsx`:

```tsx
import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <h1>Hello SolidJS</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </div>
  )
}

export default App
```

### 5. สร้าง entry point

สร้าง `src/index.tsx`:

```tsx
import { render } from 'solid-js/web'
import App from './App'

render(() => <App />, document.getElementById('root')!)
```

### 6. สร้าง HTML

สร้าง `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SolidJS App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

### 7. เพิ่ม scripts ใน package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 8. รัน development server

```bash
bun run dev
```

## Rules

### Installation

- ใช้ `bun add solid-js` สำหรับ installation
- ใช้ `bun add -D vite-plugin-solid` สำหรับ dev dependency

### Configuration

- ตั้งค่า `vite.config.ts` ให้ใช้ `vite-plugin-solid`
- ตั้งค่า `tsconfig.json` ให้รองรับ JSX และ modern TypeScript
- ใช้ `jsx: "preserve"` สำหรับ JSX transform

### Component Structure

- ใช้ `createSignal` สำหรับ reactive state
- ใช้ `render` จาก `solid-js/web` สำหรับ mount component
- ใช้ TypeScript สำหรับ type safety

### Development

- ใช้ `bun run dev` สำหรับ development server
- ใช้ `bun run build` สำหรับ production build
- ใช้ `bun run preview` สำหรับ preview build

## Expected Outcome

- SolidJS project ที่ติดตั้งและตั้งค่าเรียบร้อย
- Vite ที่ config สำหรับ SolidJS
- TypeScript ที่ตั้งค่ารองรับ JSX
- Component แรกที่ใช้ `createSignal`
- Development server ที่พร้อมใช้งาน

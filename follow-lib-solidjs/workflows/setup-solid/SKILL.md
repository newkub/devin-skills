---
name: follow-lib-solidjs-setup-solid
description: ติดตั้ง SolidJS — vite plugin, JSX/TS config, render root, dev/build setup
argument-hint: "[template]"
related:
  - follow-lib-solidjs
  - follow-tool-vite
  - run-dev
  - run-build
  - resolve-errors
---

## Goal

ติดตั้ง SolidJS app — vite + babel-preset-solid, tsconfig JSX config, render root, dev/build pipeline

## Scope

first-time SolidJS setup — SolidStart (SSR framework) เป็นตัวเลือกอื่น; การเขียน components → `build-components`

## Execute

### 1. Scaffold Or Add

```bash
bun create solid my-app          # official templates (vite + solid-ts / solid-js)
cd my-app && bun i
```

หรือเพิ่มเข้า vite project เดิม:

```bash
bun i solid-js && bun i -D vite-plugin-solid
```

```ts
// vite.config.ts
import solid from 'vite-plugin-solid'
export default defineConfig({ plugins: [solid()] })
```

### 2. TSConfig JSX

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true
  }
}
```

- `jsx: "preserve"` + `jsxImportSource: "solid-js"` — vite-plugin-solid transform ผ่าน babel

### 3. Entry Point

```tsx
// src/index.tsx
import { render } from 'solid-js/web'
import App from './App'
render(() => <App />, document.getElementById('root')!)
```

- `render(() => <App/>, root)` — mount once; ไม่มี re-render root pattern แบบ React

### 4. Dev And Build

1. `bun run dev` — vite dev + solid HMR
2. `bun run build` — production bundle
3. `/run-dev` verify; fail → `/resolve-errors` max 3 รอบ

### 5. Ecosystem Add-ons (optional)

- `@solidjs/router` — file/app routing; `@solidjs/meta` — head management
- `@solid-primitives/*` — utility primitives; `@tanstack/solid-query` — data fetching
- SolidStart เมื่อต้องการ SSR/SSR+streaming (แยก framework)

## Rules

- `jsxImportSource: "solid-js"` ทุก tsconfig — ไม่งั้น JSX compile เป็น React
- เลือก `solid-js` core หรือ `solid-start` (app framework) — ห้ามปนกัน
- `solid()` vite plugin บังคับ — JSX transform ของ solid ผ่าน babel เท่านั้น
- Component file `.tsx`; `entry server` ใช้ `renderToString` เฉพาะ SSR

## Expected Outcome

- `bun run dev` ขึ้น, JSX compile ถูก, HMR ทำงาน
- Build ออก bundle พร้อม deploy

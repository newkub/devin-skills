---
name: follow-lib-solidjs-test-solid
description: Test SolidJS — @solidjs/testing-library, vitest config, user-event, assertions บน fine-grained DOM
argument-hint: "[scope]"
related:
  - follow-lib-solidjs
  - run-test
  - resolve-errors
  - improve-coverage
---

## Goal

เขียน tests สำหรับ SolidJS — `@solidjs/testing-library`, vitest browser/jsdom setup, user interactions, async assertions

## Scope

component + signal testing — vitest + `@solidjs/testing-library` + jsdom/happy-dom; e2e → Playwright skill

## Execute

### 1. Setup

```bash
bun i -D vitest @solidjs/testing-library jsdom @testing-library/jest-dom @testing-library/user-event
```

```ts
// vite.config.ts — test section (vitest reads vite config)
export default defineConfig({
  plugins: [solid()],
  test: { environment: 'jsdom', globals: true },
  resolve: { conditions: ['development', 'browser'] },  // solid ssr/browser conditions
})
```

- `conditions: ['development', 'browser']` — solid ต้องเลือก entry (web) ใน test env
- jest-dom setup file: `import '@testing-library/jest-dom/vitest'`

### 2. Render And Assert

```tsx
import { render, screen, fireEvent } from '@solidjs/testing-library'

it('increments', () => {
  const { unmount } = render(() => <Counter />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
  unmount()
})
```

- `render(() => <Comp />)` — ต้องเป็น function (render-once semantics)
- `screen` queries — `getByRole`/`getByText`/`findBy*` (async); `container` direct access
- `fireEvent` / `user-event` — interactions; async updates flush อัตโนมัติ (ไม่มี act() แบบ React)

### 3. Testing Signals And Stores

```ts
import { createRoot } from 'solid-js'

it('signal', () => createRoot(dispose => {
  const [v, setV] = createSignal(0)
  setV(1); expect(v()).toBe(1)
  dispose()
}))
```

- Primitives ต้องอยู่ใน `createRoot` หรือ component — test โดยตรงผ่าน root wrapper
- Store tests: assert ผ่าน proxy reads; async resources: trigger `refetch`/`mutate` แล้ว assert state

### 4. Async And Boundaries

- `await screen.findByText(...)` — resources resolve
- Suspense tests: assert fallback → content; `ErrorBoundary` — throw ใน component แล้ว assert fallback
- `vi.useFakeTimers()` — debounce/async timing

## Rules

- `render(() => <X/>)` — function wrapper บังคับ (ไม่ใช่ `<X/>` ตรง)
- `conditions` ใน vite config สำคัญ — ไม่ใส่จะ resolve เป็น node/SSR entry → tests พัง
- ไม่มี `act()` — Solid updates synchronous; `await` เฉพาะ async finders/microtask
- Primitives test ผ่าน `createRoot` — อย่าสร้าง signals นอก reactive root ใน tests

## Expected Outcome

- Component tests render + interact + assert ผ่าน testing-library
- Signals/stores/resources testable ผ่าน `createRoot` และ async finders

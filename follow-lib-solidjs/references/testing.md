# Solid.js Testing Reference

## Stack

- `vitest` — runner, assertions, mocking
- `jsdom` — virtual DOM for headless browser simulation
- `@solidjs/testing-library` — render components/directives/primitives with auto cleanup
- `@testing-library/user-event` — realistic user interaction simulation
- `@testing-library/jest-dom` — custom matchers (`toHaveTextContent`, etc.)

## Install

```bash
bun add -D vitest jsdom @solidjs/testing-library @testing-library/user-event @testing-library/jest-dom
```

## Vitest Config

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    transformMode: { web: [/\.[jt]sx?$/] },
  },
})
```

```ts
// test/setup.ts
import '@testing-library/jest-dom'
```

## Component Testing

```tsx
import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library'
import { describe, it, expect, afterEach } from 'vitest'
import { Counter } from './Counter'

afterEach(cleanup)

describe('Counter', () => {
  it('increments on click', () => {
    render(() => <Counter initial={0} />)
    fireEvent.click(screen.getByText('Increment'))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })
})
```

- `render(() => <Component />)` — wraps component in Solid context, auto-registers cleanup
- `cleanup()` after each test unmounts component and disposes reactive roots

## Primitive Testing With `renderHook`

Use for hooks/primitives that don't need DOM:

```tsx
import { renderHook } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'

const { result, owner, cleanup } = renderHook(() => {
  const [count, setCount] = createSignal(0)
  return { count, setCount }
})

expect(result.count()).toBe(0)
result.setCount(5)
expect(result.count()).toBe(5)
```

- Returns `result` (return value), `owner` (for `runWithOwner`), `cleanup`
- If hook doesn't need component context → use `createRoot` + `dispose` directly

## Async Effects With `testEffect`

```tsx
import { testEffect } from '@solidjs/testing-library'
import { createSignal, createEffect } from 'solid-js'

testEffect('runs effect on signal change', (done) => {
  const [count, setCount] = createSignal(0)
  createEffect(() => {
    if (count() > 0) done()
  })
  setCount(1)
})
```

- Use `waitFor` for assertions that depend on async effects
- `testEffect` wraps effect in reactive root with auto cleanup

## Wrapper For Context

```tsx
import { render } from '@solidjs/testing-library'
import { MyProvider } from './MyProvider'

render(() => <Component />, {
  wrapper: (props) => <MyProvider>{props.children}</MyProvider>,
})
```

- Wrapper must always return `props.children` (especially with async context)

## Source

- https://docs.solidjs.com/guides/testing
- https://github.com/solidjs/solid-testing-library
- https://helpmetest.com/blog/solidjs-testing-guide/

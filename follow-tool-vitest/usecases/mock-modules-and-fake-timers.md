# Use Case — Isolate a Module with Mocks and Fake Timers

> Test a service that calls an API and a clock without touching the network or waiting in real time. Source: https://vitest.dev/guide/mocking (accessed 2026-10-20)

## 1. Mock the module boundary

```ts
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createOrder } from "./create-order"
import { api } from "./api"

vi.mock("./api", () => ({ api: { charge: vi.fn() } }))

describe("createOrder", () => {
  beforeEach(() => vi.clearAllMocks())

  it("charges the total once", async () => {
    vi.mocked(api.charge).mockResolvedValue({ id: "ch_1" })
    await createOrder({ items: [{ price: 100, qty: 2 }] })
    expect(api.charge).toHaveBeenCalledTimes(1)
    expect(api.charge).toHaveBeenCalledWith(200)
  })
})
```

`vi.mock` replaces the whole module; `vi.spyOn(api, "charge")` is enough when only one method needs replacing. The path must match what the code under test imports (subpath included).

## 2. Fake timers for retries and timeouts

```ts
it("retries three times with backoff", async () => {
  vi.useFakeTimers()
  vi.mocked(api.charge).mockRejectedValue(new Error("boom"))

  const promise = createOrder({ items: [] })
  await vi.runAllTimersAsync()        // flushes timers and microtasks
  await expect(promise).rejects.toThrow("boom")
  expect(api.charge).toHaveBeenCalledTimes(3)

  vi.useRealTimers()                  // always restore
})
```

Use `vi.advanceTimersByTimeAsync` when you need to assert state between intervals.

## 3. Reset strategy

- `restoreMocks: true` in the config → every test starts clean
- `mockReset()` on a specific fn → drops queued `mockResolvedValueOnce` implementations too
- `vi.unstubAllGlobals()` after stubbing `fetch`/`Date`

## Pitfalls

- Asserting on `mock.calls` after `mockRestore()` → the records are gone; snapshot them first.
- `vi.useFakeTimers()` without `useRealTimers()` → later tests hang in real `setTimeout` waits.
- A `vi.mock` factory referencing a top-level variable declared later → hoisting error; use `vi.hoisted`.
- Mocking the package name when the code imports a subpath (`pkg/sub`) → the mock never applies.

## Related

- `references/apis.md`
- `usecases/coverage-gate-in-ci.md`

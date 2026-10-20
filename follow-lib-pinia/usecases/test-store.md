# Use Case — Unit Test a Store

> Test state, getters, and async actions without mounting a component or hitting the network. Source: https://pinia.vuejs.org/cookbook/testing.html (accessed 2026-10-20)

## 1. Reset Pinia before each test

```ts
// stores/useTodos.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useTodos } from "./useTodos";

beforeEach(() => {
  setActivePinia(createPinia());
});
```

`setActivePinia` is what makes `useTodos()` callable outside a component; a fresh instance per test isolates every store.

## 2. Test initial state and getters

```ts
it("starts empty with no error", () => {
  const todos = useTodos();
  expect(todos.items).toEqual([]);
  expect(todos.openCount).toBe(0);
  expect(todos.hasError).toBe(false);
});
```

Getters on a setup store are plain computed refs — read `todos.openCount` directly, no `.value` on the store instance.

## 3. Mock the network, then test the actions

```ts
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  api: { list: vi.fn(), post: vi.fn() },
}));

it("loads items and clears the loading flag", async () => {
  vi.mocked(api.list).mockResolvedValue([{ id: "1", title: "Ship", done: false }]);

  const todos = useTodos();
  await todos.load();

  expect(todos.items).toHaveLength(1);
  expect(todos.isLoading).toBe(false);
  expect(todos.hasError).toBe(false);
});

it("flags an error when the request fails", async () => {
  vi.mocked(api.list).mockRejectedValue(new Error("boom"));

  const todos = useTodos();
  await todos.load();

  expect(todos.hasError).toBe(true);
  expect(todos.isLoading).toBe(false);
});
```

Both branches matter: a store that leaves `isLoading: true` on failure freezes the UI forever.

## 4. Assert reactivity, not just values

```ts
import { nextTick } from "vue";

it("recomputes the visible list when the filter changes", async () => {
  const todos = useTodos();
  todos.items = [
    { id: "1", title: "A", done: true },
    { id: "2", title: "B", done: false },
  ];

  todos.$patch({ filter: "open" });
  await nextTick();

  expect(todos.visible.map((t) => t.id)).toEqual(["2"]);
});
```

A getter that reads a stale value passes a plain value test but fails this one — that is the point.

## 5. Spy on action calls from components

```ts
const todos = useTodos();
const spy = vi.spyOn(todos, "add").mockResolvedValue();
// mount the component, click the button
expect(spy).toHaveBeenCalledWith("Buy milk");
```

## Pitfalls

- Reusing one Pinia instance across tests leaks state and makes failures order-dependent — always `setActivePinia(createPinia())`.
- Testing through a mounted component when the store can be tested directly adds cost with no extra coverage.
- Forgetting `await` on an async action asserts on the pre-request state and passes for the wrong reason.
- Mocking `fetch` instead of the API module couples the test to the transport layer.
- Reading `todos.someRef.value` — the store unwraps refs, so `.value` is `undefined`.
- Skipping the failure branch leaves `isLoading`/`hasError` regressions undetected.

## Related

- `references/apis.md`
- `best-practices/stores.md`
- `usecases/setup-store-crud.md`
- `usecases/persist-store.md`

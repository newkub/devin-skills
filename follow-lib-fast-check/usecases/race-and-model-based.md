# Use Case — Model-Based Tests and Race Detection

> Check a stateful module against a simple model, and force interleavings that a normal async test never hits. Source: https://fast-check.dev (accessed 2026-10-20)

## 1. Model the behavior

```ts
import fc from "fast-check"

class CartModel {
  items = new Map<string, number>()

  add(sku: string, qty: number) {
    this.items.set(sku, (this.items.get(sku) ?? 0) + qty)
  }

  remove(sku: string) {
    this.items.delete(sku)
  }
}
```

The model is deliberately naive: it is the specification, not the implementation.

## 2. Describe commands

```ts
const addCommand = (cart: Cart) =>
  fc.record({ sku: fc.constantFrom("a", "b", "c"), qty: fc.integer({ min: 1, max: 5 }) })
    .map(({ sku, qty }) => ({
      check: () => true,
      run: (model: CartModel, real: Cart) => {
        model.add(sku, qty)
        real.add(sku, qty)
      },
      toString: () => `add(${sku}, ${qty})`,
    }))
```

Each command mutates both the model and the real object with the same intent.

## 3. Run the command sequences

```ts
const commands = [addCommand, removeCommand]

await fc.assert(
  fc.asyncProperty(fc.commands(commands, { maxCommands: 50 }), async (cmds) => {
    const setup = () => ({ model: new CartModel(), real: new Cart() })
    await fc.modelRun(setup, cmds)
  }),
)
```

On failure the shrinker reports the shortest failing command sequence — usually three lines that expose the bug.

## 4. Detect races with the scheduler

```ts
await fc.assert(
  fc.asyncProperty(fc.scheduler(), async (scheduler) => {
    const store = createStore()

    const write = scheduler.schedule(Promise.resolve().then(() => store.set("x", 1)))
    const read = scheduler.schedule(Promise.resolve().then(() => store.get("x")))

    await scheduler.waitAll()
    await Promise.all([write, read])

    expect(store.get("x")).toBe(1)
  }),
)
```

`scheduler.schedule` gives fast-check control over resolution order, so it explores interleavings a `Promise.all` test would miss.

## Pitfalls

- Checking invariants inside `run` with `if` → throw explicitly or let `check` handle validity; silent skips hide failures.
- Forgetting a command's `toString` → the counterexample prints unreadable objects.
- Using the real timer inside scheduled tasks → the scheduler loses determinism; keep tasks synchronous or promise-based.
- Running `fc.commands` without a model → there is nothing to compare against; the model is the oracle.

## Related

- `references/apis.md`
- `best-practices/fast-check.md`
- `usecases/property-test-invariants.md`

# Use Case — Deep Clone and Structural Equality

> Copy and compare nested data, including `Map`, `Set`, and `Date`, without `JSON.parse(JSON.stringify(x))`. Source: https://es-toolkit.dev/reference/object/cloneDeep.html (accessed 2026-10-20)

## 1. Clone without losing types

```ts
import { cloneDeep } from "es-toolkit";

const snapshot = cloneDeep(order);
snapshot.items.push({ sku: "new", qty: 1 });

console.log(order.items.length, snapshot.items.length); // 2 3
```

`cloneDeep` preserves `Date`, `Map`, `Set`, `RegExp`, and typed arrays. `JSON` round-tripping turns a `Date` into a string, a `Map` into `{}`, and a `Set` into `{}` — the bug usually surfaces days later as a broken comparison.

Clone once per checkout draft. Cloning on every keystroke is a performance bug, not a safety feature.

## 2. Compare structurally

```ts
import { isEqual } from "es-toolkit";

const dirty = !isEqual(draft, saved);

if (dirty) {
  saveButton.disabled = false;
}
```

`isEqual` walks nested objects and handles `Map`/`Set`/`Date` by value. `JSON.stringify(a) === JSON.stringify(b)` breaks on key order and on `undefined` vs missing, so it reports phantom changes.

For large objects, compare a cheap derived value (id, `updatedAt`) instead of deep-walking on every render.

## 3. Copy the parts you mean to change

```ts
import { merge } from "es-toolkit";

const nextConfig = merge({}, baseConfig, overrides);
```

`merge` mutates its first argument — pass `{}` to keep the sources untouched. For arrays, decide explicitly whether the array is replaced or concatenated; `merge` concatenates by index in ambiguous cases, which is rarely what a config overlay wants.

Prefer `{ ...base, nested: { ...base.nested, ...patch } }` for shallow structures. Reach for `merge` only when the tree depth is unknown.

## 4. Verify

1. `/run-test` — `isEqual` on two objects with different key order returns `true`
2. Clone a `Map` and mutate the copy — the original is unchanged
3. `dirty` flips only when a value changes, not when a key is reordered
4. `/run-profiler` — a deep clone of a 5k-item list is not on the render path

## Pitfalls

- `structuredClone` failing on functions or class instances and `cloneDeep` being assumed to do the same — it copies own enumerable properties, not prototypes.
- Using `isEqual` on objects containing functions or class instances, where identity decides the result.
- `merge` with array values, silently producing a longer array than either input.
- Deep-cloning in a selector, which defeats memoisation and re-renders everything.
- Comparing serialised JSON and treating key-order differences as changes.

## Related

- `references/apis.md`
- `best-practices/es-toolkit.md`
- `usecases/group-and-aggregate-data.md`
- `usecases/async-retry-and-timeout.md`

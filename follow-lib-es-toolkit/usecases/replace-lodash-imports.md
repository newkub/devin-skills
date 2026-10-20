# Use Case — Migrate Lodash Imports Without Breaking Behavior

> Drop lodash in two passes: a behavior-identical compat pass, then a core pass that shrinks the bundle. Source: https://es-toolkit.dev/compatibility.html (accessed 2026-10-20)

## 1. Install and switch imports to compat

```bash
bun add es-toolkit
bun remove lodash @types/lodash
```

```ts
// before
import { chunk, debounce, get } from "lodash"

// after — same signatures, same edge-case behavior
import { chunk, debounce, get } from "es-toolkit/compat"
```

`es-toolkit/compat` mirrors lodash 1:1, including mutation semantics, so the test suite should pass unchanged.

## 2. Prove behavior before touching core

```bash
bun test
bun run build
```

If a test fails here, the problem is a compatibility gap, not your refactor. Check the compatibility page for functions compat does not implement (`sortedUniq`, `mixin`, `noConflict`, `runInContext`).

## 3. Move to core one function at a time

```ts
// compat (migration only)
import { uniq } from "es-toolkit/compat"

// core (final target)
import { uniq } from "es-toolkit"
```

Move the functions that exist in core with the same name. Re-run tests after each batch and watch the bundle report.

## 4. Handle the semantic differences explicitly

```ts
// merge/mergeWith mutate the target, like lodash
const merged = merge({}, a, b)

// toMerged returns a new object
const merged = toMerged(a, b)
```

Core drops `isEmpty` and `_.chain`; replace the first with an explicit length/key check and the second with `flow`/`map`/`filter`.

## 5. Keep the imports tree-shakeable

```ts
import { groupBy } from "es-toolkit/array" // submodule keeps bundles small
```

Never `import * as _ from "es-toolkit"` — bundlers cannot tree-shake a namespace import.

## Pitfalls

- Moving to core in the same commit as the compat swap → a failing test has two possible causes; do the passes separately.
- Mixing `es-toolkit` and `es-toolkit/compat` imports in one file → semantics differ (for example shallow clone); pick one per file during migration.
- Assuming core `sortBy` is variadic → it takes one array: `sortBy(users, ["age", "name"])`.
- Leaving compat imports in new code → compat is slower and larger; new files start on core.

## Related

- `references/apis.md`
- `best-practices/es-toolkit.md`
- `usecases/group-and-aggregate-data.md`

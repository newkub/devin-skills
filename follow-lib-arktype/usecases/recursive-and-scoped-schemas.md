# Use Case — Recursive and Scoped Schemas

> Type a tree, a nested comment thread, or any self-referencing structure without circular imports or `any`. Source: https://arktype.io/docs/scope (accessed 2026-10-20)

## 1. Declare the references inside a scope

```ts
import { scope } from "arktype";

const types = scope({
  comment: {
    id: "string.uuid",
    body: "string",
    author: "string",
    replies: "comment[]",
  },
  thread: {
    root: "comment",
    locked: "boolean = false",
  },
}).export();

export const Comment = types.comment;
export const Thread = types.thread;
```

Inside a scope, a string key such as `"comment[]"` resolves against the other declarations instead of being read as a built-in keyword. `.export()` returns real types that can be used anywhere — the scope is the construction step, not a runtime container.

Export the leaf types you actually use. Re-exporting the whole `types` object leaks the declaration order and invites imports of internals.

## 2. Bound the depth at the boundary

```ts
export const ThreadInput = Thread.narrow((t, ctx) => {
  const depth = (node: typeof t.root): number =>
    1 + Math.max(0, ...node.replies.map(depth));
  return depth(t.root) <= 20 || ctx.mustBe("a thread nested at most 20 levels");
});
```

A recursive schema accepts unbounded input, so a hostile payload can nest thousands of levels and blow the stack during validation. Add a depth, a node count, or both before the value reaches your renderer.

## 3. Validate once, then reuse the parsed value

```ts
const parsed = ThreadInput(payload);
if (parsed instanceof type.errors) return badRequest(parsed.summary);
return renderThread(parsed.root);
```

`parsed` is fully typed at every level: `root.replies[0].replies` is `Comment[]`, not `unknown[]`. Pass it down instead of re-validating in the renderer.

## 4. Verify

1. `/run-typecheck` — hover `Comment["replies"]`; it must resolve to `Comment[]`, not a self-referential `any`
2. `/run-test` — a three-level thread round-trips; a 21-level thread is rejected
3. Deep-but-valid input near the limit still passes without a stack overflow
4. `/run-build` — importing the types file from two workspaces does not duplicate the scope

## Pitfalls

- Writing `replies: "comment[]"` outside a scope, where `comment` is parsed as an unknown keyword and fails at definition time.
- Referencing the scope's own `types` object at runtime after `.export()`, keeping a closure alive for no reason.
- A recursive type with no depth limit on a public endpoint — stack exhaustion is a denial of service.
- Rebuilding the scope per request; it is a definition, so build it once at module scope.

## Related

- `references/apis.md`
- `best-practices/arktype.md`
- `usecases/discriminated-union-narrowing.md`
- `usecases/env-config-parsing.md`

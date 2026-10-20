# Use Case — Reusable Components and Per-Request State

> Build a component with props and a slot, then pass request-scoped state without leaking it into other requests. Source: https://edgejs.dev/docs/components (accessed 2026-10-20)

## 1. Component with props and a slot

```edge
{{-- views/components/card.edge --}}
<div class="card {{ $props.class ?? '' }}">
  <h2>{{ $props.title }}</h2>
  <div class="card-body">
    @slot('main')
    @endslot
  </div>
</div>
```

## 2. Use the component

```edge
@component('components/card', { title: 'Revenue', class: 'card--wide' })
  @slot('main')
    <p>{{ formattedTotal }}</p>
  @endslot
@end
```

Use `@!component(...)` when the component renders itself and needs no slot — the `!` auto-closes the block.

## 3. Per-request locals with an isolated renderer

```ts
import { edge } from "./edge.js"

export async function handler(req: Request) {
  const renderer = edge.createRenderer()
  renderer.share({ user: await currentUser(req) })

  return new Response(await renderer.render("dashboard", { stats }))
}
```

`edge.global()` is shared by every request — use it only for constants (app name, asset version). Anything derived from the session belongs in `createRenderer().share()` or the render data object.

## 4. Inline variables inside the template

```edge
@let(subtotal = items.reduce((sum, item) => sum + item.price, 0))
@assign(subtotal = subtotal * 1.07)
<p>{{ subtotal }}</p>
```

`@let` declares once, `@assign` mutates a value already in scope.

## 5. Verify isolation with a test

```ts
const a = edge.createRenderer().share({ user: "a" })
const b = edge.createRenderer().share({ user: "b" })

expect(await a.render("whoami")).toContain("a")
expect(await b.render("whoami")).toContain("b")
```

## Pitfalls

- Storing request data in `edge.global()` → the next request sees the previous user; use a renderer-scoped share.
- Passing every value as render data → components cannot read it; share the values components need.
- Forgetting `@end` after `@component` → the rest of the template becomes part of the slot.
- Using reserved names as locals → `state`/`template`/`$context`/`$filename` are owned by Edge.

## Related

- `references/apis.md`
- `best-practices/edgejs.md`
- `usecases/layouts-and-partials.md`

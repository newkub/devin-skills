# Use Case — Server-Rendered Pages With Layouts and Partials

> Render a full HTML page from one template, a shared layout, a partial, and a loop — no client framework. Source: https://edgejs.dev/docs/introduction (accessed 2026-10-20)

## 1. Create the Edge instance once

```ts
// src/edge.ts
import { Edge } from "edge.js"

export const edge = Edge.create({
  cache: process.env.NODE_ENV === "production",
})

edge.mount(new URL("./views", import.meta.url))
```

## 2. Shared layout with a slot

```edge
{{-- views/components/layout/app.edge --}}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
  </head>
  <body>
    @include('partials/nav')
    <main>
      @slot('main')
      @endslot
    </main>
  </body>
</html>
```

## 3. Page template

```edge
{{-- views/orders/index.edge --}}
@layout.app({ title: 'Orders' })

@slot('main')
  <h1>Orders</h1>
  <ul>
    @each(order in orders)
      <li>{{ order.id }} — {{ order.total }}</li>
    @else
      <li>No orders yet</li>
    @end
  </ul>
@endslot
```

`{{ }}` escapes HTML. Use `{{{ }}}` or `html.safe()` only for trusted markup.

## 4. Render from the HTTP handler

```ts
import { edge } from "./edge.js"

export async function ordersPage() {
  const orders = await db.order.findMany()
  const html = await edge.render("orders/index", { orders })
  return new Response(html, { headers: { "content-type": "text/html" } })
}
```

## Pitfalls

- Leaving `cache` off in production → every request recompiles templates; tie it to `NODE_ENV`.
- Putting `@if`/`@each` on the same line as text → Edge tags must be on their own line; append `~` to swallow the trailing newline.
- Using `{{{ }}}` for user data → unescaped HTML and XSS; keep `{{ }}` unless the content is trusted and sanitized.
- Naming a state variable `template`, `state`, `$context`, or `$filename` → reserved keywords break rendering.

## Related

- `references/apis.md`
- `best-practices/edgejs.md`
- `usecases/components-and-state.md`

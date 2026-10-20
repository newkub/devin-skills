# Use Case — Edge Instance, Globals, and Rendering

> Create the Edge instance once, register the helpers templates need, and render from a controller instead of inside the template. Source: https://edgejs.dev/docs/introduction (accessed 2026-10-20)

## 1. Create one instance at startup

```ts
import { Edge } from "edge.js";

export const edge = new Edge({
  cache: process.env.NODE_ENV === "production",
});

edge.mount(new URL("./views", import.meta.url));
```

`cache: true` compiles a template once and reuses it; in development leave it off so edits are visible without a restart. Mount the views directory once — every extra `mount()` adds a lookup path to every render.

Edge.js is ESM-only. A CommonJS entry that `require`s it fails at load, not at render.

## 2. Register globals before the first render

```ts
edge.global("asset", (path: string) => `/assets/${path}?v=${ASSET_VERSION}`);
edge.global("appName", "Acme");
edge.global("formatMoney", (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100),
);
```

Globals are available in every template without passing them per render. Register them at module scope, before any render call — a global added later is missing from templates that were already compiled with caching on.

Keep globals deterministic: a function reading the request (user, locale) belongs in render state, not in a global.

## 3. Render with explicit state

```ts
const html = await edge.render("posts/show", {
  post,
  comments,
  canEdit: post.authorId === user.id,
});

return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
```

Return the HTML with an explicit content type. Passing the raw string to a framework response helper that guesses `application/json` is a common cause of a blank page.

State is per render and is not shared — that is the property the next use case relies on for request isolation.

## 4. Verify

1. `/run-dev` — edit a template, refresh, see the change without a restart
2. `/run-build` + production start — a template edited at runtime is not picked up (cache is on)
3. `/run-test` — render the same template twice with different state; no value leaks between calls
4. Response headers include `text/html; charset=utf-8`

## Pitfalls

- Creating a new `Edge()` per request, recompiling every template.
- Registering globals after the first cached render, so templates silently miss them.
- `cache: true` in development and concluding the template system is broken.
- Rendering inside another template instead of passing state down.
- Mounting multiple overlapping view roots and wondering which file wins.

## Related

- `references/apis.md`
- `best-practices/edgejs.md`
- `usecases/layouts-and-partials.md`
- `usecases/escaping-and-raw-html.md`

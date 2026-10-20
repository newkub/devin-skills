# Use Case — GraphQL Handlers

> Mock GraphQL by operation name instead of URL, and return the error envelope a real GraphQL server returns. Source: https://mswjs.io/docs/graphql (accessed 2026-10-20)

## 1. Register a query by operation name

```ts
import { graphql, HttpResponse } from "msw";

export const handlers = [
  graphql.query("GetUser", ({ variables }) => {
    return HttpResponse.json({
      data: {
        user: { id: variables.id, name: "Ada", email: "ada@example.com" },
      },
    });
  }),
];
```

GraphQL requests all POST to one URL, so MSW matches on the operation name parsed from the query document. The name must equal the `query GetUser` identifier exactly — renaming the operation in the app silently turns the handler into a miss.

## 2. Handle a mutation and echo the input

```ts
graphql.mutation("CreateUser", async ({ variables }) => {
  const input = variables.input as { name: string; email: string };

  return HttpResponse.json({
    data: { createUser: { id: "usr_2", name: input.name, email: input.email } },
  });
});
```

`variables` is untyped JSON, so narrow it once at the top of the handler. Returning a mapped object rather than the raw input keeps the mock honest about server-generated fields such as `id`.

## 3. Return a GraphQL error, not an HTTP error

```ts
graphql.query("GetUser", () => {
  return HttpResponse.json({
    errors: [
      {
        message: "User not found",
        path: ["user"],
        extensions: { code: "NOT_FOUND" },
      },
    ],
    data: null,
  });
});
```

A GraphQL server answers `200 OK` with an `errors` array; a `500` means the transport broke. Client code that branches on `extensions.code` never sees it if the mock sends a status code instead, so the test proves the wrong path.

## 4. Scope a handler to one endpoint

```ts
const github = graphql.link("https://api.github.com/graphql");

export const handlers = [
  github.query("Viewer", () => HttpResponse.json({ data: { viewer: { login: "octocat" } } })),
];
```

Two APIs can both define `GetUser`. `graphql.link(url)` restricts the handler to that endpoint, which is the only way to disambiguate them.

## 5. Override one operation for one test

```ts
import { graphql, HttpResponse } from "msw";
import { server } from "../mocks/node";

it("renders the empty state when the query returns null", async () => {
  server.use(graphql.query("GetUser", () => HttpResponse.json({ data: { user: null } })));

  render(<Profile id="usr_404" />);
  expect(await screen.findByText("No profile yet")).toBeInTheDocument();
});
```

The override is registered on top of the initial handlers and disappears on `resetHandlers()`. Editing the shared handler instead makes every other test depend on this one's scenario.

## 6. Verify

1. `/run-test` — a component using `GetUser` renders the mocked user
2. Rename the operation in the app without renaming the handler — the test fails loudly (with `onUnhandledRequest: "error"`)
3. A `NOT_FOUND` case renders the error branch, and the network panel shows `200`
4. `Viewer` resolves only for the linked endpoint
5. `/run-verify` — no `any` on `variables`

## Pitfalls

- Matching by URL only, so every GraphQL operation returns the same body.
- Returning `{ message }` at the top level instead of `{ errors: [...] }`.
- Sending `status: 500` for a domain error, which bypasses the client's GraphQL error handling.
- Leaving `data` out of an error response when the client expects `data: null`.
- Forgetting `graphql.link` when two APIs share an operation name.
- Typing `variables` as the generated GraphQL type without validating — the mock then lies in the same way the app would.
- Upgrading to msw v3 without moving the import: GraphQL lives in `msw/graphql` there.

## Related

- `references/apis.md`
- `best-practices/handlers.md`
- `best-practices/wiring.md`
- `usecases/mock-api-in-tests.md`
- `usecases/error-simulation-and-delays.md`

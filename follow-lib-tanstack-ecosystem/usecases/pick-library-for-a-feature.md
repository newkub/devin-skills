# Use Case — Pick the Right Library for a Feature

> Turn a feature description into one TanStack library, with its maturity checked before committing. Source: https://tanstack.com/libraries (accessed 2026-10-20)

## 1. Classify the need

| Need in the feature | Library |
|---------------------|---------|
| fetch/cache server data | `Query` |
| client-only state shared across components | `Store` |
| type-safe routing | `Router` |
| SSR, server functions, full-stack | `Start` |
| form state + schema validation | `Form` |
| headless data grid | `Table` |
| long list that must stay smooth | `Virtual` |
| local-first reactive data with sync | `DB` |
| provider-agnostic AI chat/tools | `AI` |
| debounce, throttle, rate limit | `Pacer` |

Write the classification down before installing anything. A feature that lists three libraries usually has one real need and two habits.

## 2. Apply the boundaries

1. `Query` and `Store` are not substitutes — server state goes to `Query`, derived client state to `Store`
2. `Router` and `Start` support React and Solid only; on Vue or Svelte use that framework's router
3. `Start` already contains `Router` — installing both as separate top-level choices duplicates the tree
4. `Table` is headless — it renders nothing, so a UI layer is part of the estimate
5. `Virtual` is for lists that actually hurt; a 50-row list does not

## 3. Check maturity before committing

Read the library's maturity in `/follow-lib-tanstack-ecosystem` before choosing. Stable lines can carry product features; `0.x` or alpha lines are for work where an API change is an acceptable cost. For a `0.x` pick, record the exact installed version so a later upgrade is a deliberate act.

## 4. Confirm with the user when two options both fit

If the need maps to `DB` versus `Query`+`Store`, or `Start` versus `Router` on an existing Vite app, that is a product decision, not a code decision. Stop and `/ask-me` with the trade-off rather than guessing.

## 5. Write the decision into the plan

Record: the need, the chosen library, the rejected alternative, and the maturity risk. The next person reading the commit should not have to re-derive it.

## Pitfalls

- Installing the whole ecosystem "so it is available", which turns a feature branch into a dependency audit.
- Choosing `DB` for what is really server state, then building a sync layer nobody asked for.
- Reading a library's version number as a stability guarantee — check the maturity note, not the semver.
- Picking `Table` and only then discovering that sorting/filtering/pagination must all be implemented.

## Related

- `references/apis.md`
- `best-practices/tanstack-ecosystem.md`
- `usecases/integrate-a-new-library.md`

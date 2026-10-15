# SolidJS — Rendering, Control Flow and Async

Best practices for control flow components, lists, resources, and rendering performance

## Recommended Patterns

### Pick the Right Control Flow

| Component | Use case |
|---|---|
| `<For>` | keyed lists — items tracked by reference, suits object arrays that reorder/insert/remove |
| `<Index>` | unkeyed lists — tracked by index, suits primitives or lists whose item values change at fixed positions |
| `<Show>` | conditional render — use the callback form `{(v) => ...}` for type narrowing |
| `<Switch>`/`<Match>` | multi-branch conditions — picks the first matching branch |
| `<Dynamic>` | dynamic component — renders a component from a variable |
| `<Portal>` | render outside the DOM tree (modals, tooltips) |
| `<ErrorBoundary>` | catch errors in a subtree |
| `<Suspense>` | async boundary waiting for resources/lazy components |

```tsx
// keyed list — For tracks by item reference
<For each={users()}>{user => <UserCard user={user} />}</For>

// never — mapping directly recreates every element of the array on each update
{users().map(user => <UserCard user={user} />)}
```

### Async Data — `createResource`

```ts
const [data, { refetch, mutate }] = createResource(userId, fetchUser)
```

- The source (first arg) is reactive — it changes and a refetch runs automatically; pass `false`/`null` when no dependency is wanted
- `mutate` for optimistic updates, `refetch` for reloads
- Use `data.latest` when you want the last resolved value (skipping the loading state)
- Never fetch via `createEffect` + signal — the resource handles dedup/cancellation/suspense for you

### Code Splitting and Lazy

- `lazy(() => import('./Heavy'))` for large components / route-level splitting
- Wrap in `<Suspense>` to define the fallback — avoid nested Suspense more than necessary
- Preload on hover/focus for smooth UX: `<Link onMouseEnter={() => import('./Page')}>`

## Common Pitfalls

- Using `.map()` directly in JSX → destroys fine-grained updates, recreates the DOM for the whole list
- Using `<Index>` for a frequently reordered list → DOM bound to indexes lands on wrong items — use `<For>` instead
- Forgetting the `<Show>` fallback → a blank page instead of a placeholder
- `createResource` without a reactive source → fetches once and never refetches when params change
- A nested `<Suspense>` at every component → waterfall loading — collapse boundaries to fewer
- Rendering a `<Portal>` without cleanup context — portal children stay reactive to the parent scope

## Do / Don't

| Do | Don't |
|---|---|
| Use `<For>` for arrays of objects | Use `.map()`/`Array.map` in JSX on reactive arrays |
| Use `<Index>` for primitives/static-length lists | Use `<Index>` when items reorder often |
| Use `<Show keyed>` to reset state when the value changes | Unintentionally reuse DOM across conditions |
| Use `createResource` + `<Suspense>` for async | Fetch in `createEffect` then set a signal |
| Split routes with `lazy()` | Bundle every page into the initial chunk |
| Wrap risky subtrees with `<ErrorBoundary>` | Let one error break the whole app |

## Performance Notes

- `<For>` reconciles by reference — it updates only changed items; beware: fetching returns a whole new array, which relocates all DOM (store `reconcile` helps here)
- Use `createDeferred` for expensive lists/filters — typing stays smooth, results follow later
- `startTransition` for non-blocking navigation/updates — the UI doesn't jank during heavy re-renders
- Virtualization: lists of thousands+ rows need `@tanstack/solid-virtual` — `<For>` does not virtualize
- DOM nodes in Solid are persistent — moving an item in `<For>` moves the real node, not recreates it; don't destroy this advantage with conditional remounts

## Ecosystem / Integration

- SolidStart/Solid Router: `createAsync` replaces `createResource` when SSR streaming data is needed
- TanStack Virtual: `@tanstack/solid-virtual` pairs with `<For>` for virtualized rows
- Forms: `@tanstack/solid-form` or Modular Forms — avoid React's controlled-input patterns (Solid inputs are uncontrolled-by-default and work better)
- Animation: `solid-transition-group` or an animejs wrapper — exit animations need a transition group since Solid removes DOM immediately
- Devtools: `solid-devtools` helps inspect the reactive graph — use it when debugging unexpected dependencies

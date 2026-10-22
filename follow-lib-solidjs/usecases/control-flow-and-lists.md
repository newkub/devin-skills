# Use Case — Lists, Selection, and Conditional Blocks

> `<For>` reconciles by item identity and `<Index>` by position — picking the wrong one either loses input state or paints the wrong value, and no type error tells you. Source: https://docs.solidjs.com/reference/secondary-primitives/create-selector (accessed 2026-10-20)

## 1. Choose the list primitive by what changes

```tsx
import { For, Index } from "solid-js";

// objects that insert, remove, or reorder — DOM follows the item
<For each={rows()}>{(row) => <Row row={row} />}</For>

// fixed-length values updated in place — DOM follows the index
<Index each={scores()}>{(score, i) => <Cell value={score()} index={i} />}</Index>
```

`<For>` passes the item itself; `<Index>` passes an accessor plus the index, because only the value at that position changes. A sortable table, a chat log, or a filtered list is `<For>`; a scoreboard or a spreadsheet row is `<Index>`.

## 2. Select a row without invalidating every row

```tsx
import { createSelector, createSignal, For } from "solid-js";

const [selectedId, setSelectedId] = createSignal<number>();
const isSelected = createSelector(selectedId);

<For each={rows()}>
  {(row) => (
    <li
      classList={{ active: isSelected(row.id) }}
      aria-selected={isSelected(row.id)}
      onClick={() => setSelectedId(row.id)}
    >
      {row.name}
    </li>
  )}
</For>
```

`createSelector` keeps one subscription per key, so moving the selection re-runs only the row that lost it and the row that gained it — not all N rows. Comparing `row.id === selectedId()` inside `<For>` would subscribe every row to the signal.

## 3. Reset a block when the record changes

```tsx
import { Show } from "solid-js";

<Show when={user()} keyed fallback={<EmptyState />}>
  {(current) => <ProfileForm initial={current} />}
</Show>
```

Without `keyed`, `<Show>` only toggles on truthiness: switching from user A to user B reuses the same `ProfileForm` instance and keeps A's draft. `keyed` re-creates the block whenever the value identity changes, which is what "open a different record" means. Use plain `<Show>` for pure visibility.

## 4. Branch on more than two states

```tsx
import { createMemo, Match, Switch } from "solid-js";

const error = createMemo(() => (state().status === "error" ? state().error : undefined));

<Switch fallback={<EmptyState />}>
  <Match when={state().status === "loading"}>
    <Skeleton rows={3} />
  </Match>
  <Match when={state().status === "error"}>
    <ErrorPanel error={error()} onRetry={reload} />
  </Match>
  <Match when={state().status === "ready"}>
    <Results data={state().data} />
  </Match>
</Switch>
```

`<Switch>` renders the first matching `<Match>` and nothing else — no stacking `&&` expressions, and the fallback covers the states you forgot. `<Match>` does not narrow the value for its children, so derive the branch-specific value with a `createMemo` (or use the `<Show>` callback form) instead of casting inside the branch.

## 5. Render overlays through `<Portal>`

```tsx
import { Portal } from "solid-js/web";

<Portal mount={document.body}>
  <div class="toast" role="status">{message()}</div>
</Portal>
```

`<Portal>` moves the DOM node out of the layout tree while keeping the reactive owner, so context, signals, and `onCleanup` still work. Mounting it with `render()` or a second `createRoot` is what loses context and leaves listeners behind.

## 6. Verify

1. Reorder a `<For>` list with a text input in each row — the typed value travels with its row
2. Sort the same data in an `<Index>` list — values stay at their index and visibly land on the wrong row (the failure you are avoiding)
3. Click a row — only two rows re-run (log inside the row), and `aria-selected` moves
4. Switch the `user()` record — the form resets to the new record's values
5. Add a fourth status — the fallback renders instead of a blank screen
6. Open the portal — it renders under `body` and still reads an ancestor context

## Pitfalls

- `{rows().map((row) => <Row row={row} />)}` — recreates every node on each change and throws away focus and local state.
- `<Index>` on a list that reorders — the DOM is bound to positions, so values swap underneath the user.
- `<Show>` without `keyed` when opening a different record — stale drafts leak between records.
- `when={user()!}` — the non-null assertion hides the empty state and crashes on the first render.
- Cloning items on each update (`{...row}`) inside `<For>` — a new reference looks like a new item, so the DOM is rebuilt.
- `<Portal>` created outside the component's owner, which loses context and cleanup.
- Nesting `<Suspense>` inside every list row — one boundary per list, not per item.

## Related

- `references/apis.md`
- `best-practices/rendering-and-async.md`
- `usecases/props-composition-and-splitprops.md`
- `usecases/async-data-with-resource.md`

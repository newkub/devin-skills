# SolidJS Reference

> Install, CLI, and version info: see [install-and-cli.md](install-and-cli.md)

## createSignal

```tsx
import { createSignal } from 'solid-js'

function Counter() {
  const [count, setCount] = createSignal(0)
  return (
    <div>
      <button onClick={() => setCount(count() + 1)}>+</button>
      <span>{count()}</span>
    </div>
  )
}
```

Setter with function form:

```tsx
setCount((prev) => prev + 1)
```

## createEffect

Side effects only (not for sync derived state):

```tsx
import { createSignal, createEffect } from 'solid-js'

function Counter() {
  const [count, setCount] = createSignal(0)
  createEffect(() => {
    console.log('Count incremented! New value: ', count())
  })
  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  )
}
```

## createStore

Nested reactive state with property-level reactivity:

```tsx
import { createStore } from 'solid-js/store'

const [state, setState] = createStore({
  user: {
    firstName: 'John',
    lastName: 'Smith',
  },
})

setState('user', 'firstName', 'Jane')
```

With getters:

```tsx
const [state] = createStore({
  user: {
    firstName: 'John',
    lastName: 'Smith',
    get fullName() {
      return `${this.firstName} ${this.lastName}`
    },
  },
})
```

## createResource

Async data fetching (not `createEffect`):

```tsx
import { createSignal, createResource } from 'solid-js'

const fetchUser = async (id) => {
  const response = await fetch(`https://swapi.dev/api/people/${id}/`)
  return response.json()
}

function App() {
  const [userId, setUserId] = createSignal()
  const [user] = createResource(userId, fetchUser)
  return (
    <div>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setUserId(e.currentTarget.value)}
      />
      <Show when={user.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={user.error}>
          <span>Error: {user.error}</span>
        </Match>
        <Match when={user()}>
          <div>{JSON.stringify(user())}</div>
        </Match>
      </Switch>
    </div>
  )
}
```

### With Actions (refetch, mutate)

```tsx
const [posts, { refetch, mutate }] = createResource(fetchPosts)

await refetch()
mutate((posts) => [...posts, newPost])
```

## Control Flow Components

```tsx
import { For, Show, Switch, Match, Dynamic, Index } from 'solid-js'

// Keyed list (tracked by reference)
<For each={list()}>{(item) => <div>{item.name}</div>}</For>

// Stable index list (values can change)
<Index each={list()}>{(item, i) => <div>{item()}</div>}</Index>

// Conditional with callback form for type narrowing
<Show when={user()} fallback={<div>Loading...</div>}>
  {(user) => <div>{user().name}</div>}
</Show>

// Complex conditions
<Switch fallback={<div>Default</div>}>
  <Match when={state === 'loading'}>Loading...</Match>
  <Match when={state === 'error'}>Error</Match>
</Switch>

// Dynamic component
<Dynamic component={currentComponent} />
```

## Props Handling

Never destructure props — use `mergeProps` and `splitProps`:

```tsx
import { mergeProps, splitProps, type Component } from 'solid-js'

const MyComponent: Component<{ a?: string; b?: number; c?: boolean }> = (props) => {
  const merged = mergeProps({ a: 'default', b: 42 }, props)
  const [local, others] = splitProps(merged, ['a'])
  return <div {...others}>{local.a}</div>
}
```

## Component Types

```tsx
import type { Component, VoidComponent, ParentComponent, FlowComponent } from 'solid-js'

const MyComponent: Component<Props> = (props) => <div />
const NoChildren: VoidComponent<Props> = (props) => <div />
const WithChildren: ParentComponent<Props> = (props) => <div>{props.children}</div>
const Flow: FlowComponent<Props, ChildProps> = (props) => <div>{props.children}</div>
```

## batch And untrack

```tsx
import { batch, untrack, on } from 'solid-js'

batch(() => {
  setA(1)
  setB(2)
}) // Single re-render

untrack(() => {
  console.log(signal()) // No dependency created
})

createEffect(on(signal, (value) => {
  console.log(value)
}))
```

## lazy And Suspense

```tsx
import { lazy, Suspense, ErrorBoundary } from 'solid-js'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <ErrorBoundary fallback={(err) => <div>{err.message}</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Source

- https://www.solidjs.com/
- https://docs.solidjs.com/reference/basic-reactivity/create-signal
- https://docs.solidjs.com/reference/basic-reactivity/create-effect
- https://docs.solidjs.com/reference/store-utilities/create-store
- https://docs.solidjs.com/reference/basic-reactivity/create-resource
- https://docs.solidjs.com/guides/fetching-data

## Solid 2.0 Migration Notes

- `Suspense` → `Loading`, `ErrorBoundary` → `Errored`
- `createResource` → async `createMemo` + `Loading` boundary
- `<Index>` removed → use `<For keyed={false}>`
- `SuspenseList` → `Reveal` with `order` (`sequential`, `together`) and `collapsed`
- `batch` → default microtask batching, use `flush()` to force sync
- `onMount` → `onSettled` (supports cleanup return)
- `mergeProps`/`splitProps` → `merge`/`omit`
- `unwrap` → `snapshot`
- `createMemo` second arg is now options, not initial value
- `onError` deprecated → use `catchError`
- New: `action()`, `createOptimisticStore`, `isPending()`, `latest()`, `refresh()`, `deep()`

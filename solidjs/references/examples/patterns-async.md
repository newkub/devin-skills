---
title: Async Patterns
description: Async patterns สำหรับ SolidJS
---

# Async Patterns

Async patterns สำหรับ SolidJS

## Transition with Loading State

```tsx
import { useTransition, createSignal } from 'solid-js';

function SearchComponent() {
  const [query, setQuery] = createSignal('');
  const [results, setResults] = createSignal([]);
  const [isPending, start] = useTransition();

  const search = () => {
    start(async () => {
      const response = await fetch(`/api/search?q=${query()}`);
      const data = await response.json();
      setResults(data);
    });
  };

  return (
    <div>
      <input 
        value={query()} 
        onInput={(e) => setQuery(e.target.value)} 
      />
      <button onClick={search} disabled={isPending()}>
        {isPending() ? 'Searching...' : 'Search'}
      </button>
      <ul>
        <For each={results()}>
          {(item) => <li>{item.name}</li>}
        </For>
      </ul>
    </div>
  );
}
```

## SuspenseList with Reveal Order

```tsx
import { Suspense, SuspenseList, createResource } from 'solid-js';

function Dashboard() {
  const [users] = createResource(() => fetch('/api/users').then(r => r.json()));
  const [posts] = createResource(() => fetch('/api/posts').then(r => r.json()));

  return (
    <SuspenseList fallback={<Loading />}>
      <Suspense fallback={<UsersLoading />}>
        <UserList users={users()} />
      </Suspense>
      <Suspense fallback={<PostsLoading />}>
        <PostList posts={posts()} />
      </Suspense>
    </SuspenseList>
  );
}
```

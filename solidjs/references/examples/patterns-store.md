---
title: Store Patterns
description: Store patterns สำหรับ SolidJS
---

# Store Patterns

Store patterns สำหรับ SolidJS

## createMutable for Direct Mutation

```tsx
import { createMutable } from 'solid-js/store';

function FormComponent() {
  const form = createMutable({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = () => {
    console.log(form); // direct access without proxy
  };

  return (
    <form onsubmit={handleSubmit}>
      <input 
        value={form.username}
        onInput={(e) => form.username = e.target.value}
      />
      <input 
        value={form.email}
        onInput={(e) => form.email = e.target.value}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## unwrap for Serialization

```tsx
import { createStore, unwrap } from 'solid-js/store';

function DataComponent() {
  const [state, setState] = createStore({
    user: { name: 'John', age: 30 },
    items: [1, 2, 3]
  });

  const serialize = () => {
    const raw = unwrap(state);
    return JSON.stringify(raw);
  };

  return (
    <div>
      <pre>{serialize()}</pre>
    </div>
  );
}
```

## createDeferred for Debounced Updates

```tsx
import { createDeferred, createSignal } from 'solid-js';

function SearchInput() {
  const [query, setQuery] = createSignal('');
  const deferredQuery = createDeferred(query, { timeoutMs: 300 });

  createEffect(() => {
    console.log('Searching for:', deferredQuery());
  });

  return (
    <input 
      value={query()} 
      onInput={(e) => setQuery(e.target.value)} 
    />
  );
}
```

## createSelector for Efficient Filtering

```tsx
import { createSelector, createSignal, For } from 'solid-js';

function FilteredList() {
  const [items] = createSignal([
    { id: 1, category: 'A', name: 'Item 1' },
    { id: 2, category: 'B', name: 'Item 2' },
    { id: 3, category: 'A', name: 'Item 3' }
  ]);
  const [filter, setFilter] = createSignal('A');

  const filtered = createSelector(
    () => filter(),
    () => items(),
    (category, items) => items.filter(item => item.category === category)
  );

  return (
    <div>
      <select onInput={(e) => setFilter(e.target.value)}>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
      </select>
      <ul>
        <For each={filtered()}>
          {(item) => <li>{item.name}</li>}
        </For>
      </ul>
    </div>
  );
}
```

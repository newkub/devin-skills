---
title: Basic Examples
description: Basic code examples สำหรับ SolidJS
---

# Basic Examples

ตัวอย่างพื้นฐานสำหรับ SolidJS

## Counter Component

```tsx
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Todo List

```tsx
import { createSignal, For } from 'solid-js';

function TodoList() {
  const [todos, setTodos] = createSignal([
    { id: 1, text: 'Learn SolidJS', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <ul>
      <For each={todos()}>
        {(todo) => (
          <li>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ 'text-decoration': todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </li>
        )}
      </For>
    </ul>
  );
}
```

## Async Data Fetching

```tsx
import { createResource, Show } from 'solid-js';

function UserProfile() {
  const [user] = createResource(async () => {
    const response = await fetch('/api/user');
    return response.json();
  });

  return (
    <Show when={!user.loading} fallback={<div>Loading...</div>}>
      <div>
        <h1>{user().name}</h1>
        <p>{user().email}</p>
      </div>
    </Show>
  );
}
```

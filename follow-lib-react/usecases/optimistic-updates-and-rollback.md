# Use Case — Optimistic Updates That Roll Back

> `useOptimistic` shows the result before the server confirms it, and reverts automatically when the action fails — provided the optimistic update happens inside an action or a transition. Source: https://react.dev/reference/react/useOptimistic (accessed 2026-10-20)

## 1. Start from the real state

```tsx
"use client";

import { useOptimistic } from "react";

type Todo = { id: string; title: string; done: boolean };

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTitle: string) => [
      ...state,
      { id: `pending-${newTitle}`, title: newTitle, done: false },
    ],
  );

  return (
    <ul>
      {optimisticTodos.map((todo) => (
        <li key={todo.id} className={todo.id.startsWith("pending-") ? "opacity-60" : undefined}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

The first argument is the source of truth passed from the server; the second is a pure reducer describing what the UI should look like in the meantime. The optimistic value disappears as soon as the action settles and the parent re-renders with fresh data.

## 2. Call the updater inside the action

```tsx
import { useOptimistic, useRef } from "react";
import { addTodo } from "@/app/actions";

export function AddTodo({ todos }: { todos: Todo[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTitle: string) => [...state, { id: `pending-${newTitle}`, title: newTitle, done: false }],
  );

  async function formAction(formData: FormData) {
    const title = String(formData.get("title"));
    addOptimisticTodo(title);
    formRef.current?.reset();
    await addTodo(title);
  }

  return (
    <form ref={formRef} action={formAction}>
      <input name="title" required />
      <button type="submit">Add</button>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </form>
  );
}
```

The updater must run while React is processing an action or a `startTransition`. Calling it from a plain event handler or an effect does not mark the update as optimistic, and React warns about it.

## 3. Let the failure revert the row

```tsx
async function formAction(formData: FormData) {
  const title = String(formData.get("title")).trim();
  if (!title) return;

  addOptimisticTodo(title);

  try {
    await addTodo(title);
  } catch (error) {
    // no manual rollback: the action ended, so the optimistic entry is dropped
    setError("Could not save. Your text is still in the form.");
    console.error(error);
  }
}
```

There is no rollback call — the optimistic entry exists only for the duration of the action. On success, the revalidated server data replaces it; on failure, the list snaps back to the last confirmed state. Keep the user's input so the retry is one click away.

## 4. Combine with `useActionState` for pending and errors

```tsx
import { useActionState, useOptimistic } from "react";

const [state, submit, isPending] = useActionState(
  async (_prev: { error?: string }, formData: FormData) => {
    const title = String(formData.get("title"));
    try {
      await addTodo(title);
      return {};
    } catch {
      return { error: "Could not save" };
    }
  },
  {},
);
```

`isPending` drives the disabled button and the inline spinner; `state.error` renders the failure next to the field. The optimistic entry and the pending flag describe different things — one is the predicted result, the other is transport state.

## 5. Keep the reducer pure and the id stable

```tsx
const [optimisticTodos, apply] = useOptimistic(todos, (state, action: { type: "toggle"; id: string }) =>
  state.map((todo) => (todo.id === action.id ? { ...todo, done: !todo.done } : todo)),
);
```

The reducer runs during render and may run more than once — no `Date.now()`, no random ids, no mutation of `state`. For a generated key, derive it from the input (`pending-${title}`) so the same optimistic row keeps the same identity across re-renders.

## 6. Verify

1. Submit a new todo — it appears instantly, before the network response
2. Throttle the network to slow 3G — the row is visible during the whole request
3. Force the action to throw — the row disappears and the error message appears
4. Submit while offline — the optimistic row reverts instead of staying forever
5. React StrictMode — no duplicate optimistic rows in development
6. Check the console — no "useOptimistic must be called inside a transition" warning
7. `/run-test` — a component test asserting the row exists during the pending promise and is gone after rejection

## Pitfalls

- Calling the updater from a plain click handler instead of an action or `startTransition`.
- Writing an imperative rollback (`setTodos(prev => prev.filter(...))`) on top of `useOptimistic`, which fights the automatic revert.
- A reducer with side effects or random ids, producing rows that change identity on every render.
- Treating optimistic state as confirmed — a hard refresh before the action settles loses it.
- Showing a success toast before the action resolves, which contradicts the revert.
- Optimistically inserting into a list that the server sorts differently, causing a visible jump on confirmation.
- Using `useOptimistic` for data the client is not allowed to predict (server-assigned ids, prices, permissions).

## Related

- `references/apis.md`
- `best-practices/react.md`
- `usecases/forms-with-server-actions.md`
- `usecases/error-boundaries-and-recovery.md`

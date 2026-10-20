# Use Case — Setup Store for a CRUD Feature

> Model one domain with the Composition API style and keep reactivity intact in components. Source: https://pinia.vuejs.org (accessed 2026-10-20)

## 1. Define the setup store

```ts
// stores/useTodos.ts
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { api } from "@/lib/api";

export type Todo = { id: string; title: string; done: boolean };

export const useTodos = defineStore("todos", () => {
  const items = ref<Todo[]>([]);
  const filter = ref<"all" | "open" | "done">("all");
  const isLoading = ref(false);
  const hasError = ref(false);

  const visible = computed(() =>
    items.value.filter((t) => filter.value === "all" || t.done === (filter.value === "done")),
  );
  const openCount = computed(() => items.value.filter((t) => !t.done).length);

  const load = async () => {
    isLoading.value = true;
    hasError.value = false;
    try {
      items.value = await api.list<Todo>("/todos");
    } catch {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const add = async (title: string) => {
    const created = await api.post<Todo>("/todos", { title, done: false });
    items.value.push(created);
  };

  const toggle = (id: string) => {
    const todo = items.value.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
  };

  const clearDone = () => {
    items.value = items.value.filter((t) => !t.done);
  };

  return { items, filter, isLoading, hasError, visible, openCount, load, add, toggle, clearDone };
});
```

State is `ref`, derived state is `computed`, and every mutation goes through an action — that is the whole contract of a setup store.

## 2. Install the instance once

```ts
// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

createApp(App).use(createPinia()).mount("#app");
```

With Nuxt, add `@pinia/nuxt` to `modules` instead and skip the manual instance.

## 3. Consume it without losing reactivity

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTodos } from "@/stores/useTodos";

const todos = useTodos();
const { visible, openCount, isLoading, hasError } = storeToRefs(todos);
const { filter } = storeToRefs(todos);

await todos.load();
</script>

<template>
  <p v-if="isLoading">Loading…</p>
  <p v-else-if="hasError" role="alert">Failed to load todos</p>
  <ul v-else>
    <li v-for="todo in visible" :key="todo.id">
      <input type="checkbox" :checked="todo.done" @change="todos.toggle(todo.id)" />
      {{ todo.title }}
    </li>
  </ul>
  <p>{{ openCount }} open</p>
</template>
```

`storeToRefs` keeps `visible`/`openCount` reactive; calling `todos.toggle(...)` still goes through the action.

## 4. Batch updates with `$patch`

```ts
todos.$patch({ filter: "open", isLoading: false });
```

Use `$patch` when several fields change together — it triggers one subscription instead of one per field.

## 5. Watch for changes when another layer needs them

```ts
todos.$subscribe((_mutation, state) => {
  analytics.track("todos_changed", { count: state.items.length });
});
```

## Pitfalls

- `const { items } = useTodos()` loses reactivity — destructure through `storeToRefs` (functions stay on the store).
- Mutating `items` inside a component bypasses actions and makes every write untraceable; keep mutation in the store.
- `defineStore({ id })` object-only syntax is removed in v3/v4 — use `defineStore("id", setupFn, options?)`.
- Pinia v4 is ESM-only and needs `@vue/devtools-api` installed explicitly; a CommonJS build fails to resolve it.
- One giant store for the whole app turns every change into a global re-render trigger — split by domain.
- Calling `useTodos()` at module top level outside an active Pinia app throws; call it inside `setup()` or after `app.use(pinia)`.

## Related

- `references/apis.md`
- `best-practices/stores.md`
- `usecases/persist-store.md`
- `usecases/test-store.md`

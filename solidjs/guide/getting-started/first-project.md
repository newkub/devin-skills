---
title: First Project
description: สร้างโปรเจกต์แรกด้วย SolidJS
---

## สร้างโปรเจกต์แรก

สร้างโปรเจกต์ SolidJS แรกด้วย create-solid:

```bash
bun init solid@latest
# หรือ
bun create solid@latest
# หรือ
yarn create solid@latest
# หรือ
bun create solid@latest
```

## เลือก Options

CLI จะถามคำถามต่อไปนี้:

1. **Project Name** - ชื่อโปรเจกต์
2. **SolidStart Project** - ต้องการใช้ full-stack framework หรือไม่
3. **Template** - เลือก template:
   - `ts` - TypeScript
   - `ts-vitest` - TypeScript + Vitest
   - `ts-uvu` - TypeScript + Uvu
   - `ts-unocss` - TypeScript + UnoCSS
   - `ts-tailwindcss` - TypeScript + TailwindCSS
4. **TypeScript** - ใช้ TypeScript หรือไม่

## โครงสร้างโปรเจกต์

```
my-solid-app/
├── src/
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── public/
│   └── index.html
├── package.json
├── vite.config.js
└── tsconfig.json (ถ้าใช้ TypeScript)
```

## สร้าง Counter Component

แก้ไข `src/App.jsx`:

```jsx
import { createSignal } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="container">
      <h1>SolidJS Counter</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default App;
```

## ใช้ Control Flow

เพิ่ม conditional rendering:

```jsx
import { createSignal, Show } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="container">
      <h1>SolidJS Counter</h1>
      <p>Count: {count()}</p>
      <Show when={count() > 10}>
        <p class="warning">Count is greater than 10!</p>
      </Show>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
```

## ใช้ List Rendering

เพิ่ม list ของ items:

```jsx
import { createSignal, For } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);
  const [items, setItems] = createSignal(["Item 1", "Item 2", "Item 3"]);

  function addItem() {
    setItems([...items(), `Item ${items().length + 1}`]);
  }

  return (
    <div class="container">
      <h1>SolidJS Counter</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
      
      <h2>Items</h2>
      <ul>
        <For each={items()}>
          {(item) => <li>{item}</li>}
        </For>
      </ul>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}
```

## ใช้ Effects

เพิ่ม side effect:

```jsx
import { createSignal, createEffect } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    document.title = `Count: ${count()}`;
  });

  return (
    <div class="container">
      <h1>SolidJS Counter</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## ใช้ Memos

เพิ่ม derived state:

```jsx
import { createSignal, createMemo } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  const doubled = createMemo(() => count() * 2);

  return (
    <div class="container">
      <h1>SolidJS Counter</h1>
      <p>Count: {count()}</p>
      <p>Doubled: {doubled()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## ใช้ Stores

เพิ่ม complex state:

```jsx
import { createStore } from "solid-js/store";

function App() {
  const [state, setState] = createStore({
    count: 0,
    user: { name: "John", age: 30 },
  });

  return (
    <div class="container">
      <h1>SolidJS App</h1>
      <p>Count: {state.count}</p>
      <p>User: {state.user.name}</p>
      <button onClick={() => setState("count", c => c + 1)}>
        Increment
      </button>
      <button onClick={() => setState("user", "name", "Jane")}>
        Change Name
      </button>
    </div>
  );
}
```

## รัน Development Server

```bash
bun run dev
# หรือ
bun dev
# หรือ
yarn dev
# หรือ
bun run dev
```

เปิด browser ที่ `http://localhost:5173`

## Build สำหรับ Production

```bash
bun run build
# หรือ
bun build
# หรือ
yarn build
# หรือ
bun run build
```

## Preview Production Build

```bash
bun run preview
# หรือ
bun preview
# หรือ
yarn preview
# หรือ
bun run preview
```

## ถัดไป

ดู [Key Concepts](../key-concepts/signals.md) เพื่อเรียนรู้เรื่อง reactivity ของ SolidJS

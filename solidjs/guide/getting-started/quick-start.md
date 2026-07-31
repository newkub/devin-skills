---
title: Quick Start
description: เริ่มต้นใช้งาน SolidJS อย่างรวดเร็ว
---

## สร้าง Component แรก

สร้างไฟล์ `App.jsx`:

```jsx
import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <h1>Counter: {count()}</h1>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

## ทำความเข้าใจ Signals

`createSignal` สร้าง reactive state:

- `count()` - อ่านค่า (getter)
- `setCount()` - อัปเดตค่า (setter)

เมื่อ `setCount` ถูกเรียก เฉพาะส่วนที่ใช้ `count()` เท่านั้นที่จะถูกอัปเดต

## การ Render ใน DOM

สร้างไฟล์ `index.jsx`:

```jsx
import { render } from "solid-js/web";
import Counter from "./App";

render(() => <Counter />, document.getElementById("app"));
```

## การใช้ JSX

SolidJS ใช้ JSX syntax เหมือน React:

```jsx
<div>
  <h1>Hello {name()}</h1>
  <p>Count: {count()}</p>
</div>
```

แต่ไม่มี Virtual DOM - JSX ถูก compile เป็น direct DOM operations

## การใช้ Control Flow

ใช้ components จาก `solid-js`:

```jsx
import { Show, For, Switch, Match } from "solid-js";

function MyComponent() {
  const [loggedIn, setLoggedIn] = createSignal(false);
  const [items, setItems] = createSignal(["a", "b", "c"]);

  return (
    <div>
      <Show when={loggedIn()}>
        <p>Welcome back!</p>
      </Show>

      <For each={items()}>
        {(item) => <div>{item}</div>}
      </For>

      <Switch fallback={<p>Loading...</p>}>
        <Match when={status() === "success"}>
          <p>Success!</p>
        </Match>
        <Match when={status() === "error"}>
          <p>Error!</p>
        </Match>
      </Switch>
    </div>
  );
}
```

## การใช้ Effects

ใช้ `createEffect` สำหรับ side effects:

```jsx
import { createSignal, createEffect } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log("Count changed:", count());
  });

  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}
```

## การใช้ Memos

ใช้ `createMemo` สำหรับ derived state:

```jsx
import { createSignal, createMemo } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  const doubled = createMemo(() => count() * 2);

  return (
    <div>
      <p>Count: {count()}</p>
      <p>Doubled: {doubled()}</p>
    </div>
  );
}
```

## ถัดไป

ดู [Key Concepts](../key-concepts/signals.md) เพื่อเรียนรู้เกี่ยวกับ reactivity ของ SolidJS

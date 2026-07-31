---
title: Observable Integration
description: เรียนรู้เรื่อง Observable Integration ใน SolidJS
---

## สิ่งที่คือ Observable Integration

SolidJS สามารถ integrate กับ observable libraries เช่น RxJS, Svelte stores, หรือ custom observables

## การใช้งานกับ RxJS

```jsx
import { from } from "rxjs";
import { toObservable } from "solid-js";

const observable$ = from([1, 2, 3]);
const [data] = toObservable(observable$);

<Show when={data()}>
  {(value) => <div>{value}</div>}
</Show>
```

## การใช้งานกับ Svelte Stores

```jsx
import { toStore } from "solid-js";

const svelteStore = writable(0);
const [count, setCount] = toStore(svelteStore);
```

## Custom Observables

สร้าง observable ที่ integrate กับ SolidJS:

```jsx
function createCustomObservable(initial) {
  let subscribers = new Set();
  let value = initial;

  return {
    subscribe(fn) {
      subscribers.add(fn);
      fn(value);
      return () => subscribers.delete(fn);
    },
    set(newValue) {
      value = newValue;
      subscribers.forEach(fn => fn(value));
    }
  };
}
```

## toObservable Hook

แปลง SolidJS signals เป็น observables:

```jsx
const [count, setCount] = createSignal(0);
const count$ = toObservable(count);

count$.subscribe(value => console.log(value));
```

## Use Cases

- **State Synchronization**: Sync ระหว่าง frameworks
- **Event Streams**: Handle async events
- **Data Streams**: Process streaming data
- **Micro-frontends**: แชร์ state ระหว่าง apps

## ประโยชน์

- **Interoperability**: ใช้กับ libraries อื่นๆ
- **Reactive Patterns**: ใช้ patterns จาก ecosystems ต่างๆ
- **Migration**: ย้ายจาก frameworks อื่นได้ง่าย
- **Flexibility**: เลือกใช้ tools ที่เหมาะสม

## ถัดไป

ดู [SSR Architecture](./ssr-architecture.md) เพื่อเรียนรู้เรื่อง server-side rendering

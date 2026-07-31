---
title: State Management
description: Context, Store และ Lifecycle APIs
---

# State Management

คู่มือ Context, Store และ Lifecycle APIs ของ SolidJS

## Context API

### createContext

สร้าง context

```tsx
import { createContext } from 'solid-js';

const Context = createContext(defaultValue);
```

### useContext

อ่าน context

```tsx
import { useContext } from 'solid-js';

const value = useContext(Context);
```

## Store API

### createStore

สร้าง reactive store สำหรับ complex objects

```tsx
import { createStore } from 'solid-js/store';

const [state, setState] = createStore(initialState);
setState('field', value);
setState('nested', 'field', value);
```

### produce

Immutable updates สำหรับ stores

```tsx
import { produce } from 'solid-js/store';

setState(produce(state => {
  state.items.push newItem;
}));
```

### unwrap

ดึงค่า raw จาก store โดยไม่ใช้ proxy

```tsx
import { unwrap } from 'solid-js/store';

const raw = unwrap(store);
```

### $RAW

Symbol สำหรับ access raw value ของ store

```tsx
import { $RAW } from 'solid-js/store';

const raw = store[$RAW];
```

### createMutable

สร้าง single proxy object ที่ assignments เป็น reactive

```tsx
import { createMutable } from 'solid-js/store';

const state = createMutable(initialState);
state.field = newValue; // reactive
```

## Lifecycle

### onMount

Callback เมื่อ component mount

```tsx
import { onMount } from 'solid-js';

onMount(() => {
  console.log('mounted');
});
```

### onCleanup

Callback เมื่อ component unmount

```tsx
import { onCleanup } from 'solid-js';

onCleanup(() => {
  console.log('cleanup');
});
```

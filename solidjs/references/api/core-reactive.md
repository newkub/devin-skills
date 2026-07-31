---
title: Core Reactive Primitives
description: Core reactive primitives ของ SolidJS
---

# Core Reactive Primitives

คู่มือ Core Reactive Primitives ของ SolidJS

## createSignal

สร้าง reactive signal ด้วย getter/setter pattern

```tsx
import { createSignal } from 'solid-js';

const [value, setValue] = createSignal(initialValue);
console.log(value()); // read
setValue(newValue); // write
setValue(prev => prev + 1); // updater function
```

**Parameters:**
- `initialValue` - ค่าเริ่มต้น

**Returns:** `[getter, setter]` tuple

## createEffect

สร้าง side effect ที่ทำงานเมื่อ dependencies เปลี่ยน

```tsx
import { createEffect } from 'solid-js';

createEffect(() => {
  console.log(value());
});
```

**Parameters:**
- `fn` - function ที่มี dependencies

**Returns:** cleanup function

## createMemo

สร้าง derived reactive value ที่ cache ไว้

```tsx
import { createMemo } from 'solid-js';

const doubled = createMemo(() => count() * 2);
```

**Parameters:**
- `fn` - function ที่คำนวณค่า

**Returns:** signal getter

## createResource

สร้าง async resource สำหรับ data fetching

```tsx
import { createResource } from 'solid-js';

const [data] = createResource(fetcher, {
  initialValue: initialData,
  deferStream: true
});
```

**Parameters:**
- `source` - signal หรือ fetcher function
- `options` - configuration options

**Returns:** `[resource, { refetch, mutate }]`

## createComputed

สร้าง computation ที่ทำงานระหว่าง render phase

```tsx
import { createComputed } from 'solid-js';

createComputed(() => {
  // runs during render phase
});
```

**Parameters:**
- `fn` - function ที่คำนวณค่า

**Returns:** cleanup function

## createRenderEffect

สร้าง effect ที่ทำงานระหว่าง render phase เมื่อ DOM ถูกสร้าง/อัปเดต

```tsx
import { createRenderEffect } from 'solid-js';

createRenderEffect(() => {
  // runs during render phase with DOM access
});
```

**Parameters:**
- `fn` - function ที่มี DOM access

**Returns:** cleanup function

## createDeferred

สร้าง deferred signal ที่อัปเดตหลังจาก batch สิ้นสุด

```tsx
import { createDeferred } from 'solid-js';

const deferred = createDeferred(source);
```

**Parameters:**
- `source` - signal หรือ value

**Returns:** signal getter

## createSelector

สร้าง memoized selector สำหรับ list rendering ที่มีประสิทธิภาพ

```tsx
import { createSelector } from 'solid-js';

const selector = createSelector(keyFn, listFn);
```

**Parameters:**
- `keyFn` - function สำหรับ extract key
- `listFn` - function สำหรับ filter list

**Returns:** selector function

## createReaction

สร้าง reactive context ที่ trigger ได้ด้วยตนเอง

```tsx
import { createReaction } from 'solid-js';

const reaction = createReaction(onChange);
reaction.track(() => value());
```

**Parameters:**
- `fn` - callback function

**Returns:** reaction object

---
title: Best Practices
description: Best practices สำหรับการพัฒนา SolidJS applications
---

## Signal Usage

**DO:**
- อ่าน signals ภายใน reactive scopes
- ใช้ `createMemo` สำหรับ expensive computations
- ใช้ `createStore` สำหรับ nested state

**DON'T:**
- อ่าน signals นอก reactive scopes
- ใช้ `createEffect` สำหรับ derived state
- Destructure props

## Props Handling

ใช้ `mergeProps` และ `splitProps` แทน destructuring:

```tsx
import { mergeProps, splitProps } from 'solid-js'

// Merge props พร้อม default values
const merged = mergeProps({ default: true }, props)

// Split props ที่ consume และ forward
const [local, others] = splitProps(props, ['class', 'style'])
```

## State Management

ใช้ `createStore` สำหรับ nested objects:

```tsx
import { createStore } from 'solid-js/store'

const [state, setState] = createStore({
  user: { name: 'John', age: 30 }
})
```

ใช้ `produce` สำหรับ complex mutations:

```tsx
import { produce } from 'solid-js/store'

setState(produce((s) => {
  s.user.age += 1
}))
```

## Async Data

ใช้ `createResource` แทน `createEffect` สำหรับ data fetching:

```tsx
import { createResource } from 'solid-js'

const [data] = createResource(fetchData)
```

## Performance

- ใช้ `batch` สำหรับ multiple updates
- ใช้ `createMemo` สำหรับ caching
- ใช้ Solid's control-flow components

## Component Design

- Components execute ครั้งเดียว
- Reactivity lives ที่ signal level
- Keep components small และ focused

---
title: Migration
description: วิธี migrate จาก frameworks อื่นมา SolidJS
---

## Migration จาก React

### สิ่งที่ต่าง

| React | SolidJS |
|-------|---------|
| `useState` | `createSignal` |
| `useEffect` | `createEffect` |
| `useMemo` | `createMemo` |
| Components re-render | Components run once |
| Virtual DOM | No Virtual DOM |

### ตัวอย่าง Migration

#### React

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(count);
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### SolidJS

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  
  createEffect(() => {
    console.log(count());
  });
  
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
}
```

## Migration จาก Vue

### สิ่งที่ต่าง

| Vue | SolidJS |
|-----|---------|
| `ref` | `createSignal` |
| `computed` | `createMemo` |
| `watch` | `createEffect` |
| `v-if` | `<Show>` |
| `v-for` | `<For>` |

### ตัวอย่าง Migration

#### Vue

```vue
<template>
  <div>
    <button @click="increment">{{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);
const increment = () => count.value++;
</script>
```

#### SolidJS

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount(count() + 1);
  
  return <button onClick={increment}>{count()}</button>;
}
```

## Migration จาก Svelte

### สิ่งที่ต่าง

| Svelte | SolidJS |
|-------|---------|
| `let count = 0` | `const [count, setCount] = createSignal(0)` |
| `$: doubled = count * 2` | `const doubled = createMemo(() => count() * 2)` |
| `{#if}` | `<Show>` |
| `{#each}` | `<For>` |

## Migration Tips

1. **เริ่มจาก component เล็กๆ** - migrate ทีละ component
2. **ใช้ TypeScript** - ช่วย catch errors ระหว่าง migration
3. **ทดสอบทีละส่วน** - ตรวจสอบว่าทำงานได้ก่อน migrate ต่อ
4. **ใช้ testing** - เขียน tests เพื่อ verify behavior

## ถัดไป

ดู [Security](./security.md) เพื่อเรียนรู้เรื่อง security

# Migration - SolidStart

## Migrating to SolidStart v1

### Breaking Changes

1. **Router Changes**: `@solidjs/router` API เปลี่ยน
2. **Config Changes**: `app.config.ts` format ใหม่
3. **Entry Points**: `entry-client.tsx` และ `entry-server.tsx` ใหม่
4. **Server Functions**: API ใหม่สำหรับ server functions

### Migration Steps

#### 1. Update Dependencies

```bash
bun remove solid-app-router
bun add @solidjs/router
bun add -D @solidjs/start
```

#### 2. Update Config

```typescript
// app.config.ts (new format)
export default defineConfig({
  ssr: true,
  prerender: false,
});
```

#### 3. Update Entry Points

```typescript
// src/entry-client.tsx
import { hydrate } from "solid-js/web";
import { StartRouter } from "@solidjs/start/router";
import { Router } from "./app";

hydrate(() => (
  <StartRouter>
    <Router />
  </StartRouter>
), document.getElementById("app"));
```

```typescript
// src/entry-server.tsx
import { renderToString } from "solid-js/web";
import { StartRouter } from "@solidjs/start/router";
import { Router } from "./app";

export function render(url: string) {
  return renderToString(() => (
    <StartRouter url={url}>
      <Router />
    </StartRouter>
  ));
}
```

#### 4. Update Router

```typescript
// ใช้ @solidjs/router แทน solid-app-router
import { useNavigate, useParams } from "@solidjs/router";
```

## Migrating from React

### JSX Differences

| React | SolidJS |
|-------|---------|
| `useState` | `createSignal` |
| `useEffect` | `createEffect` |
| `useMemo` | `createMemo` |
| `useCallback` | N/A (functions ไม่ re-create) |

### Component Migration

```typescript
// React
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// SolidJS
function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(c => c + 1)}>{count()}</button>;
}
```

## Migrating from Next.js

### Routing Differences

| Next.js | SolidStart |
|---------|-----------|
| `pages/` | `src/routes/` |
| `getServerSideProps` | `routeData` |
| `getStaticProps` | `routeData` + `prerender` |
| API routes | Server functions |

### Data Fetching Migration

```typescript
// Next.js
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// SolidStart
export function routeData() {
  return cache(async () => {
    return await fetchData();
  }, "data");
}
```

## Migrating from Vue

### Reactivity Differences

| Vue | SolidJS |
|-----|---------|
| `ref()` | `createSignal()` |
| `reactive()` | `createStore()` |
| `computed()` | `createMemo()` |
| `watch()` | `createEffect()` |

### Component Migration

```typescript
// Vue
<script setup>
const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

// SolidJS
function Counter() {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(c => c + 1)}>{count()}</button>;
}
```

## Common Migration Issues

### Signal Access

```typescript
// ❌ Wrong
const count = createSignal(0);
console.log(count); // Function

// ✅ Correct
const count = createSignal(0);
console.log(count()); // Value
```

### Reactive Dependencies

```typescript
// ❌ Wrong - ไม่ track dependencies
createEffect(() => {
  console.log(count()); // ไม่ re-run
});

// ✅ Correct - track dependencies
createEffect(() => {
  console.log(count()); // Re-run เมื่อ count เปลี่ยน
});
```

## Testing Migration

ตรวจสอบว่า migration สำเร็จ:

```bash
bun run dev
bun run build
bun run test
```

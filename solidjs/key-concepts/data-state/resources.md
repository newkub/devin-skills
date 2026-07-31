---
title: Resources
description: เรียนรู้เรื่อง resources ใน SolidJS
---

## สิ่งที่คือ Resources

Resources ใช้สำหรับ async state:

```jsx
const [data] = createResource(fetchData);
```

## Basic Usage

### Creating Resource

```jsx
import { createResource } from "solid-js";

async function fetchData() {
  const res = await fetch("/api/data");
  return res.json();
}

const [data] = createResource(fetchData);
```

### Reading Resource

```jsx
return (
  <Suspense fallback={<p>Loading...</p>}>
    <Show when={data()}>
      {(d) => <div>{d().name}</div>}
    </Show>
  </Suspense>
);
```

## Resource States

### Loading State

```jsx
const [data, { loading }] = createResource(fetchData);

<Show when={loading()}>
  <p>Loading...</p>
</Show>
```

### Error State

```jsx
const [data, { error }] = createResource(fetchData);

<Show when={error()}>
  <p>Error: {error().message}</p>
</Show>
```

## Manual Refresh

```jsx
const [data, { refetch }] = createResource(fetchData);

<button onClick={() => refetch()}>Refresh</button>
```

## Arguments

### Dynamic Arguments

```jsx
const [data] = createResource(() => id(), (id) => fetchData(id));
```

## Mutation

### Updating Resource

```jsx
const [data, { mutate }] = createResource(fetchData);

mutate((prev) => ({ ...prev, updated: true }));
```

## Best Practices

### ใช้ Resources สำหรับ Async Data

```jsx
const [user] = createResource(() => userId(), fetchUser);
```

### ใช้ Suspense สำหรับ Loading States

```jsx
<Suspense fallback={<p>Loading...</p>}>
  <AsyncComponent />
</Suspense>
```

## ถัดไป

ดู [Suspense](./suspense.md) เพื่อเรียนรู้เรื่อง suspense

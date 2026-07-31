---
title: Hydration
description: Hydration process ใน Solid Start สำหรับเปลี่ยน static HTML เป็น interactive application
---

## Hydration คืออะไร

Hydration เป็น process ที่ Solid Start ใช้เพื่อเปลี่ยน static HTML ที่ render บน server ให้กลายเป็น interactive application บน client โดย attach event listeners และ reactive state

## ขั้นตอน Hydration

```
Server → Send HTML + Hydration Script → Client
Client → Load JavaScript → Solid
Solid → Reconstruct Component Tree
Solid → Attach Event Listeners
Solid → Restore Reactive State
Solid → Interactive App → Client
```

## Hydration Types

### Full Hydration

Hydrate ทั้ง page:

```typescript
// routes/index.tsx
export default function Home() {
  const [count, setCount] = createSignal(0);
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count()}
      </button>
    </div>
  );
}
```

### Partial Hydration (Islands)

Hydrate เฉพาะ interactive components:

```typescript
import { clientOnly } from "solid-start/client";

const Counter = clientOnly(() => import("./Counter"));

export default function Page() {
  return (
    <div>
      <h1>Static Content</h1>
      <Counter />
    </div>
  );
}
```

## Hydration Patterns

### State Preservation

Solid จะ preserve state ระหว่าง hydration:

```typescript
export default function Form() {
  const [value, setValue] = createSignal("");
  
  return (
    <form>
      <input value={value()} onInput={(e) => setValue(e.target.value)} />
    </form>
  );
}
```

### Server State Transfer

Transfer state จาก server ไป client:

```typescript
export default function Page() {
  const data = createServerData$(async () => {
    return await fetchData();
  });
  
  return (
    <Suspense fallback={<Loading />}>
      <Show when={data()}>
        {(data) => <Content data={data()} />}
      </Show>
    </Suspense>
  );
}
```

## Hydration Mismatch

### Common Issues

- **State mismatch**: Server state ไม่ตรงกับ client state
- **Environment differences**: `isServer` flag ใช้ผิด
- **Missing hydration**: Component ไม่ถูก hydrate

### Prevention

```typescript
// ใช้ isServer สำหรับ environment-specific code
import { isServer } from "solid-js/web";

export default function Component() {
  if (isServer) {
    // Server-only code
    return <div>Server Content</div>;
  }
  
  // Client-only code
  return <div>Client Content</div>;
}
```

## Performance

### Hydration Performance Tips

- **Lazy hydration**: Hydrate components เมื่อจำเป็น
- **Reduce bundle size**: Minimize JavaScript ที่ต้อง hydrate
- **Use islands**: Hydrate เฉพาะ interactive components
- **Optimize state**: Minimize reactive state

## Debugging Hydration

### Hydration Warnings

Solid Start จะแสดง warnings เมื่อมี hydration mismatch:

```typescript
// Enable hydration warnings
export default defineConfig({
  ssr: true,
  hydrationWarnings: true,
});
```

### Inspect Hydration

ใช้ browser devtools สำหรับ inspect hydration:

```typescript
// Add hydration markers
export default function Page() {
  return (
    <div data-hydrate="page">
      <Content />
    </div>
  );
}
```

## Best Practices

- **Test hydration**: Test ทั้ง server และ client
- **Handle loading states**: ใช้ Suspense สำหรับ async components
- **Minimize hydration**: ใช้ islands เมื่อเป็นไปได้
- **Preserve state**: ใช้ Solid's reactivity สำหรับ state management

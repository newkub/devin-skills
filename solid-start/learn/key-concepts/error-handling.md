# Error Handling

## แนวคิดหลัก

SolidStart มีหลายวิธีในการ handle errors ตั้งแต่ component-level error boundaries ไปจนถึง server-side error handling โดยออกแบบมาให้ handle errors อย่าง graceful และ maintain UX ที่ดี

## Error Types

### 1. Component Errors

Errors ที่เกิดใน components:

```typescript
export default function UserProfile() {
  const [user] = createResource(async () => {
    const res = await fetch("/api/user");
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });

  return (
    <ErrorBoundary fallback={(err) => <ErrorView error={err} />}>
      <Suspense fallback={<Loading />}>
        <Show when={user()}>
          {(u) => <div>{u().name}</div>}
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 2. Route Errors

Errors ที่เกิดใน route handlers:

```typescript
// routes/[slug].tsx
export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error("Not found");
    return res.json();
  }, "data");
}
```

### 3. Server Errors

Errors ที่เกิดใน server functions:

```typescript
// routes/api/data.ts
export async function GET() {
  try {
    const data = await fetchData();
    return json(data);
  } catch (error) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

## Error Boundaries

### Basic Error Boundary

ใช้ ErrorBoundary สำหรับ handle component errors:

```typescript
import { ErrorBoundary } from "solid-js";

export default function App() {
  return (
    <ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
      <Routes />
    </ErrorBoundary>
  );
}
```

### Custom Error Boundary

สร้าง custom error boundary:

```typescript
export function CustomErrorBoundary(props: any) {
  return (
    <ErrorBoundary
      fallback={(err, reset) => (
        <div class="error-container">
          <h2>Something went wrong</h2>
          <p>{err.message}</p>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
```

### Nested Error Boundaries

ใช้ multiple error boundaries:

```typescript
export default function Layout() {
  return (
    <ErrorBoundary fallback={<LayoutError />}>
      <Header />
      <main>
        <ErrorBoundary fallback={<ContentError />}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
```

## Server Error Handling

### Try-Catch Pattern

ใช้ try-catch ใน server functions:

```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processData(body);
    return json(result);
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Processing failed" }, { status: 500 });
  }
}
```

### Error Response Helper

สร้าง helper สำหรับ error responses:

```typescript
function errorResponse(message: string, status: number = 500) {
  return json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processData(body);
    return json(result);
  } catch (error) {
    return errorResponse("Processing failed", 500);
  }
}
```

### Validation Errors

Handle validation errors:

```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = validateSchema(body);
    if (!validation.success) {
      return json({ errors: validation.error }, { status: 400 });
    }
    const result = await processData(body);
    return json(result);
  } catch (error) {
    return errorResponse("Processing failed", 500);
  }
}
```

## Error Pages

### 404 Page

สร้าง custom 404 page:

```typescript
// routes/[...404].tsx
export default function NotFound() {
  return (
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <A href="/">Go Home</A>
    </div>
  );
}
```

### 500 Page

สร้าง custom 500 page:

```typescript
// routes/error/[...500].tsx
export default function ServerError() {
  return (
    <div class="server-error">
      <h1>500 - Server Error</h1>
      <p>Something went wrong on our end.</p>
      <A href="/">Go Home</A>
    </div>
  );
}
```

## Loading States

### Suspense Fallback

ใช้ Suspense สำหรับ loading states:

```typescript
export default function PostsPage() {
  const [posts] = createResource(() => fetchPosts());

  return (
    <Suspense fallback={<PostsSkeleton />}>
      <For each={posts()}>
        {(post) => <PostCard post={post} />}
      </For>
    </Suspense>
  );
}
```

### Resource Loading State

ใช้ loading state จาก resource:

```typescript
export default function PostsPage() {
  const [posts, { loading, error }] = createResource(() => fetchPosts());

  return (
    <Show when={loading()}>
      <LoadingSpinner />
    </Show>
    <Show when={error()}>
      <ErrorMessage error={error()} />
    </Show>
    <Show when={posts()}>
      <For each={posts()}>
        {(post) => <PostCard post={post} />}
      </For>
    </Show>
  );
}
```

## Error Logging

### Client-Side Logging

Log errors บน client:

```typescript
export function logError(error: Error) {
  console.error("Error:", error);
  // Send to error tracking service
  if (import.meta.env.PROD) {
    sendToSentry(error);
  }
}

export default function App() {
  return (
    <ErrorBoundary
      fallback={(err) => {
        logError(err);
        return <ErrorView error={err} />;
      }}
    >
      <Routes />
    </ErrorBoundary>
  );
}
```

### Server-Side Logging

Log errors บน server:

```typescript
export async function POST(req: Request) {
  try {
    const result = await processData(req);
    return json(result);
  } catch (error) {
    console.error("Server Error:", error);
    // Send to error tracking service
    sendToSentry(error);
    return errorResponse("Processing failed", 500);
  }
}
```

## Error Recovery

### Retry Logic

Retry failed requests:

```typescript
export default function DataPage() {
  const [data, { refetch }] = createResource(() => fetchData());

  return (
    <Show when={data.error}>
      <div class="error">
        <p>Failed to load data</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    </Show>
  );
}
```

### Fallback Content

แสดง fallback content เมื่อ error:

```typescript
export default function UserProfile() {
  const [user] = createResource(() => fetchUser());

  return (
    <ErrorBoundary
      fallback={() => (
        <div class="profile-fallback">
          <div class="avatar-skeleton" />
          <div class="name-skeleton" />
        </div>
      )}
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <Show when={user()}>
          {(u) => <Profile user={u()} />}
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
}
```

## Best Practices

| Practice | คำอธิบาย |
|----------|-----------|
| **Handle gracefully** | Handle errors อย่าง graceful |
| **Show feedback** | แสดง feedback ให้ user |
| **Log errors** | Log errors สำหรับ debugging |
| **Provide recovery** | ให้ user สามารถ recover ได้ |
| **Test errors** | Test error scenarios |

## Error Tracking

### Sentry Integration

ติดตั้ง Sentry:

```bash
bun add @sentry/solid
```

ตั้งค่า:

```typescript
import * as Sentry from "@sentry/solid";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

ใช้ใน ErrorBoundary:

```typescript
<ErrorBoundary
  fallback={(err) => {
    Sentry.captureException(err);
    return <ErrorView error={err} />;
  }}
>
  {children}
</ErrorBoundary>
```

## Common Error Patterns

### Network Error

```typescript
export function isNetworkError(error: Error): boolean {
  return error.message.includes("fetch") || error.message.includes("network");
}

export default function DataPage() {
  const [data, { error }] = createResource(() => fetchData());

  return (
    <Show when={error() && isNetworkError(error())}>
      <div class="network-error">
        <p>Network error. Please check your connection.</p>
        <button onClick={() => location.reload()}>Reload</button>
      </div>
    </Show>
  );
}
```

### Timeout Error

```typescript
export async function fetchWithTimeout(url: string, timeout: number = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw new Error("Request timeout");
  }
}
```

### Validation Error

```typescript
export function ValidationError(props: { errors: string[] }) {
  return (
    <div class="validation-error">
      <h3>Validation Error</h3>
      <ul>
        <For each={props.errors}>
          {(error) => <li>{error}</li>}
        </For>
      </ul>
    </div>
  );
}
```

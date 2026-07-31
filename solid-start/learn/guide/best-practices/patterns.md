# Patterns - SolidStart

## Component Patterns

### Container/Presentational Pattern

แยก logic จาก UI:

```typescript
// Presentational component
export function UserList(props: { users: User[] }) {
  return (
    <ul>
      {props.users.map(user => <UserItem user={user} />)}
    </ul>
  );
}

// Container component
export function UserListContainer() {
  const users = useUsers();
  return <UserList users={users()} />;
}
```

### Higher-Order Component Pattern

Wrap components ด้วย logic:

```typescript
export function withAuth(Component: any) {
  return (props: any) => {
    const user = useAuth();
    if (!user()) return <Login />;
    return <Component {...props} user={user()} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);
```

### Render Props Pattern

Pass functions as children:

```typescript
export function MouseTracker(props: {
  children: (mouse: { x: number; y: number }) => JSX.Element
}) {
  const [mouse, setMouse] = createSignal({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      {props.children(mouse())}
    </div>
  );
}

// Usage
<MouseTracker>
  {(mouse) => <div>Mouse: {mouse.x}, {mouse.y}</div>}
</MouseTracker>
```

## Data Patterns

### Route Data Pattern

ใช้ `routeData` สำหรับ data fetching:

```typescript
export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/data");
    return res.json();
  }, "data");
}

export default function Page() {
  const data = useRouteData();
  return <div>{JSON.stringify(data())}</div>;
}
```

### Server Action Pattern

ใช้ server functions สำหรับ mutations:

```typescript
// routes/api/action.ts
export async function POST(req: Request) {
  const body = await req.json();
  // Process action
  return json({ success: true });
}

// Component
export function ActionButton() {
  const handleSubmit = async () => {
    await fetch("/api/action", {
      method: "POST",
      body: JSON.stringify({ data: "test" }),
    });
  };
  return <button onClick={handleSubmit}>Submit</button>;
}
```

## State Patterns

### Store Pattern

ใช้ `createStore` สำหรับ complex state:

```typescript
const [state, setState] = createStore({
  users: [],
  loading: false,
  error: null,
});

export const userStore = {
  get users() { return state.users; },
  get loading() { return state.loading; },
  setUsers(users: User[]) { setState("users", users); },
  setLoading(loading: boolean) { setState("loading", loading); },
};
```

### Context Pattern

ใช้ context สำหรับ global state:

```typescript
const ThemeContext = createContext();

export function ThemeProvider(props: any) {
  const [theme, setTheme] = createSignal("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

## Routing Patterns

### Layout Pattern

ใช้ nested routes สำหรับ layouts:

```
routes/
├── (app)/
│   ├── layout.tsx    # Layout component
│   ├── index.tsx     # Inherits layout
│   └── about.tsx     # Inherits layout
```

### Route Group Pattern

จัดกลุ่ม routes โดยไม่กระทบ URL:

```
routes/
├── (auth)/
│   ├── login.tsx     # /login
│   └── register.tsx  # /register
```

### Guard Pattern

ใช้ middleware สำหรับ route guards:

```typescript
// middleware.ts
export function onRequest(event: any) {
  const session = getSession(event.request);
  if (!session && event.request.url.includes("/dashboard")) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

## Performance Patterns

### Lazy Loading Pattern

Lazy load components:

```typescript
import { lazy } from "solid-js";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Code Splitting Pattern

Split code ตาม routes:

```typescript
export const routeConfig = {
  preload: false, // ปิด preloading
};
```

## Error Patterns

### Error Boundary Pattern

Handle errors gracefully:

```typescript
export function ErrorBoundary(props: any) {
  const [error, setError] = createSignal<Error | null>(null);

  return (
    <ErrorBoundary fallback={(err) => <ErrorView error={err} />}>
      {props.children}
    </ErrorBoundary>
  );
}
```

### Try-Catch Pattern

Handle async errors:

```typescript
export async function fetchData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

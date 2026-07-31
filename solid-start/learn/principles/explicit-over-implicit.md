# Explicit Over Implicit

## แนวคิดหลัก

ทำให้ dependencies และ behavior ชัดเจน แทนการ implicit magic

## Explicit Dependencies

### ❌ ไม่ควรทำ (Implicit)

```typescript
// Component ที่ implicitly ใช้ global state
export default function UserList() {
  // ไม่ชัดเจนว่า data มาจากไหน
  const users = useGlobalUsers(); // Global state
  return <UserList users={users()} />;
}
```

### ✅ ควรทำ (Explicit)

```typescript
// Component ที่ explicitly รับ dependencies
export function UserList(props: { users: User[] }) {
  return <ul>{props.users.map(user => <UserItem user={user} />)}</ul>;
}

// Usage - dependencies ชัดเจน
<UserList users={users()} />
```

## Explicit Props

### ❌ ไม่ควรทำ

```typescript
// Props ไม่ชัดเจน
export function Button(props: any) {
  return <button {...props} />;
}
```

### ✅ ควรทำ

```typescript
// Props ชัดเจนด้วย TypeScript
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  children: JSX.Element;
}

export function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      class={props.variant}
    >
      {props.children}
    </button>
  );
}
```

## Explicit Routing

### ❌ ไม่ควรทำ

```typescript
// Implicit navigation
export function navigateToAbout() {
  window.location.href = "/about"; // Magic string
}
```

### ✅ ควรทำ

```typescript
// Explicit navigation ด้วย router
import { useNavigate } from "@solidjs/router";

export function AboutButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/about")}>About</button>;
}
```

## Explicit Data Fetching

### ❌ ไม่ควรทำ

```typescript
// Implicit data fetching
export default function UserPage() {
  fetch("/api/users"); // Side effect ใน component body
  return <div>Users</div>;
}
```

### ✅ ควรทำ

```typescript
// Explicit data fetching ด้วย routeData
export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/users");
    return res.json();
  }, "users");
}

export default function UserPage() {
  const users = useRouteData();
  return <UserList users={users()} />;
}
```

## Explicit Error Handling

### ❌ ไม่ควรทำ

```typescript
// Silent errors
export async function fetchData() {
  try {
    const res = await fetch("/api/data");
    return res.json();
  } catch (error) {
    // Do nothing
  }
}
```

### ✅ ควรทำ

```typescript
// Explicit error handling
export async function fetchData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error; // Explicitly throw
  }
}
```

## Benefits

- **Predictable**: Behavior ชัดเจน ไม่มี surprises
- **Debuggable**: Error tracking ง่าย
- **Testable**: Test ง่ายเพราะ dependencies ชัดเจน
- **Maintainable**: Code อ่านง่าย และเข้าใจง่าย

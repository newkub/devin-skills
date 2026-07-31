# Single Responsibility Principle

## แนวคิดหลัก

แต่ละ component และ module ควรมีหน้าที่เดียว และเหตุผลเดียวในการเปลี่ยนแปลง

## Component Responsibility

### ❌ ไม่ควรทำ

```typescript
// Component ที่ทำหลายอย่าง (fetch, render, state, validation)
export default function UserForm() {
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({});

  // Fetch data
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    setUsers(await res.json());
    setLoading(false);
  };

  // Validate
  const validate = (data: any) => {
    const errors: any = {};
    if (!data.email) errors.email = "Required";
    return errors;
  };

  // Render
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
      <UserList users={users()} />
    </div>
  );
}
```

### ✅ ควรทำ

```typescript
// Component แยกหน้าที่
// 1. Data fetching
export function useUsers() {
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    setUsers(await res.json());
    setLoading(false);
  };

  return { users, loading, fetchUsers };
}

// 2. Validation
export function validateUser(data: any) {
  const errors: any = {};
  if (!data.email) errors.email = "Required";
  return errors;
}

// 3. Presentational component
export function UserForm() {
  const { users, loading, fetchUsers } = useUsers();
  const [errors, setErrors] = createSignal({});

  return (
    <form onSubmit={handleSubmit}>
      <UserInput errors={errors()} />
    </form>
  );
}
```

## Route Responsibility

### ❌ ไม่ควรทำ

```typescript
// routes/users.tsx - ทำหลายอย่าง
export default function UsersPage() {
  // Fetch data
  // Render list
  // Handle create
  // Handle delete
  // Handle edit
}
```

### ✅ ควรทำ

```typescript
// routes/users/index.tsx - เฉพาะ render list
export default function UsersPage() {
  const users = useUsers();
  return <UserList users={users()} />;
}

// routes/api/users.ts - API endpoint
export async function GET() {
  return json(await getUsers());
}

// components/UserList.tsx - เฉพาะ render list
export function UserList(props: { users: User[] }) {
  return <ul>{props.users.map(user => <UserItem user={user} />)}</ul>;
}
```

## File Organization

```
src/
├── components/
│   ├── ui/              # Presentational components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── features/        # Feature-specific components
│   │   ├── UserForm.tsx
│   │   └── UserList.tsx
│   └── layout/          # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                 # Utility functions
│   ├── api.ts          # API calls
│   ├── validation.ts   # Validation logic
│   └── utils.ts        # General utilities
├── stores/             # State management
│   └── userStore.ts
└── types/              # TypeScript types
    └── user.ts
```

## Benefits

- **Maintainable**: แก้ไขง่าย เพราะแต่ละไฟล์มีหน้าที่ชัดเจน
- **Testable**: Test ง่าย เพราะแยก logic ออกจาก UI
- **Reusable**: Components สามารถ reuse ได้ง่าย
- **Scalable**: เติบโตได้โดยไม่ซับซ้อน

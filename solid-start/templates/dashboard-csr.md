# Dashboard CSR Example

ตัวอย่างการสร้าง dashboard ด้วย SolidStart แบบ Client-Side Rendering (CSR)

## Project Structure

```
dashboard/
├── src/
│   ├── routes/
│   │   ├── index.tsx              # Login page
│   │   ├── dashboard/
│   │   │   ├── index.tsx          # Dashboard home
│   │   │   ├── analytics.tsx      # Analytics page
│   │   │   └── settings.tsx       # Settings page
│   │   └── api/
│   │       ├── auth.ts           # Auth API
│   │       └── data.ts           # Data API
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── StatCard.tsx
│   ├── lib/
│   │   ├── auth.ts               # Auth utilities
│   │   └── api.ts                # API client
│   └── stores/
│       └── user.ts               # User store
├── app.config.ts
└── package.json
```

## Configuration

```typescript
// app.config.ts
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,        // Disable SSR for CSR
  prerender: false,   // Disable SSG
});
```

## User Store

```typescript
// src/stores/user.ts
import { createStore } from "solid-js/store";

const [user, setUser] = createStore({
  id: null,
  name: null,
  email: null,
  role: null,
  isAuthenticated: false
});

export const userStore = {
  get user() { return user; },
  setUser(data: any) { setUser(data); },
  logout() {
    setUser({
      id: null,
      name: null,
      email: null,
      role: null,
      isAuthenticated: false
    });
  }
};
```

## Auth API

```typescript
// src/routes/api/auth.ts
import { json } from "@solidjs/start/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Validate credentials
  if (email === "admin@example.com" && password === "password") {
    return json({
      user: {
        id: "1",
        name: "Admin",
        email: "admin@example.com",
        role: "admin"
      },
      token: "jwt-token-here"
    });
  }

  return json({ error: "Invalid credentials" }, { status: 401 });
}
```

## Login Page

```typescript
// src/routes/index.tsx
import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { userStore } from "~/stores/user";

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email(), password: password() })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      userStore.setUser({
        ...data.user,
        isAuthenticated: true
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div class="login-page">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <Show when={error()}>
          <div class="error">{error()}</div>
        </Show>
        <input
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
```

## Dashboard Layout

```typescript
// src/routes/dashboard/index.tsx
import { Outlet } from "@solidjs/router";
import Sidebar from "~/components/Sidebar";
import Header from "~/components/Header";
import { userStore } from "~/stores/user";

export default function DashboardLayout() {
  return (
    <div class="dashboard">
      <Sidebar />
      <div class="main-content">
        <Header />
        <main>
          <Show when={userStore.user.isAuthenticated}>
            <Outlet />
          </Show>
          <Show when={!userStore.user.isAuthenticated}>
            <div>Please login</div>
          </Show>
        </main>
      </div>
    </div>
  );
}
```

## Dashboard Home

```typescript
// src/routes/dashboard/index.tsx
import { createResource } from "solid-js";
import StatCard from "~/components/StatCard";

export default function DashboardHome() {
  const [stats] = createResource(async () => {
    const res = await fetch("/api/data/stats");
    return res.json();
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="dashboard-home">
        <h1>Dashboard</h1>
        <div class="stats-grid">
          <Show when={stats()}>
            {(s) => (
              <>
                <StatCard title="Users" value={s().users} />
                <StatCard title="Revenue" value={`$${s().revenue}`} />
                <StatCard title="Orders" value={s().orders} />
                <StatCard title="Conversion" value={`${s().conversion}%`} />
              </>
            )}
          </Show>
        </div>
      </div>
    </Suspense>
  );
}
```

## Stat Card Component

```typescript
// src/components/StatCard.tsx
export default function StatCard(props: { title: string; value: string | number }) {
  return (
    <div class="stat-card">
      <h3>{props.title}</h3>
      <div class="value">{props.value}</div>
    </div>
  );
}
```

## Data API

```typescript
// src/routes/api/data/stats.ts
import { json } from "@solidjs/start/server";

export async function GET() {
  // Simulate database query
  const stats = {
    users: 1234,
    revenue: 56789,
    orders: 890,
    conversion: 3.5
  };

  return json(stats);
}
```

## Key Features

- **CSR**: Full client-side rendering
- **Interactive**: Rich interactivity with SolidJS reactivity
- **State Management**: Centralized user store
- **Authentication**: Secure login flow
- **Real-time Data**: Dynamic data fetching
- **Type Safety**: TypeScript throughout

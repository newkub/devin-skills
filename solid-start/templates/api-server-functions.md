# API Server Functions Example

ตัวอย่างการสร้าง API ด้วย SolidStart server functions

## Project Structure

```
api-app/
├── src/
│   ├── routes/
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   ├── index.ts       # GET all users
│   │   │   │   └── [id].tsx       # GET/PUT/DELETE user
│   │   │   ├── posts/
│   │   │   │   ├── index.ts       # GET/POST posts
│   │   │   │   └── [id].tsx       # GET/PUT/DELETE post
│   │   │   └── health.ts          # Health check
│   ├── lib/
│   │   ├── db.ts                 # Database connection
│   │   └── schema.ts             # Database schema
│   └── middleware/
│       ├── auth.ts               # Auth middleware
│       └── error.ts              # Error middleware
├── app.config.ts
└── package.json
```

## Configuration

```typescript
// app.config.ts
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: true,
  prerender: false,
});
```

## Database Schema

```typescript
// src/lib/schema.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Connection

```typescript
// src/lib/db.ts
import { User, Post } from "./schema";

// In-memory database (replace with real DB)
const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin", createdAt: new Date() },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", createdAt: new Date() }
];

const posts: Post[] = [
  { id: "1", title: "First Post", content: "Hello World", authorId: "1", createdAt: new Date(), updatedAt: new Date() }
];

export const db = {
  users: {
    getAll: () => users,
    getById: (id: string) => users.find(u => u.id === id),
    create: (user: Omit<User, "id" | "createdAt">) => {
      const newUser = { ...user, id: String(users.length + 1), createdAt: new Date() };
      users.push(newUser);
      return newUser;
    },
    update: (id: string, updates: Partial<User>) => {
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        return true;
      }
      return false;
    }
  },
  posts: {
    getAll: () => posts,
    getById: (id: string) => posts.find(p => p.id === id),
    create: (post: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
      const newPost = { ...post, id: String(posts.length + 1), createdAt: new Date(), updatedAt: new Date() };
      posts.push(newPost);
      return newPost;
    },
    update: (id: string, updates: Partial<Post>) => {
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...updates, updatedAt: new Date() };
        return posts[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts.splice(index, 1);
        return true;
      }
      return false;
    }
  }
};
```

## Auth Middleware

```typescript
// src/middleware/auth.ts
export function authMiddleware(event: any) {
  const auth = event.request.headers.get("authorization");
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Validate token (simplified)
  if (!auth.startsWith("Bearer ")) {
    return new Response("Invalid token", { status: 401 });
  }

  return null; // Allow request to proceed
}
```

## Error Middleware

```typescript
// src/middleware/error.ts
export function errorMiddleware(event: any) {
  try {
    return event.next();
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
```

## Users API

```typescript
// src/routes/api/users/index.ts
import { json } from "@solidjs/start/server";
import { db } from "~/lib/db";
import { authMiddleware } from "~/middleware/auth";

export async function GET() {
  const users = db.users.getAll();
  return json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = db.users.create(body);
  return json(user, { status: 201 });
}
```

## User Detail API

```typescript
// src/routes/api/users/[id].tsx
import { json } from "@solidjs/start/server";
import { db } from "~/lib/db";
import { authMiddleware } from "~/middleware/auth";

export async function GET({ params }: { params: { id: string } }) {
  const user = db.users.getById(params.id);
  if (!user) {
    return json({ error: "User not found" }, { status: 404 });
  }
  return json(user);
}

export async function PUT({ params, request }: { params: { id: string }; request: Request }) {
  const authResult = authMiddleware({ request });
  if (authResult) return authResult;

  const body = await request.json();
  const user = db.users.update(params.id, body);
  if (!user) {
    return json({ error: "User not found" }, { status: 404 });
  }
  return json(user);
}

export async function DELETE({ params, request }: { params: { id: string }; request: Request }) {
  const authResult = authMiddleware({ request });
  if (authResult) return authResult;

  const deleted = db.users.delete(params.id);
  if (!deleted) {
    return json({ error: "User not found" }, { status: 404 });
  }
  return json({ message: "User deleted" });
}
```

## Posts API

```typescript
// src/routes/api/posts/index.ts
import { json } from "@solidjs/start/server";
import { db } from "~/lib/db";

export async function GET() {
  const posts = db.posts.getAll();
  return json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = db.posts.create(body);
  return json(post, { status: 201 });
}
```

## Health Check

```typescript
// src/routes/api/health.ts
import { json } from "@solidjs/start/server";

export async function GET() {
  return json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

## Client Usage

```typescript
// Example client usage
async function fetchUsers() {
  const res = await fetch("/api/users");
  const users = await res.json();
  return users;
}

async function createUser(user: any) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return res.json();
}

async function updateUser(id: string, updates: any) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer token"
    },
    body: JSON.stringify(updates)
  });
  return res.json();
}
```

## Key Features

- **RESTful API**: Standard HTTP methods
- **Authentication**: Bearer token auth
- **Error Handling**: Graceful error responses
- **Type Safety**: TypeScript interfaces
- **CRUD Operations**: Full CRUD for resources
- **Middleware**: Request/response interception

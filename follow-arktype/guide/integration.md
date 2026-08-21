# Integration

## Purpose

แนวทางการรวม ArkType กับ frameworks และ libraries ยอดนิยม

## Scope

- Express.js
- Hono
- SvelteKit
- React
- tRPC

## Express.js

### Basic Setup

```typescript
import express from "express";
import { type } from "arktype";

const app = express();
app.use(express.json());

// Define schemas
const CreateUserSchema = type({
  name: "string",
  email: "string.email()",
  password: "string.min(8)",
});

// Middleware
function validateBody(schema: typeof CreateUserSchema) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const result = schema(req.body);

    if (result instanceof type.errors) {
      return res.status(400).json({ errors: result });
    }

    req.body = result;
    next();
  };
}

// Use middleware
app.post("/users", validateBody(CreateUserSchema), (req, res) => {
  // req.body is typed
  const { name, email } = req.body;
  res.json({ name, email });
});
```

### Async Validation

```typescript
const CreateUserSchema = type({
  name: "string",
  email: "string",
}).assert(async (data) => {
  const exists = await db.user.findUnique({ where: { email: data.email } });
  if (exists) return "Email already exists";
  return null;
});
```

## Hono

### With Middleware

```typescript
import { Hono } from "hono";
import { type } from "arktype";

const app = new Hono();

const CreateUserSchema = type({
  name: "string",
  email: "string.email()",
});

// Middleware helper
function validateBody(schema: typeof CreateUserSchema) {
  return async (c: Context, next: Next) => {
    const body = await c.req.json();
    const result = schema(body);

    if (result instanceof type.errors) {
      return c.json({ errors: result }, 400);
    }

    c.set("body", result);
    await next();
  };
}

app.post("/users", validateBody(CreateUserSchema), async (c) => {
  const { name, email } = c.get("body");
  // ... handle request
});
```

## SvelteKit

### Form Actions

```typescript
// +page.server.ts
import { type } from "arktype";
import { fail } from "@sveltejs/kit";

const ContactSchema = type({
  name: "string.min(2)",
  email: "string.email()",
  message: "string.min(10)",
});

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const body = Object.fromEntries(data);

    const result = ContactSchema(body);

    if (result instanceof type.errors) {
      return fail(400, { errors: result, values: body });
    }

    // Process valid data
    await sendEmail(result);
    return { success: true };
  },
};
```

### API Routes

```typescript
// +server.ts
import { json } from "@sveltejs/kit";
import { type } from "arktype";

const QuerySchema = type({
  page: "string.parseInt()",
  limit: "string.parseInt()",
});

export async function GET({ url }) {
  const query = {
    page: url.searchParams.get("page") ?? "1",
    limit: url.searchParams.get("limit") ?? "10",
  };

  const result = QuerySchema(query);

  if (result instanceof type.errors) {
    return json({ errors: result }, { status: 400 });
  }

  return json({ page: result.page, limit: result.limit });
}
```

## React

### Form Component

```typescript
import { type } from "arktype";
import { useState } from "react";

const FormSchema = type({
  name: "string",
  email: "string.email()",
});

export function UserForm() {
  const [errors, setErrors] = useState<type.errors | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const result = FormSchema(data);

    if (result instanceof type.errors) {
      setErrors(result);
    } else {
      setErrors(null);
      // Submit data
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## tRPC

### Router Integration

```typescript
import { initTRPC } from "@trpc/server";
import { type } from "arktype";

const t = initTRPC.create();

const UserSchema = type({
  name: "string",
  email: "string.email()",
});

export const router = t.router({
  createUser: t.procedure
    .input((input) => {
      const result = UserSchema(input);
      if (result instanceof type.errors) throw new Error("Invalid input");
      return result;
    })
    .mutation(async ({ input }) => {
      // input is typed
      return db.user.create({ data: input });
    }),
});
```

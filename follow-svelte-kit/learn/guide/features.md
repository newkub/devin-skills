# Features

## Purpose

สรุป features ทั้งหมดของ SvelteKit

## Routing

### File-based Routing

| File | Route |
|------|-------|
| `+page.svelte` | `/` |
| `about/+page.svelte` | `/about` |
| `blog/[slug]/+page.svelte` | `/blog/:slug` |
| `(group)/page.svelte` | `/page` (grouped) |

### Route Parameters

```svelte
// src/routes/blog/[slug]/+page.svelte
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.params.slug}</h1>
```

### Layouts

```svelte
// src/routes/+layout.svelte
<slot />

// src/routes/blog/+layout.svelte
<slot />
```

## Data Loading

### Server Load

```typescript
// +page.server.ts
export async function load({ params, cookies, locals }) {
  return { item: await db.get(params.id) };
}
```

### Client Load

```typescript
// +page.ts
export async function load({ fetch }) {
  const res = await fetch('/api/items');
  return { items: await res.json() };
}
```

### Universal Load

Runs on both server and client.

```typescript
// +page.ts
export async function load({ fetch, depends }) {
  depends('app:data');
  const res = await fetch('/api/data');
  return { data: await res.json() };
}
```

## Form Actions

### Named Actions

```typescript
export const actions = {
  login: async ({ request }) => {
    // Handle login
  },
  register: async ({ request }) => {
    // Handle register
  }
};
```

```svelte
<form method="POST" action="?/login">
  <button>Login</button>
</form>

<form method="POST" action="?/register">
  <button>Register</button>
</form>
```

### Default Action

```typescript
export const actions = {
  default: async ({ request }) => {
    // Handles POST to the page
  }
};
```

## Stores

### Page Store

```svelte
<script>
  import { page } from '$app/stores';
  import { navigating } from '$app/stores';
  import { updated } from '$app/stores';
</script>

{$page.params.slug}
{$navigating}
{$updated}
```

### State Store

```svelte
<script>
  import { state } from '$app/state';
</script>

{$state.count}
```

## Hooks

### Server Hooks

```typescript
// src/hooks.server.ts
export async function handle({ event, resolve }) {
  event.locals.user = await getUser(event);

  return resolve(event);
}
```

### Init Hooks

```typescript
// src/hooks.server.ts
export async function initialize() {
  // Runs once on startup
}
```

## Environment Variables

### Private (Server-only)

```bash
# .env
DATABASE_URL=postgres://...
```

```typescript
import { DATABASE_URL } from '$env/dynamic/private';
```

### Public (Client-safe)

```bash
# .env
PUBLIC_API_URL=https://api.example.com
```

```typescript
import { PUBLIC_API_URL } from '$env/static/public';
```

## API Routes

### REST Endpoints

```typescript
// src/routes/api/users/+server.ts
export async function GET({ url }) {
  const users = await db.users.findMany();
  return Response.json(users);
}

export async function POST({ request }) {
  const data = await request.json();
  const user = await db.users.create({ data });
  return Response.json(user);
}
```

## Prerendering

### Enable Prerendering

```typescript
// +page.ts or +page.server.ts
export const prerender = true;

// Or in svelte.config.js
export default {
  kit: {
    prerender: {
      handleHttpError: 'warn'
    }
  }
};
```

## Error Handling

### Error Page

```svelte
<!-- +error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

{#if $page.status === 404}
  <h1>Not Found</h1>
{:else}
  <h1>Error</h1>
  <p>{$page.error?.message}</p>
{/if}
```

### Throwing Errors

```typescript
throw redirect(303, '/login');
throw error(404, 'User not found');
```

## TypeScript Support

### Typed Forms

```typescript
// +page.server.ts
export const actions = {
  default: async ({ request }) => {
    const data = await safeParseForm(request, FormSchema);
    // data is typed
  }
};
```

### App Types

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: User | null;
    }
    interface PageData {
      user: User;
    }
  }
}
```

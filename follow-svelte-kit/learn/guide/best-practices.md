# Best Practices

## Purpose

แนวทางปฏิบัติที่ดีที่สุดสำหรับการใช้ SvelteKit

## Scope

- Project structure
- Code organization
- Performance optimization
- Security
- Testing

## Project Structure

### Recommended Structure

```
src/
├── routes/
│   ├── +layout.svelte       # Root layout
│   ├── +page.svelte         # Home page
│   ├── (auth)/
│   │   ├── +layout.svelte   # Auth layout
│   │   ├── login/
│   │   └── register/
│   ├── (app)/
│   │   ├── +layout.svelte   # App layout (protected)
│   │   ├── dashboard/
│   │   └── settings/
│   └── api/
│       └── posts/
├── lib/
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   └── forms/           # Form components
│   ├── server/
│   │   └── db.ts            # Database client
│   ├── stores/
│   │   └── user.ts          # Client stores
│   └── utils/
│       └── format.ts        # Utility functions
└── hooks.server.ts
```

### Separate Server and Client Code

```typescript
// ✅ Good: Clear separation
// src/lib/server/db.ts - server only
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.DATABASE_URL!);

// src/lib/utils/format.ts - client & server
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

## Performance

### Use Prerendering When Possible

```typescript
// +page.ts
export const prerender = true;
```

### Minimize Client Load

```typescript
// ✅ Good: Server load for SEO-critical data
// +page.server.ts
export async function load() {
  return { posts: await getPosts() }; // SEO content on server
}

// ❌ Avoid: Client load for SEO-critical content
// +page.ts (client-only)
export async function load({ fetch }) {
  const res = await fetch('/api/posts');
  return { posts: await res.json() };
}
```

### Optimize Images

```svelte
<!-- ✅ Good -->
<picture>
  <source srcset="/image.avif" type="image/avif" />
  <source srcset="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Description" width="800" height="600" />
</picture>

<!-- Better: Use SvelteKit images -->
<script>
  import { Image } from '$lib/components';
</script>

<Image src="/image.jpg" alt="Description" width={800} height={600} />
```

### Lazy Load Components

```svelte
<script>
  import { onMount } from 'svelte';

  let HeavyComponent;

  onMount(async () => {
    const module = await import('$lib/components/Heavy.svelte');
    HeavyComponent = module.default;
  });
</script>

{#if HeavyComponent}
  <svelte:component this={HeavyComponent} />
{/if}
```

## Security

### Sanitize HTML

```typescript
// src/lib/server/sanitize.ts
import { JSDOM } from 'jsdom';

export function sanitizeHTML(html: string): string {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || '';
}
```

### Validate Form Data

```typescript
// +page.server.ts
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
});

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const result = schema.safeParse(Object.fromEntries(data));

    if (!result.success) {
      return fail(400, { errors: result.error.flatten() });
    }

    // Process valid data
    return { success: true };
  }
};
```

### Protect Routes

```typescript
// src/hooks.server.ts
export async function handle({ event, resolve }) {
  const protectedRoutes = ['/dashboard', '/settings'];

  if (protectedRoutes.includes(event.url.pathname)) {
    const session = await getSession(event.cookies);

    if (!session) {
      throw redirect(303, '/login');
    }

    event.locals.user = session.user;
  }

  return resolve(event);
}
```

## TypeScript

### Use App Types

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        role: 'admin' | 'user';
      } | null;
    }
    interface PageData {
      user: App.Locals['user'];
    }
    interface Error {
      code: string;
      message: string;
    }
  }
}

export {};
```

### Type Form Actions

```typescript
// +page.server.ts
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});

type FormData = z.infer<typeof FormSchema>;

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const parsed = FormSchema.safeParse(Object.fromEntries(data));

    if (!parsed.success) {
      return fail(400, { errors: parsed.error.flatten() });
    }

    const validData: FormData = parsed.data;
    // ...
  }
};
```

## Testing

### Component Testing

```typescript
// tests/test.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Welcome');
});
```

### API Testing

```typescript
test('API returns posts', async ({ request }) => {
  const response = await request.get('/api/posts');
  expect(response.ok()).toBeTruthy();
  const posts = await response.json();
  expect(Array.isArray(posts)).toBeTruthy();
});
```

## Next Steps

- Read about [Integration](./integration.md)
- Explore [Architecture](./architecture.md)
- Check [API Reference](../references/api.md)

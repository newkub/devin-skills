# API — $app Modules (Forms, Navigation, Server, Types)

## $app/forms

### enhance

Enhance form with progressive enhancement.

```typescript
import { enhance } from '$app/forms';

<form method="POST" use:enhance={() => {
  return async ({ update }) => {
    await update();
  };
}}>
```

### applyAction

Apply action result manually.

```typescript
import { applyAction } from '$app/forms';

const result = await fetch('/?/action', {
  method: 'POST',
  body: new FormData(form)
});

// Apply redirect/success
await applyAction(result);
```

## $app/navigation

### goto

Navigate to URL.

```typescript
import { goto } from '$app/navigation';

await goto('/dashboard');
await goto('/user?id=123', { replaceState: true });
```

### invalidate

Invalidate load functions.

```typescript
import { invalidate } from '$app/navigation';

await invalidate('/api/data');
await invalidate((url) => url.pathname.startsWith('/api'));
```

### invalidateAll

Invalidate all load functions.

```typescript
import { invalidateAll } from '$app/navigation';

await invalidateAll();
```

### preloadData

Preload data for route.

```typescript
import { preloadData } from '$app/navigation';

await preloadData('/about');
```

### preloadRoute

Preload route component.

```typescript
import { preloadRoute } from '$app/navigation';

await preloadRoute('/blog/[slug]');
```

## $app/server

### depends

Declare data dependencies.

```typescript
import { depends } from '$app/server';

export async function load({ fetch, params }) {
  depends(`post:${params.slug}`);
  // ...
}
```

## $app/types

### ActionResult

Result from form action.

```typescript
import type { ActionResult } from '@sveltejs/kit';

if (result.type === 'success') {
  console.log(result.data);
} else if (result.type === 'failure') {
  console.log(result.data);
}
```

### Page

Page load result.

```typescript
import type { Page } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  return { user: { name: 'John' } };
};
```

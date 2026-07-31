# API

## Purpose

Complete API reference for SvelteKit modules and types.

## $app/stores

### page

Current page information.

```typescript
import { page } from '$app/stores';

// Svelte 4
$: console.log($page.params.slug);
$: console.log($page.status);
$: console.log($page.error);

// Svelte 5
import { page } from '$app/state';
console.log(page.params.slug);
```

### navigating

Navigation state.

```typescript
import { navigating } from '$app/stores';

$: if ($navigating) {
  console.log('Navigating to:', $navigating.to.url.pathname);
}
```

### updated

Check for page updates.

```typescript
import { updated } from '$app/stores';

$: if ($updated) {
  console.log('Page has been updated');
}
```

## $app/state

### page

Reactive page object (Svelte 5).

```typescript
import { page } from '$app/state';

console.log(page.params);
console.log(page.url);
console.log(page.status);
console.log(page.error);
```

### navigating

Navigation state (Svelte 5).

```typescript
import { navigating } from '$app/state';

if (navigating) {
  console.log(navigating.to.url.pathname);
}
```

## $app/environment

### browser

Check if running in browser.

```typescript
import { browser } from '$app/environment';

if (browser) {
  // Client-side only code
}
```

### building

Check if building for prerender.

```typescript
import { building } from '$app/environment';

if (building) {
  // Build-time code
}
```

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

## SvelteKit Functions

### error

Throw HTTP error.

```typescript
import { error } from '@sveltejs/kit';

throw error(404, 'Post not found');
throw error(500, 'Internal server error');
```

### redirect

Redirect to another page.

```typescript
import { redirect } from '@sveltejs/kit';

throw redirect(303, '/login');
throw redirect(301, '/new-url');
```

### fail

Return form failure.

```typescript
import { fail } from '@sveltejs/kit';

return fail(400, {
  error: 'Invalid email',
  values: { email }
});
```

### json

Return JSON response.

```typescript
import { json } from '@sveltejs/kit';

return json({ user: { id: 1 } });
return json({ error: 'Not found' }, { status: 404 });
```

## SvelteKit Exports

### load

Page load function types.

```typescript
import type { PageLoad, PageServerLoad } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  return { post: await getPost(params.slug) };
};
```

### actions

Form actions type.

```typescript
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    // ...
  }
};
```

### prerender

Enable prerendering.

```typescript
export const prerender = true;
export const prerender = 'auto';
```

### entries

Generate prerender entries.

```typescript
export const entries = () => {
  return [{ slug: 'post-1' }, { slug: 'post-2' }];
};
```
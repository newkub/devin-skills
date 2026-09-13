# API — SvelteKit Functions & Exports

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

# Quick Start

## Purpose

คู่มือเริ่มต้นใช้งาน SvelteKit อย่างรวดเร็ว

## Scope

- Creating first page
- Adding data loading
- Creating form actions
- Understanding routing
- Basic styling

## Step 1: Create Project

```bash
npx sv create my-app --template minimal --types ts
cd my-app
bun install
```

## Step 2: Create Page

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { name } from '$app/stores';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Current path: {$page.url.pathname}</p>
```

## Step 3: Add Data Loading

```typescript
// src/routes/+page.server.ts
export async function load() {
  return {
    message: 'Hello from server!'
  };
}
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

<h1>{data.message}</h1>
```

## Step 4: Create Form Action

```typescript
// src/routes/+page.server.ts
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    
    return { success: true, name };
  }
};
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  
  let { data, form } = $props();
</script>

{#if form?.success}
  <p>Hello, {form.name}!</p>
{/if}

<form method="POST" use:enhance>
  <input name="name" placeholder="Your name" />
  <button type="submit">Submit</button>
</form>
```

## Step 5: Add New Route

```bash
mkdir -p src/routes/about
```

```svelte
<!-- src/routes/about/+page.svelte -->
<h1>About Us</h1>
<p>This is the about page.</p>
```

Visit `/about`

## Step 6: Dynamic Route

```bash
mkdir -p "src/routes/blog/[slug]"
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<h1>Blog Post: {$page.params.slug}</h1>
```

Visit `/blog/my-first-post`

## Step 7: Layout

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  let { children } = $props();
</script>

<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

{@render children()}
```

## Complete Example

### File Structure

```
src/routes/
├── +layout.svelte
├── +page.svelte
├── +page.server.ts
├── about/
│   └── +page.svelte
└── blog/
    └── [slug]/
        ├── +page.svelte
        └── +page.server.ts
```

### Server Load

```typescript
// src/routes/blog/[slug]/+page.server.ts
export async function load({ params }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  return { post };
}
```

### Display Data

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```

## Next Steps

- Learn about [Key Concepts](./key-concept.md)
- Explore [Features](./features.md)
- Read about [Integration](./integration.md)
# How It Works

## Purpose

อธิบายการทำงานภายในของ SvelteKit เพื่อให้เข้าใจ request flow และ rendering pipeline

## Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Request Flow                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Browser ──> SvelteKit ──> Hooks ──> Load ──> Render       │
│                                     │           │           │
│                                     ▼           ▼           │
│                               +page.server  +page.svelte   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step by Step

| Step | Description | File |
|------|-------------|------|
| 1. Request | Browser sends request | - |
| 2. Hooks | Handle request/response | `hooks.server.ts` |
| 3. Routing | Match URL to route | `src/routes/**` |
| 4. Load | Fetch data | `+page.server.ts`, `+page.ts` |
| 5. Render | Generate HTML | `+page.svelte` |
| 6. Response | Send to browser | - |

## Routing System

### Basic Route

```
src/routes/
└── blog/
    └── +page.svelte  → /blog
```

### Dynamic Route

```
src/routes/
└── blog/
    └── [slug]/
        └── +page.svelte  → /blog/:slug
```

### Layout System

```
┌─────────────────────────────────────────────────────────────┐
│              +layout.svelte (root)                         │
├─────────────────────────────────────────────────────────────┤
│   ┌─────────────────────────────────────────────────────┐ │
│   │        +layout.svelte (blog group)                  │ │
│   ├─────────────────────────────────────────────────────┤ │
│   │   +page.svelte (blog post)                          │ │
│   │                                                     │ │
│   └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Loading

### Server Load

```typescript
// +page.server.ts
export async function load({ params, fetch }) {
  const res = await fetch(`/api/posts/${params.slug}`);
  const post = await res.json();

  return { post };
}
```

### Client Load

```typescript
// +page.ts
export async function load({ fetch }) {
  const res = await fetch('/api/posts');
  const posts = await res.json();

  return { posts };
}
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Loading Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  +page.server.ts ──> Server data ──> Page props            │
│         │                          │                        │
│         │                          ▼                        │
│         │                   +page.svelte                    │
│         │                          │                        │
│         │                          ▼                        │
│  +page.ts ──> Client data ────> Page (after hydration)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Form Actions

### Basic Action

```typescript
// +page.server.ts
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');

    await saveToDatabase(name);

    return { success: true };
  }
};
```

### Form Usage

```svelte
<form method="POST">
  <input name="name" />
  <button>Submit</button>
</form>
```

## Error Handling

### Error Page

```svelte
<!-- +error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1>
<p>{$page.error?.message}</p>
```

## Preloading

### Link Preloading

```svelte
<!-- Preload on hover -->
<a href="/about" data-sveltekit-preload-data="hover">About</a>

<!-- Preload on visible -->
<a href="/about" data-sveltekit-preload-data="viewport">About</a>

<!-- No preload -->
<a href="/about" data-sveltekit-preload-data="off">About</a>
```

## SSR vs CSR

### Server-Side Rendering

```typescript
// +page.server.ts (default)
export async function load() {
  // Runs on server only
  return { data: await fetchFromDB() };
}
```

### Client-Side Rendering

```svelte
<!-- +page.svelte -->
<script>
  import { browser } from '$app/environment';

  let data;

  if (browser) {
    // Runs on client only
    data = await fetch('/api/data').then(r => r.json());
  }
</script>
```

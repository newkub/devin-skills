# Blog SSG Example

ตัวอย่างการสร้าง blog ด้วย SolidStart แบบ Static Site Generation (SSG)

## Project Structure

```
blog/
├── src/
│   ├── routes/
│   │   ├── index.tsx              # Home page
│   │   ├── blog/
│   │   │   ├── index.tsx          # Blog listing
│   │   │   └── [slug].tsx         # Blog post
│   │   └── api/
│   │       └── posts.ts           # API route
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PostCard.tsx
│   └── lib/
│       └── posts.ts              # Posts data
├── app.config.ts
└── package.json
```

## Configuration

```typescript
// app.config.ts
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,        // Disable SSR
  prerender: true,    // Enable SSG
  prerenderRoutes: {
    include: ["/", "/blog", "/blog/*"],
    exclude: ["/api/*"]
  }
});
```

## Posts Data

```typescript
// src/lib/posts.ts
export const posts = [
  {
    slug: "getting-started-with-solidstart",
    title: "Getting Started with SolidStart",
    excerpt: "Learn how to build your first SolidStart application",
    content: "Full content here...",
    date: "2024-01-15",
    author: "John Doe"
  },
  {
    slug: "file-based-routing",
    title: "File-Based Routing in SolidStart",
    excerpt: "Understanding SolidStart's routing system",
    content: "Full content here...",
    date: "2024-01-20",
    author: "Jane Smith"
  }
];

export function getPostBySlug(slug: string) {
  return posts.find(post => post.slug === slug);
}

export function getAllPosts() {
  return posts;
}
```

## API Route

```typescript
// src/routes/api/posts.ts
import { json } from "@solidjs/start/server";
import { getAllPosts } from "~/lib/posts";

export async function GET() {
  return json(getAllPosts());
}
```

## Home Page

```typescript
// src/routes/index.tsx
import { A } from "@solidjs/router";

export default function Home() {
  return (
    <div class="home">
      <h1>Welcome to My Blog</h1>
      <p>Learn SolidStart through practical examples</p>
      <A href="/blog">View Posts</A>
    </div>
  );
}
```

## Blog Listing

```typescript
// src/routes/blog/index.tsx
import { For } from "solid-js";
import { A } from "@solidjs/router";
import { getAllPosts } from "~/lib/posts";
import PostCard from "~/components/PostCard";

export default function BlogListing() {
  const posts = getAllPosts();

  return (
    <div class="blog-listing">
      <h1>Blog Posts</h1>
      <div class="posts-grid">
        <For each={posts}>
          {(post) => (
            <PostCard post={post} />
          )}
        </For>
      </div>
    </div>
  );
}
```

## Blog Post

```typescript
// src/routes/blog/[slug].tsx
import { cache, createAsync } from "@solidjs/router";
import { getPostBySlug } from "~/lib/posts";

export function routeData({ params }: { params: { slug: string } }) {
  return cache(() => getPostBySlug(params.slug), "post");
}

export default function BlogPost() {
  const post = createAsync(() => routeData(useRouteData()));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Show when={post()}>
        {(p) => (
          <article class="blog-post">
            <h1>{p().title}</h1>
            <div class="meta">
              <span>{p().date}</span>
              <span>By {p().author}</span>
            </div>
            <div innerHTML={p().content} />
          </article>
        )}
      </Show>
    </Suspense>
  );
}
```

## Post Card Component

```typescript
// src/components/PostCard.tsx
import { A } from "@solidjs/router";

export default function PostCard(props: { post: any }) {
  return (
    <div class="post-card">
      <A href={`/blog/${props.post.slug}`}>
        <h2>{props.post.title}</h2>
        <p>{props.post.excerpt}</p>
        <div class="meta">
          <span>{props.post.date}</span>
          <span>{props.post.author}</span>
        </div>
      </A>
    </div>
  );
}
```

## Build and Deploy

```bash
# Build for production
bun run build

# Preview build
bun run preview

# Deploy to Vercel
vercel deploy
```

## Key Features

- **SSG**: Pre-render all pages at build time
- **Fast Performance**: Static HTML served from CDN
- **SEO Friendly**: Full HTML for search engines
- **Type Safety**: TypeScript throughout
- **File-Based Routing**: Intuitive route structure

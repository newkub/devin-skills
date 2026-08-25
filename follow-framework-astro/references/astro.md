# Astro 5 Reference

## Install

```bash
# Create new project
bunx create-astro@latest

# Upgrade existing project
npx @astrojs/upgrade

# Manual install
bun add astro
```

## Version Info

- Latest stable: `5.x` (Astro 5.15+ as of 2026)
- Node.js >= 18.20.8, >= 20.3.0, or >= 22.0.0
- Build tool: Vite 6+
- Peer dependencies: `vite`, `typescript` (optional)

## CLI Commands

```bash
bunx astro dev        # Start dev server
bunx astro build      # Build for production
bunx astro preview    # Preview production build
bunx astro check      # TypeScript diagnostics
bunx astro add node   # Add integration/adapter
```

## Configuration

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  env: {
    schema: {
      API_KEY: 'string',
    },
  },
});
```

## Adapters

```bash
bunx astro add node       # Node.js
bunx astro add vercel     # Vercel
bunx astro add netlify    # Netlify
bunx astro add cloudflare # Cloudflare
```

`@astrojs/node` config (`standalone` mode starts server at `./dist/server/entry.mjs`; `middleware` mode for Express/Fastify):

```js
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
});
```

## Server Islands

Add `server:defer` directive to defer rendering per-request:

`src/pages/index.astro`:

```astro
---
import Avatar from '../components/Avatar.astro';
---
<Avatar server:defer />
```

`src/components/Avatar.astro`:

```astro
---
import { getUserAvatar } from '../sessions';
const userSession = Astro.cookies.get('session');
const avatarURL = await getUserAvatar(userSession);
---
<img alt="User avatar" src={avatarURL} />
```

### Fallback And Props

Use `slot="fallback"` for loading placeholder. Props must be serializable (no functions, dates, class instances) and are encrypted automatically:

```astro
<Avatar server:defer>
  <div slot="fallback">Loading...</div>
</Avatar>
```

### Caching

Set `Cache-Control` headers for individual islands:

```astro
---
Astro.response.headers.set('Cache-Control', 'private, max-age=60');
---
```
## Content Layer API

Define collections in `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog };
```

### `glob()` Loader

Fetches from directories of Markdown, MDX, Markdoc, JSON, YAML, or TOML:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
});
export const collections = { blog };
```

### `file()` Loader

Fetches multiple entries from a single JSON/YAML/TOML file:

```ts
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';

const dogs = defineCollection({ loader: file('src/data/dogs.json') });
export const collections = { dogs };
```

### Querying Collections

```ts
import { getCollection, render } from 'astro:content';
const posts = await getCollection('blog');
const { body } = await render(posts[0]);
```

## Astro Actions

Define in `src/actions/index.ts`:

```ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      return `Hello, ${input.name}!`;
    },
  }),
};
```

### Call From Client

```astro
---
---

<button>Get greeting</button>

<script>
  import { actions } from 'astro:actions';

  const button = document.querySelector('button');
  button?.addEventListener('click', async () => {
    const { data, error } = await actions.getGreeting({ name: 'Houston' });
    if (!error) alert(data);
  });
</script>
```

## Islands Architecture Directives

```astro
<MyComponent client:load />        {/* Hydrate immediately */}
<MyComponent client:idle />        {/* Hydrate when browser idle */}
<MyComponent client:visible />     {/* Hydrate when visible in viewport */}
<MyComponent client:media="(max-width: 50em)" /> {/* Hydrate on media match */}
<MyComponent client:only="react" /> {/* Render only on client */}
```

## Rendering Modes

- Static by default (no `output` config needed; `output: 'hybrid'` removed in Astro 5)
- `prerender = false` for SSR pages:

```astro
---
export const prerender = false;
---
```

## Type-Safe Environment Variables

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  env: { schema: { API_KEY: 'string', DATABASE_URL: 'string' } },
});
```

```ts
const apiKey = import.meta.env.API_KEY;
```

## Source

- https://docs.astro.build/en/guides/server-islands/
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/guides/actions/
- https://docs.astro.build/en/guides/integrations-guide/node/
- https://astro.build/blog/astro-5/

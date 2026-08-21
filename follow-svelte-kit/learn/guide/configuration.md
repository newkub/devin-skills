# Configuration

## Purpose

คู่มือการตั้งค่า SvelteKit สำหรับ project ต่างๆ

## Scope

- svelte.config.js
- vite.config.ts
- Adapter configuration
- Prerender settings
- TypeScript options

## svelte.config.js

### Basic Configuration

```javascript
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  }
};

export default config;
```

### With Adapters

```javascript
import adapter from '@sveltejs/adapter-auto';
import node from '@sveltejs/adapter-node';
import static_adapter from '@sveltejs/adapter-static';
import vercel from '@sveltejs/adapter-vercel';
import cloudflare from '@sveltejs/adapter-cloudflare';

// Node.js server
const config = {
  kit: {
    adapter: node()
  }
};

// Static site
const config = {
  kit: {
    adapter: static_adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined
    })
  }
};

// Vercel
const config = {
  kit: {
    adapter: vercel()
  }
};

// Cloudflare Pages
const config = {
  kit: {
    adapter: cloudflare()
  }
};
```

## Prerendering

### Page-level Prerender

```typescript
// +page.ts or +page.server.ts
export const prerender = true;
```

### Prerender All

```javascript
const config = {
  kit: {
    prerender: {
      entries: ['*']  // prerender all routes
    }
  }
};
```

### Prerender Options

```javascript
const config = {
  kit: {
    prerender: {
      entries: ['*'],
      handleHttpError: 'warn',  // 'throw', 'warn', 'ignore'
      handleMissingId: 'warn',    // 'throw', 'warn', 'ignore'
      handleDuplicateId: 'warn'   // 'throw', 'warn', 'ignore'
    }
  }
};
```

## Routing

### Aliases

```javascript
const config = {
  kit: {
    alias: {
      $components: 'src/lib/components',
      $utils: 'src/lib/utils'
    }
  }
};
```

### Route Groups

```javascript
// (marketing) group - no URL impact
// src/routes/(marketing)/about/+page.svelte → /about
// src/routes/(marketing)/pricing/+page.svelte → /pricing
```

## CSP Configuration

```javascript
const config = {
  kit: {
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'script-src': ['self', 'unsafe-inline'],
        'style-src': ['self', 'unsafe-inline']
      }
    }
  }
};
```

## Service Workers

### Enable Service Worker

```javascript
const config = {
  kit: {
    serviceWorker: {
      register: true
    }
  }
};
```

### Service Worker Location

```
src/routes/
├── +layout.svelte
└── service-worker.ts  // → /service-worker.js
```

## vite.config.ts

### Basic Configuration

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
});
```

### With Plugins

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [sveltekit(), UnoCSS()]
});
```

### Proxy (Development)

```typescript
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

## Environment Variables

### Private Variables

```bash
# .env
DATABASE_URL=postgres://user:pass@localhost/db
API_SECRET=xxx
```

```typescript
import { DATABASE_URL, API_SECRET } from '$env/dynamic/private';
```

### Public Variables

```bash
# .env
PUBLIC_API_URL=https://api.example.com
PUBLIC_MAP_KEY=xxx
```

```typescript
import { PUBLIC_API_URL } from '$env/static/public';
// or
import { PUBLIC_API_URL } from '$env/dynamic/public';
```

## TypeScript

### Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "allowJs": true,
    "checkJs": true
  }
}
```

### App Types

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Error {
      message: string;
      code?: string;
    }
    interface Locals {
      user: {
        id: string;
        name: string;
      } | null;
    }
    interface PageData {
      title?: string;
    }
    interface Platform {
      env?: {
        DB: D1Database;
      };
    }
  }
}

export {};
```

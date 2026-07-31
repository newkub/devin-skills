# Integration

## Frontend Frameworks

### React

```javascript
// Component with hooks
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Vue.js

```javascript
// Vue 3 Composition API
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const doubled = computed(() => count.value * 2);

    const increment = () => count.value++;

    onMounted(() => {
      console.log('Component mounted');
    });

    return { count, doubled, increment };
  }
}
```

### Svelte

```javascript
// Svelte component
<script>
  let count = 0;

  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>
  Count: {count}
</button>
```

## Backend Frameworks

### Express.js

```javascript
import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal error' });
});

app.listen(3000);
```

### Fastify

```javascript
import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/api/health', async () => {
  return { status: 'ok' };
});

await fastify.listen({ port: 3000 });
```

### Hono

```javascript
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/users/:id', (c) => {
  return c.json({ id: c.req.param('id') });
});

export default {
  fetch: app.fetch
};
```

## Build Tools

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};
```

## Testing Libraries

### Vitest

```javascript
// sum.test.js
import { describe, it, expect } from 'vitest';
import { sum } from './sum.js';

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
```

### Jest

```javascript
// sum.test.js
describe('sum', () => {
  test('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
```

## Linting & Formatting

### ESLint + Prettier

```bash
bun install -D eslint prettier eslint-config-prettier
```

```json
// .eslintrc.json
{
  "extends": ["prettier"],
  "plugins": ["prettier"]
}
```

## Database ORMs

### Prisma

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUser(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  });
}
```

### Drizzle

```javascript
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull()
});

const db = drizzle(sql);
```

## API Clients

### Fetch API

```javascript
async function fetchAPI(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

### Axios

```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error(err);
    return Promise.reject(err);
  }
);
```

## Framework Integration Matrix

| Framework | Import Style | Type Support | Build Tool |
|-----------|--------------|--------------|------------|
| React | ESM/CommonJS | JSX | Vite, Webpack |
| Vue | ESM | Single File | Vite |
| Express | CommonJS | No | Node.js native |
| Fastify | ESM | TypeScript | Node.js native |
| Svelte | ESM | Svelte files | Vite |
# Storage Features

## Vercel KV

```typescript
import { kv } from '@vercel/kv';

// Set value
await kv.set('user:123', JSON.stringify({ name: 'John' }));

// Get value
const user = await kv.get('user:123');

// Delete
await kv.del('user:123');
```

## Vercel Postgres

```typescript
import { sql } from '@vercel/postgres';

// Query
const { rows } = await sql`SELECT * FROM users`;

// Parameterized
const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
```

## Vercel Blob

```typescript
import { put, del, list } from '@vercel/blob';

// Upload
const blob = await put('file.txt', 'Hello', {
  access: 'public'
});

// List
const { blobs } = await list();

// Delete
await del('file.txt');
```

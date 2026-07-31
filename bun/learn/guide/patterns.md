# Patterns

## Common Patterns

### Async/Await

```typescript
async function fetchData() {
  const response = await fetch('https://api.example.com');
  const data = await response.json();
  return data;
}
```

### Server

```typescript
Bun.serve({ port: 3000, fetch(req) { return new Response('Hello from Bun!'); } });
```

### File I/O

```typescript
const file = Bun.file('data.json');
const content = await file.text();
```

### Worker

```typescript
const worker = new Worker('./worker.ts');
worker.postMessage({ task: 'heavy' });
```

## Best Practices

### TypeScript

```typescript
interface User { id: number; name: string }
function getUser(id: number): User { /* ... */ }
```

### Error Handling

```typescript
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed to fetch:', error);
}
```

### Environment Variables

```typescript
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY is required');
```

### Modular Code

```typescript
// lib/utils.ts
export function formatDate(date: Date): string { return date.toISOString(); }
// src/index.ts
import { formatDate } from './lib/utils';
```

## Anti-Patterns

### ❌ Synchronous File Operations

```typescript
const data = fs.readFileSync('file.txt');
```

### ✅ Async File Operations

```typescript
const data = await Bun.file('file.txt').text();
```

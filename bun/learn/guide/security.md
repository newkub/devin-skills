# Security

## Security Features

- Sandboxing - รองรับ worker isolation
- Secure by default - ไม่มี dangerous APIs เปิดใช้โดย default
- Type safety - TypeScript integration

## Best Practices

### Environment Variables

```bash
# .env
API_KEY=your_secret_key
DATABASE_URL=postgres://...
```

```typescript
const apiKey = process.env.API_KEY;
```

### Input Validation

```typescript
import { z } from 'zod';
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Dependency Security

```bash
bun audit
```

### Secure HTTP

```typescript
const response = await fetch('https://api.example.com', {
  headers: { 'Authorization': `Bearer ${token}` },
});
```

### File System Access

```typescript
// ❌ อันตราย
const data = await Bun.file(userInput).text();

// ✅ ปลอดภัย
const allowedPath = './data/safe.txt';
const data = await Bun.file(allowedPath).text();
```

## Common Vulnerabilities

### XSS Prevention

```typescript
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
```

### SQL Injection

```typescript
// ❌ อันตราย
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ ปลอดภัย
const query = 'SELECT * FROM users WHERE id = $1';
```

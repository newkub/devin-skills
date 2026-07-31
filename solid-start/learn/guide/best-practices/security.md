# Security - SolidStart

## Security Best Practices

### Environment Variables

ไม่ commit secrets ใน code:

```bash
# .env (gitignored)
DATABASE_URL=
API_SECRET=

# .env.example (committed)
DATABASE_URL=
API_SECRET=
```

ใช้ใน SolidStart:

```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

### Input Validation

ใช้ Zod สำหรับ validation:

```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json();
  const validated = schema.parse(body);
  // Process validated data
}
```

### XSS Prevention

SolidJS ป้องกัน XSS โดย default:

```typescript
// ✅ Safe - SolidJS escapes HTML
const html = "<script>alert('xss')</script>";
return <div>{html}</div>;

// ❌ Dangerous - ใช้ innerHTML อย่างระวัง
return <div innerHTML={html} />;
```

### CSRF Protection

ใช้ CSRF tokens สำหรับ forms:

```typescript
// middleware.ts
export function onRequest(event: any) {
  const token = event.request.headers.get("X-CSRF-Token");
  if (!validateCSRF(token)) {
    return new Response("Invalid CSRF token", { status: 403 });
  }
}
```

### Authentication

ใช้ authentication ใน middleware:

```typescript
// middleware.ts
export function onRequest(event: any) {
  const session = getSession(event.request);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

### Authorization

ตรวจสอบ permissions:

```typescript
export async function DELETE(req: Request) {
  const user = await getUser(req);
  if (!user.canDelete()) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
}
```

## Content Security Policy

ตั้งค่า CSP headers:

```typescript
// middleware.ts
export function onRequest(event: any) {
  const response = new Response();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  return response;
}
```

## API Security

### Rate Limiting

ใช้ rate limiting สำหรับ API:

```typescript
// middleware.ts
const rateLimit = new Map();

export function onRequest(event: any) {
  const ip = event.request.headers.get("cf-connecting-ip");
  const count = (rateLimit.get(ip) || 0) + 1;
  
  if (count > 100) {
    return new Response("Too many requests", { status: 429 });
  }
  
  rateLimit.set(ip, count);
}
```

### CORS

ตั้งค่า CORS headers:

```typescript
export async function OPTIONS(req: Request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
```

## Data Security

### Sensitive Data

ไม่ log sensitive data:

```typescript
// ❌ Bad
console.log(user.password);

// ✅ Good
console.log("User logged in");
```

### Encryption

ใช้ encryption สำหรับ sensitive data:

```typescript
import { encrypt, decrypt } from "./lib/crypto";

const encrypted = encrypt(data);
const decrypted = decrypt(encrypted);
```

## Common Security Issues

### SQL Injection

ใช้ parameterized queries:

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE id = '${id}'`;

// ✅ Good
const query = "SELECT * FROM users WHERE id = $1";
await db.query(query, [id]);
```

### Path Traversal

ตรวจสอบ file paths:

```typescript
const path = req.query.path;
if (path.includes("..")) {
  return new Response("Invalid path", { status: 400 });
}
```

### Dependency Vulnerabilities

ตรวจสอบ dependencies:

```bash
bun audit
```

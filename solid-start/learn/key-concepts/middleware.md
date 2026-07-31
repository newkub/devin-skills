---
title: Middleware
description: Middleware ใน Solid Start สำหรับ request interception, authentication, และ request/response modification
---

## Middleware คืออะไร

Middleware คือฟังก์ชันที่ทำงานก่อน route handler ใน Solid Start ใช้สำหรับ:
- Request interception
- Authentication และ authorization
- Request/response modification
- Logging และ monitoring
- Rate limiting

## การใช้งาน Middleware

สร้าง middleware ใน `src/middleware.ts`:

```typescript
import { createMiddleware } from "solid-start/server";

export const middleware = createMiddleware({
  onRequest: (event) => {
    // Intercept request
    console.log("Request:", event.request.url);
  },
  onResponse: (event) => {
    // Intercept response
    console.log("Response:", event.response.status);
  },
});
```

## Middleware Patterns

### Authentication

```typescript
export const middleware = createMiddleware({
  onRequest: async (event) => {
    const token = event.request.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
  },
});
```

### Logging

```typescript
export const middleware = createMiddleware({
  onRequest: (event) => {
    console.log(`[${new Date().toISOString()}] ${event.request.method} ${event.request.url}`);
  },
});
```

### CORS

```typescript
export const middleware = createMiddleware({
  onResponse: (event) => {
    event.response.headers.set("Access-Control-Allow-Origin", "*");
  },
});
```

## Best Practices

- ใช้ middleware สำหรับ cross-cutting concerns
- หลีกเลี่ยง logic ที่ซับซ้อนใน middleware
- ใช้ middleware สำหรับ authentication และ authorization
- ใช้ middleware สำหรับ logging และ monitoring

---
title: Middleware
description: เรียนรู้เรื่อง Middleware สำหรับ request interception ใน SolidStart
---

## สิ่งที่คือ Middleware

Middleware ช่วยให้ intercept และ process requests ก่อนถึง route handlers ใช้สำหรับ cross-cutting concerns

## การใช้งาน (SolidStart)

```jsx
// middleware.ts
import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: (event) => {
    // Process request before route
    console.log("Request:", event.request.url);
  },
  onResponse: (event) => {
    // Process response after route
    console.log("Response:", event.response.status);
  }
});
```

## onRequest Hook

Execute ก่อน route handler:

```jsx
export default createMiddleware({
  onRequest: async (event) => {
    const authHeader = event.request.headers.get("authorization");
    
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }
  }
});
```

## onResponse Hook

Execute หลัง route handler:

```jsx
export default createMiddleware({
  onResponse: (event) => {
    const response = new Response(event.response.body, {
      status: event.response.status,
      headers: {
        ...event.response.headers,
        "X-Custom-Header": "value"
      }
    });
    return response;
  }
});
```

## Use Cases

- **Authentication**: Verify tokens ก่อน access routes
- **Logging**: Log ทุก requests และ responses
- **CORS**: Handle cross-origin requests
- **Rate Limiting**: Limit request rates
- **Error Handling**: Global error handling
- **Headers**: Add custom headers

## Authentication Example

```jsx
export default createMiddleware({
  onRequest: async (event) => {
    const token = event.request.headers.get("authorization");
    
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await verifyToken(token);
    event.locals.user = user;
  }
});
```

## Logging Example

```jsx
export default createMiddleware({
  onRequest: (event) => {
    console.log(`${event.request.method} ${event.request.url}`);
  },
  onResponse: (event) => {
    console.log(`Status: ${event.response.status}`);
  }
});
```

## Conditional Middleware

Apply middleware เฉพาะบาง routes:

```jsx
export default createMiddleware({
  onRequest: (event) => {
    if (event.request.url.startsWith("/api")) {
      // API-specific logic
    }
  }
});
```

## ประโยชน์

- **Centralized Logic**: Logic รวมอยู่ที่เดียว
- **Reusability**: ใช้ middleware ซ้ำได้
- **Separation**: แยก cross-cutting concerns จาก business logic
- **Performance**: Early termination สำหรับ invalid requests

## ถัดไป

ดู [Components](./components.md) เพื่อเรียนรู้เรื่อง component model

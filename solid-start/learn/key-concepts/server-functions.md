# Server Functions

## แนวคิดหลัก

Server functions ใน SolidStart คือฟังก์ชันที่ทำงานบน server สำหรับ API routes, data fetching, และ server-side logic

## วิธีการทำงาน

Server functions ถูกกำหนดในไฟล์ routes และทำงานบน Nitro server

```typescript
// routes/api/hello.ts
import { json } from "@solidjs/start/server";

export async function GET() {
  return json({ message: "Hello World" });
}
```

## HTTP Methods

SolidStart รองรับ HTTP methods มาตรฐาน:

```typescript
export async function GET() {
  return json({ data: "GET" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return json({ data: "POST" }, { status: 201 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  return json({ data: "PUT" });
}

export async function DELETE(req: Request) {
  return json({ data: "DELETE" });
}
```

## Request Handling

### รับ Request Body

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  // หรือ
  const formData = await req.formData();
}
```

### รับ Query Parameters

```typescript
export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search");
  return json({ search });
}
```

### รับ Headers

```typescript
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  return json({ auth });
}
```

## Response Handling

### JSON Response

```typescript
import { json } from "@solidjs/start/server";

export async function GET() {
  return json({ data: "success" }, { status: 200 });
}
```

### Text Response

```typescript
export async function GET() {
  return new Response("Hello World", {
    headers: { "Content-Type": "text/plain" }
  });
}
```

### Error Response

```typescript
export async function GET() {
  return json({ error: "Not found" }, { status: 404 });
}
```

## Data Fetching

ใช้ `routeData` สำหรับ server-side data fetching:

```typescript
// routes/[slug].tsx
import { cache } from "@solidjs/router";

export function routeData() {
  return cache(async () => {
    const res = await fetch("https://api.example.com/data");
    return res.json();
  }, "data");
}
```

## Middleware

ใช้ middleware สำหรับ request/response interception:

```typescript
// middleware.ts
export function onRequest(event: any) {
  // Authentication
  const auth = event.request.headers.get("authorization");
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

## Benefits

- **Full-Stack**: API และ UI ใน project เดียว
- **Type Safety**: TypeScript support
- **Edge Support**: Deploy ได้ที่ edge networks
- **No CORS**: Server functions ไม่มี CORS issues

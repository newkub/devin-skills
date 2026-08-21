# Serverless Features

## Edge Functions

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Custom', 'value');
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static).*)',
};
```

## Serverless Functions

```typescript
// pages/api/users.ts
export default async function handler(req, res) {
  const users = await db.users.findMany();
  res.status(200).json(users);
}
```

## Streaming Responses

```typescript
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`chunk ${i}\n`));
        await new Promise(r => setTimeout(r, 500));
      }
      controller.close();
    }
  });

  return new Response(stream);
}
```

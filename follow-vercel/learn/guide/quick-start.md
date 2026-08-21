# Vercel - Quick Start

เริ่มต้นใช้งาน Vercel อย่างรวดเร็ว

## Basic Deployment

### Static HTML

```bash
mkdir my-site && cd my-site
echo "<h1>Hello World</h1>" > index.html
vercel
```

### React App

```bash
# Create React app
npx create-react-app my-app
cd my-app

# Deploy
vercel
```

### Next.js App

```bash
# Create Next.js app
npx create-next-app@latest my-app
cd my-app

# Deploy
vercel
```

## Project Structure

### Next.js App Router

```
my-next-app/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── about/
│       └── page.tsx      # /about
├── components/
│   └── Button.tsx
├── lib/
│   └── utils.ts
├── public/
│   └── images/
├── package.json
└── next.config.js
```

### Static Site

```
my-static-site/
├── index.html
├── about.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── vercel.json
```

## Environment Variables

### Add Variables

```bash
# Interactive
vercel env add

# Specific env
vercel env add DATABASE_URL
vercel env add SECRET_KEY --production
vercel env add DEBUG --development
```

### Access in Code

```typescript
// Server-side
const dbUrl = process.env.DATABASE_URL;

// Client-side (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Custom Domain

### Add Domain

```bash
vercel domains add example.com
```

### Configure DNS

```text
Type    Name    Value
A       @      76.76.21.21
CNAME   www    cname.vercel-dns.com
```

### Redirect www to root

```json
// vercel.json
{
  "redirects": [
    { "source": "/(.*)", "destination": "https://example.com$1", "permanent": true }
  ]
}
```

## CLI Commands Reference

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel dev` | Start dev server |
| `vercel logs` | View logs |
| `vercel inspect` | View deployment |
| `vercel domains` | Manage domains |
| `vercel env` | Manage env vars |

## Quick Examples

### Serverless Function

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({
    message: 'Hello from Vercel!',
    timestamp: Date.now()
  });
}
```

### Dynamic Route

```typescript
// pages/api/users/[id].ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  return NextResponse.json({ id: userId });
}
```

### Edge Function

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'value');
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static).*)',
};
```

## Next Steps

- [Configuration](./configuration.md) - การตั้งค่าเพิ่มเติม
- [Best Practices](./best-practices.md) - แนวทางที่ดีที่สุด
- [Integration](./integration.md) - การเชื่อมต่อกับ services อื่น
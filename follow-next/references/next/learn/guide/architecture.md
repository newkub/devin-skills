# Architecture

## App Router Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    app/                               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │   │
│  │  │ (marketing)│  │  (app)     │  │  api/      │      │   │
│  │  │  page.tsx  │  │  page.tsx  │  │  route.ts  │      │   │
│  │  └────────────┘  └────────────┘  └────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Route Groups                          │   │
│  │                                                       │   │
│  │   (marketing)  ──── Share layouts, no URL prefix      │   │
│  │   (app)       ──── Authenticated routes              │   │
│  │   (auth)      ──── Login, register, etc.             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
my-next-app/
├── src/
│   ├── app/                    # App Router
│   │   ├── (marketing)/        # Route group
│   │   │   ├── page.tsx        # /
│   │   │   ├── layout.tsx
│   │   │   └── about/
│   │   │       └── page.tsx    # /about
│   │   ├── (app)/              # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # /dashboard
│   │   │   └── settings/
│   │   │       └── page.tsx    # /settings
│   │   ├── api/                # Route handlers
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── components/             # Shared components
│   │   ├── ui/                 # Base components
│   │   ├── forms/             # Form components
│   │   └── layouts/           # Layout components
│   │
│   ├── lib/                    # Utilities
│   │   ├── db.ts               # Database client
│   │   ├── auth.ts             # Auth utilities
│   │   └── utils.ts            # Helpers
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── use-auth.ts
│   │   └── use-fetch.ts
│   │
│   └── types/                  # TypeScript types
│       └── index.ts
│
├── public/                     # Static files
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Route Handler Pattern

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const user = await prisma.user.create({
    data: body,
  });

  return NextResponse.json(user, { status: 201 });
}
```

## Server Action Pattern

```typescript
// app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  await prisma.user.create({
    data: { name, email },
  });

  revalidatePath('/users');
  redirect('/users');
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath('/users');
}
```

## Layout Pattern

```typescript
// app/(app)/layout.tsx
import { auth } from '@/lib/auth';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="pl-64">{children}</main>
    </div>
  );
}
```

## Middleware Pattern

```typescript
// middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnApp = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnAuth = req.nextUrl.pathname.startsWith('/login');

  if (isOnApp && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
```
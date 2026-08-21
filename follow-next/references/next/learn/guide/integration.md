# Integration

## Database

### Prisma

```bash
bun install prisma @prisma/client
npx prisma init
```

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Drizzle ORM

```bash
bun install drizzle-orm
bun install -D drizzle-kit
```

## Authentication

### NextAuth.js

```bash
bun install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
```

### Clerk

```bash
bun install @clerk/nextjs
```

```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## Styling

### Tailwind CSS

```bash
npx create-next-app@latest --tailwind
```

### CSS Modules

```css
/* components/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background: blue;
  color: white;
}
```

```tsx
// components/Button.tsx
import styles from './Button.module.css';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.button}>{children}</button>;
}
```

## Testing

### Playwright

```bash
bun install -D @playwright/test
npx playwright install
```

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/);
});
```

### Jest + React Testing Library

```bash
bun install -D jest @testing-library/react @testing-library/jest-dom
```

## Deployment

### Vercel

```bash
bun install -g vercel
vercel
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
COPY package.json package-lock.json* ./
RUN bun ci

FROM base AS builder
COPY --from=deps /node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## Monitoring

### Sentry

```bash
bun install @sentry/nextjs
```

```typescript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = { /* ... */ };

module.exports = withSentryConfig(nextConfig, {
  silent: true,
});
```
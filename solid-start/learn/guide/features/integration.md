# Integration - SolidStart

## UI Libraries

### Tailwind CSS

ติดตั้ง:

```bash
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

ตั้งค่า `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

ตั้งค่า `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

เพิ่มใน `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Kobalte UI Components

ติดตั้ง:

```bash
bun add @kobalte/core
```

ใช้ components:

```typescript
import { Button, Dialog } from "@kobalte/core";

export default function App() {
  return (
    <Button>Click me</Button>
  );
}
```

### Shadcn Solid

ติดตั้ง:

```bash
bun add @shadcn-solid/ui class-variance-authority clsx tailwind-merge
```

ตั้งค่า `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## State Management

### Solid Store

ติดตั้ง:

```bash
bun add solid-js
```

ใช้ store:

```typescript
import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  count: 0,
  user: null,
});
```

### Solid Query

ติดตั้ง:

```bash
bun add @tanstack/solid-query
```

ใช้สำหรับ data fetching:

```typescript
import { createQuery } from "@tanstack/solid-query";

export function usePosts() {
  return createQuery(() => ({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      return res.json();
    },
  }));
}
```

## Database

### Drizzle ORM

ติดตั้ง:

```bash
bun add drizzle-orm
bun add -D drizzle-kit
```

ตั้งค่า `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Prisma

ติดตั้ง:

```bash
bun add @prisma/client
bun add -D prisma
```

เริ่มต้น:

```bash
bunx prisma init
```

## Authentication

### Lucia Auth

ติดตั้ง:

```bash
bun add lucide-solid
```

ตั้งค่า:

```typescript
import { lucia } from "lucia";
import { solidjs } from "lucia/middleware";

export const auth = lucia({
  adapter: adapter(),
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: solidjs(),
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});
```

### Auth.js

ติดตั้ง:

```bash
bun add @auth/solidjs
```

ตั้งค่า:

```typescript
import { Auth } from "@auth/solidjs";

export const { handlers, signIn, signOut, auth } = Auth({
  providers: [GitHub()],
});
```

## API Integration

### REST API

```typescript
async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function usePosts() {
  return createResource(() => fetchApi<Post[]>("/api/posts"));
}
```

### GraphQL

ติดตั้ง:

```bash
bun add @urql/core @urql/solid
```

ตั้งค่า:

```typescript
import { createClient } from "@urql/core";

const client = createClient({
  url: "https://api.example.com/graphql",
});

export function useQuery(query: string) {
  return createQuery({ query });
}
```

## File Upload

### Uploadthing

ติดตั้ง:

```bash
bun add uploadthing solid-uploadthing
```

ตั้งค่า:

```typescript
import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(() => ({ message: "Upload complete" })),
};
```

## Forms

### Solid Forms

```typescript
import { createForm } from "@modular-forms/solid";

export function ContactForm() {
  const [form, Form] = createForm({
    initialValues: {
      name: "",
      email: "",
    },
  });

  return (
    <Form onSubmit={(values) => console.log(values)}>
      <form.Field name="name">
        {(field) => <input {...field.props} />}
      </form.Field>
      <form.Submit>Submit</form.Submit>
    </Form>
  );
}
```

## Internationalization

### Solid i18n

ติดตั้ง:

```bash
bun add solid-i18n
```

ตั้งค่า:

```typescript
import { I18nProvider } from "solid-i18n";

const config = {
  language: "en",
  translations: {
    en: {
      hello: "Hello",
    },
    th: {
      hello: "สวัสดี",
    },
  },
};

export function App() {
  return (
    <I18nProvider {...config}>
      <Routes />
    </I18nProvider>
  );
}
```

## Testing

### Vitest

ติดตั้ง:

```bash
bun add -D vitest @solidjs/testing-library
```

ตั้งค่า `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "jsdom",
  },
});
```

### Playwright

ติดตั้ง:

```bash
bun add -D @playwright/test
```

เริ่มต้น:

```bash
bunx playwright install
```

## Deployment

### Vercel

ติดตั้ง:

```bash
bun add -D vercel
```

ตั้งค่า `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install"
}
```

### Cloudflare Pages

ติดตั้ง:

```bash
bun add -D wrangler
```

ตั้งค่า `wrangler.toml`:

```toml
name = "my-app"
compatibility_date = "2024-01-01"

[build]
command = "bun run build"
cwd = "."
```

## Monitoring

### Sentry

ติดตั้ง:

```bash
bun add @sentry/solid
```

ตั้งค่า:

```typescript
import * as Sentry from "@sentry/solid";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});
```

## Analytics

### Vercel Analytics

ติดตั้ง:

```bash
bun add @vercel/analytics/solid
```

ใช้:

```typescript
import { Analytics } from "@vercel/analytics/solid";

export function App() {
  return (
    <>
      <Routes />
      <Analytics />
    </>
  );
}
```

# Best Practices - SolidStart

## Code Organization

### Project Structure

```
src/
├── routes/              # File-based routing
│   ├── index.tsx       # Home page
│   ├── about.tsx       # About page
│   └── blog/           # Blog routes
│       ├── index.tsx   # Blog listing
│       └── [slug].tsx  # Blog post
├── components/         # Reusable components
│   ├── ui/            # UI components
│   └── layout/        # Layout components
├── lib/               # Utility functions
├── stores/            # State management
└── types/             # TypeScript types
```

### Component Organization

- **Components** ควรมี single responsibility
- **Layout components** อยู่ใน `components/layout/`
- **UI components** อยู่ใน `components/ui/`
- **Business logic** อยู่ใน `lib/` หรือ `stores/`

## Routing Best Practices

### File Naming

| ประเภท | รูปแบบ | ตัวอย่าง |
|--------|---------|---------|
| Index | `index.tsx` | `/` |
| Static | `kebab-case.tsx` | `about-us.tsx` |
| Dynamic | `[param].tsx` | `[slug].tsx` |
| Catch-all | `[...catchAll].tsx` | `[...path].tsx` |

### Route Groups

ใช้ parentheses สำหรับ route groups:

```
routes/
├── (auth)/           # ไม่กระทบ URL
│   ├── login.tsx     # /login
│   └── register.tsx  # /register
└── (dashboard)/
    ├── index.tsx     # /dashboard
    └── settings.tsx  # /dashboard/settings
```

### Layout Components

ใช้ nested routes สำหรับ layouts:

```
routes/
├── (app)/
│   ├── layout.tsx    # Parent layout
│   ├── index.tsx     # Inherits layout
│   └── about.tsx     # Inherits layout
```

## Performance Best Practices

### Code Splitting

- SolidStart ทำ code splitting อัตโนมัติตาม routes
- ใช้ lazy loading สำหรับ heavy components:

```typescript
import { lazy } from "solid-js";

const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### Data Fetching

- ใช้ `routeData` สำหรับ server-side data fetching
- ใช้ `cache` สำหรับ caching data:

```typescript
import { cache } from "@solidjs/router";

const getData = cache(async () => {
  const res = await fetch("/api/data");
  return res.json();
}, "data");
```

### Asset Optimization

- ใช้ appropriate image formats (WebP, AVIF)
- Lazy load images:
```typescript
<img loading="lazy" src={imageSrc} alt={alt} />
```

## State Management Best Practices

### Use Signals for Local State

```typescript
const [count, setCount] = createSignal(0);
```

### Use Stores for Complex State

```typescript
const [state, setState] = createStore({
  user: { name: "", email: "" },
  items: [],
});
```

### Context for Global State

```typescript
const ThemeContext = createContext();

export function ThemeProvider(props: any) {
  const [theme, setTheme] = createSignal("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
```

## TypeScript Best Practices

### Type Definitions

สร้าง `types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
}
```

### Type Safety ใน Routes

```typescript
import { useParams } from "@solidjs/router";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  // params.slug จะมี type อย่างถูกต้อง
}
```

## Server-Side Best Practices

### API Routes

- ใช้ appropriate HTTP methods
- Return สถานะที่ถูกต้อง:

```typescript
import { json } from "@solidjs/start/server";

export async function GET() {
  return json({ data: "success" }, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  return json({ created: true }, { status: 201 });
}
```

### Error Handling

```typescript
import { json } from "@solidjs/start/server";

export async function GET() {
  try {
    const data = await fetchData();
    return json(data);
  } catch (error) {
    return json({ error: "Failed to fetch" }, { status: 500 });
  }
}
```

## Security Best Practices

### Environment Variables

- ไม่ commit `.env` files
- ใช้ `.env.example` สำหรับ template:

```bash
# .env.example
VITE_API_URL=
DATABASE_URL=
```

### Input Validation

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

## Testing Best Practices

### Unit Tests

```typescript
import { render, screen } from "solid-testing-library";
import Counter from "./Counter";

test("increments count", () => {
  render(() => <Counter />);
  const button = screen.getByText("Increment");
  button.click();
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### Integration Tests

ใช้ Playwright สำหรับ E2E tests:

```typescript
import { test, expect } from "@playwright/test";

test("navigation works", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click("text=About");
  await expect(page).toHaveURL("/about");
});
```

## Deployment Best Practices

### Build Configuration

```typescript
export default defineConfig({
  minify: true,
  sourcemap: false, // Disable in production
});
```

### Environment-Specific Config

```typescript
const isDev = import.meta.env.DEV;

export default defineConfig({
  dev: isDev,
  ssr: !isDev, // Disable SSR in dev if needed
});
```

## Accessibility Best Practices

### Semantic HTML

```typescript
export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  );
}
```

### Keyboard Navigation

```typescript
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === "Enter" && handleClick()}
>
  Click me
</button>
```

## Common Pitfalls

### ❌ ไม่ควรทำ

```typescript
// ไม่ควร mutate state โดยตรง
const [items, setItems] = createSignal([]);
items().push(newItem); // ❌
```

### ✅ ควรทำ

```typescript
// ควรใช้ setter
const [items, setItems] = createSignal([]);
setItems([...items(), newItem]); // ✅
```

### ❌ ไม่ควรทำ

```typescript
// ไม่ควร fetch data ใน component body
export default function Component() {
  fetch("/api/data"); // ❌
}
```

### ✅ ควรทำ

```typescript
// ควรใช้ routeData หรือ createResource
export function routeData() {
  return cache(async () => {
    const res = await fetch("/api/data");
    return res.json();
  }, "data");
}
```

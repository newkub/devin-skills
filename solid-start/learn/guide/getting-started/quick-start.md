# Quick Start - SolidStart

## เริ่มต้นอย่างรวดเร็ว

### 1. สร้าง Project

```bash
bun create solid my-app
```

เลือก template `basic` และตอบ `Yes` สำหรับ TypeScript และ SSR

### 2. ติดตั้ง Dependencies

```bash
cd my-app
bun install
```

### 3. รัน Development Server

```bash
bun run dev
```

เปิด browser ไปที่ `http://localhost:3000`

## สร้าง Route แรก

### Index Route

ไฟล์ `src/routes/index.tsx` ถูกสร้างให้อัตโนมัติ:

```typescript
export default function Index() {
  return (
    <main>
      <h1>Hello World</h1>
    </main>
  );
}
```

### เพิ่ม Route ใหม่

สร้างไฟล์ `src/routes/about.tsx`:

```typescript
export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>This is the about page</p>
    </main>
  );
}
```

เข้าถึงได้ที่ `http://localhost:3000/about`

## Navigation

### ใช้ Link Component

```typescript
import { A } from "@solidjs/router";

export default function Index() {
  return (
    <main>
      <h1>Hello World</h1>
      <A href="/about">Go to About</A>
    </main>
  );
}
```

### ใช้ useNavigate Hook

```typescript
import { useNavigate } from "@solidjs/router";

export default function Index() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>Hello World</h1>
      <button onClick={() => navigate("/about")}>
        Go to About
      </button>
    </main>
  );
}
```

## Dynamic Routes

### สร้าง Dynamic Route

สร้างไฟล์ `src/routes/blog/[slug].tsx`:

```typescript
export default function BlogPost() {
  const params = useParams();
  return (
    <main>
      <h1>Blog Post: {params.slug}</h1>
    </main>
  );
}
```

เข้าถึงได้ที่ `http://localhost:3000/blog/my-post`

## API Routes

### สร้าง API Route

สร้างไฟล์ `src/routes/api/hello.ts`:

```typescript
import { json } from "@solidjs/start/server";

export async function GET() {
  return json({ message: "Hello World" });
}
```

เข้าถึงได้ที่ `http://localhost:3000/api/hello`

### ใช้ API Route ใน Component

```typescript
import { createResource } from "solid-js";

async function fetchHello() {
  const res = await fetch("/api/hello");
  return res.json();
}

export default function Index() {
  const [data] = createResource(fetchHello);

  return (
    <main>
      <h1>{data()?.message}</h1>
    </main>
  );
}
```

## Nested Routes

### สร้าง Layout

สร้างไฟล์ `src/routes/blog/index.tsx`:

```typescript
export default function BlogLayout(props: any) {
  return (
    <div>
      <nav>
        <a href="/blog">Blog Home</a>
      </nav>
      {props.children}
    </div>
  );
}
```

### สร้าง Nested Route

สร้างไฟล์ `src/routes/blog/post.tsx`:

```typescript
export default function BlogPost() {
  return (
    <article>
      <h1>Blog Post</h1>
      <p>Post content here</p>
    </article>
  );
}
```

## State Management

### ใช้ Signals

```typescript
import { createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### ใช้ Stores

```typescript
import { createStore } from "solid-js/store";

export default function TodoList() {
  const [todos, setTodos] = createStore({
    items: ["Learn SolidStart", "Build something awesome"],
  });

  function addTodo(text: string) {
    setTodos("items", (items) => [...items, text]);
  }

  return (
    <div>
      <ul>
        {todos.items.map((item) => <li>{item}</li>)}
      </ul>
      <button onClick={() => addTodo("New todo")}>
        Add Todo
      </button>
    </div>
  );
}
```

## Data Fetching

### Server-Side Data Fetching

```typescript
import { useRouteData } from "@solidjs/start";
import { cache } from "@solidjs/router";

async function fetchPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

const getPosts = cache(fetchPosts, "posts");

export function routeData() {
  return getPosts();
}

export default function Blog() {
  const posts = useRouteData();
  return (
    <div>
      <For each={posts()}>
        {(post) => (
          <article>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        )}
      </For>
    </div>
  );
}
```

## Styling

### ใช้ CSS Modules

สร้างไฟล์ `src/routes/index.module.css`:

```css
.container {
  padding: 20px;
}

.title {
  color: blue;
}
```

ใช้ใน component:

```typescript
import styles from "./index.module.css";

export default function Index() {
  return (
    <div class={styles.container}>
      <h1 class={styles.title}>Hello World</h1>
    </div>
  );
}
```

### ใช้ Tailwind CSS

ติดตั้ง Tailwind:

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

ใช้ใน component:

```typescript
export default function Index() {
  return (
    <div class="p-4">
      <h1 class="text-blue-500">Hello World</h1>
    </div>
  );
}
```

## Build และ Deploy

### Build สำหรับ Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run start
```

### Deploy ไปยัง Vercel

```bash
bun add -D vercel
bunx vercel
```

## Next Steps

- อ่าน [Best Practices](./best-practices.md) สำหรับ conventions
- ดู [Integration Guide](./integration.md) สำหรับการเชื่อมต่อ libraries
- เรียนรู้เพิ่มเติมจาก [Official Documentation](https://docs.solidjs.com/solid-start)

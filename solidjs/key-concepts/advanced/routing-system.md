---
title: Routing System
description: เรียนรู้เรื่อง Routing System ใน SolidJS และ SolidStart
---

## สิ่งที่คือ Routing System

SolidJS ใช้ file-system based routing ผ่าน `@solidjs/router` และ SolidStart

## File-System Routing (SolidStart)

```
routes/
├── index.tsx          → /
├── about.tsx          → /about
├── blog/
│   ├── index.tsx      → /blog
│   └── [id].tsx       → /blog/:id
├── (auth)/
│   ├── login.tsx      → /login
│   └── register.tsx  → /register
└── [...404].tsx       → 404 page
```

## Dynamic Routes

ใช้ square brackets สำหรับ dynamic segments:

```jsx
// routes/[id].tsx
export default function Post(props) {
  const id = props.params.id;
  return <div>Post: {id}</div>;
}
```

## Route Groups

ใช้ parentheses สำหรับ route groups (ไม่ส่งผลต่อ URL):

```
routes/
├── (auth)/
│   ├── login.tsx      → /login
│   └── register.tsx  → /register
```

## Layout Routes

สร้าง layouts ด้วย folder structure:

```
routes/
├── layout.tsx        → Layout component
├── layout/
│   ├── index.tsx     → /
│   └── about.tsx     → /about
```

## การใช้งาน @solidjs/router

```jsx
import { Router, Route } from "@solidjs/router";

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/user/:id" component={User} />
    </Router>
  );
}
```

## Navigation

```jsx
import { useNavigate, A } from "@solidjs/router";

function Component() {
  const navigate = useNavigate();

  return (
    <div>
      <A href="/about">Link</A>
      <button onClick={() => navigate("/about")}>Navigate</button>
    </div>
  );
}
```

## Route Parameters

```jsx
function User() {
  const params = useParams();
  const id = params.id;
  return <div>User: {id}</div>;
}
```

## Nested Routes

```jsx
<Router>
  <Route path="/admin" component={AdminLayout}>
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/users" component={Users} />
  </Route>
</Router>
```

## ถัดไป

ดู [Middleware](./middleware.md) เพื่อเรียนรู้เรื่อง request interception

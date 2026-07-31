---
title: Integration
description: การ integrate SolidJS กับ libraries อื่น
---

## Integration กับ TypeScript

ติดตั้ง types:

```bash
bun add -D @types/babel__core
```

ตั้งค่า `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

## Integration กับ Vite

ติดตั้ง plugin:

```bash
bun add -D vite-plugin-solid
```

ตั้งค่า `vite.config.js`:

```javascript
import solidPlugin from "vite-plugin-solid";

export default {
  plugins: [solidPlugin()],
};
```

## Integration กับ Tailwind CSS

ติดตั้ง:

```bash
bun add -D tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

ตั้งค่า `tailwind.config.js`:

```javascript
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
};
```

## Integration กับ Router

ใช้ `@solidjs/router`:

```bash
bun add @solidjs/router
```

```jsx
import { Router, Route, Link } from "@solidjs/router";

function App() {
  return (
    <Router>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  );
}
```

## Integration กับ State Management

### Zustand

```bash
bun add zustand
```

```javascript
import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Redux

```bash
bun add @reduxjs/toolkit solid-redux
```

## Integration กับ Testing

### Vitest

```bash
bun add -D vitest @solidjs/testing-library
```

```javascript
import { render, screen } from "solid-js/testing-library";
import { describe, it, expect } from "vitest";

describe("Counter", () => {
  it("increments count", () => {
    render(() => <Counter />);
    const button = screen.getByText("0");
    button.click();
    expect(button.textContent).toBe("1");
  });
});
```

## Integration กับ CSS-in-JS

### Emotion

```bash
bun add @emotion/css
```

```jsx
import { css } from "@emotion/css";

const style = css`
  color: red;
`;

return <div class={style}>Hello</div>;
```

## Integration กับ API Clients

### Fetch API

```jsx
const [data] = createResource(async () => {
  const res = await fetch("/api/data");
  return res.json();
});
```

### Axios

```bash
bun add axios
```

```jsx
import axios from "axios";

const [data] = createResource(async () => {
  const res = await axios.get("/api/data");
  return res.data;
});
```

## ถัดไป

ดู [Architecture](./architecture.md) เพื่อเรียนรู้เรื่อง architecture

---
title: Integration Examples
description: Integration examples สำหรับ SolidJS
---

# Integration Examples

ตัวอย่างการเชื่อมต่อกับ libraries และ frameworks อื่นๆ

## Solid Router

```tsx
import { Router, Route, Link } from '@solidjs/router';

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

## Solid Start (SSR)

```tsx
import { StartServer, createHandler } from 'solid-start/start/server';

export default createHandler(() => {
  return <StartServer
    document={import('./entry-client')}
    routes={import('./routes')}
  />;
});
```

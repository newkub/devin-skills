---
description: SSR และ hydration principles สำหรับ SolidJS กับ Nitro
---

## SSR and Hydration

### Streaming Support

TanStack Start รองรับ streaming สำหรับ progressive page loading:
- Full-document SSR
- Streaming สำหรับ improved user experience
- Server functions และ API routes

### Two-Phase Rendering

SolidJS ต้องการ two-phase rendering:

1. **Shell Rendering** - Render HTML shell
2. **App Rendering** - Render app content และ inject ผ่าน innerHTML

### Server Entry

ใช้ `renderToStringAsync` สำหรับ HTML generation:

```ts
import { renderToStringAsync, HydrationScript } from 'solid-js/web'

const appHtml = await renderToStringAsync(() => <App />)
```

### Hydration Script

ต้อง include `HydrationScript` สำหรับ client-side hydration:

```tsx
<html>
  <head>
    <HydrationScript />
  </head>
</html>
```

### Client Entry

Hydrate server-rendered HTML:

```ts
import { hydrate } from 'solid-js/web'
import App from './App'

hydrate(() => <App />, document.getElementById('app'))
```

### Root Document Structure

ใช้ `HeadContent` และ `Scripts` จาก TanStack Router:

```tsx
import { HeadContent, Scripts } from '@tanstack/solid-router'

function RootDocument({ children }) {
  return (
    <html>
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

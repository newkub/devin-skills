# SolidStart + Nitro (vite-ssr-solidstart)

Reference จาก https://nitro.build/examples/vite-ssr-solidstart — SSR ด้วย Solid, Vite และ Nitro ให้ streaming HTML, automatic asset management และ client hydration

## package.json

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  },
  "dependencies": {
    "@solidjs/meta": "^0.29.4",
    "@solidjs/router": "^0.15.4",
    "@solidjs/start": "^2.0.0-alpha.2",
    "nitro": "latest",
    "solid-js": "^1.9.11",
    "vite": "latest"
  },
  "engines": {
    "node": ">=22"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "types": ["@solidjs/start/env"],
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

## vite.config.ts

```ts
import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [solidStart(), nitro()],
});
```

## src/app.tsx

```tsx
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
```

## src/entry-server.tsx

```tsx
// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
```

## src/entry-client.tsx

```tsx
// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

mount(() => <StartClient />, document.getElementById("app")!);
```

## src/routes/index.tsx

```tsx
import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
    </main>
  );
}
```

## src/routes/[...404].tsx

```tsx
import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
    </main>
  );
}
```

## หมายเหตุ Bun

- `bun install` แทน `npm install`
- `bun run dev` / `bun run build` แทน `npm run`
- production: `bun .output/server/index.mjs`
- ถ้าเขียน server code เองนอก Nitro → ใช้ `/use-bun-native-api`

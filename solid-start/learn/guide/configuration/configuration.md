# Configuration - SolidStart

## Configuration Files

### app.config.ts

ไฟล์หลักสำหรับตั้งค่า SolidStart:

```typescript
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  // Configuration options
});
```

## Configuration Options

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|-----------|
| **ssr** | `boolean` | `true` | เปิด/ปิด Server-Side Rendering |
| **dev** | `boolean` | `true` | Development mode |
| **minify** | `boolean` | `true` | Minify code ใน production |
| **routesDir** | `string` | `"src/routes"` | Directory สำหรับ routes |
| **root** | `string` | `"src"` | Root directory ของ project |
| **extensions** | `string[]` | `["tsx", "jsx", "ts", "js"]` | File extensions สำหรับ routes |

## Rendering Configuration

### SSR Configuration

```typescript
export default defineConfig({
  ssr: true,
});
```

### CSR Configuration

```typescript
export default defineConfig({
  ssr: false,
});
```

### Hybrid Rendering

```typescript
export default defineConfig({
  ssr: {
    // Enable SSR สำหรับ routes ที่ระบุ
    routeRules: {
      "/": { ssr: true },
      "/admin/**": { ssr: false },
    },
  },
});
```

## Route Configuration

### Route-Specific Configuration

สามารถตั้งค่าแต่ละ route ได้ในไฟล์ route:

```typescript
// routes/about.tsx
export const routeConfig = {
  preload: false,
  ssr: true,
};

export default function About() {
  return <div>About</div>;
}
```

### Route Config Options

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|-----------|
| **preload** | `boolean` | `true` | Preload route ก่อน navigation |
| **ssr** | `boolean` | `true` | Override global SSR setting |

## Router Configuration

### Solid Router Configuration

```typescript
// src/app.tsx
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

export default function App() {
  return (
    <Router
      root={(props) => (
        <main>
          {props.children}
        </main>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
```

### Custom Router

สามารถใช้ router อื่นๆ แทน @solidjs/router ได้:

```typescript
import { Router } from "solid-app-router";
import { FileRoutes } from "@solidjs/start/router";

export default function App() {
  return (
    <Router>
      <FileRoutes />
    </Router>
  );
}
```

## Server Configuration

### Nitro Configuration

SolidStart ใช้ Nitro สำหรับ server-side configuration:

```typescript
// nitro.config.ts
export default defineNitroConfig({
  devServer: {
    port: 3000,
  },
  routeRules: {
    "/api/**": { cors: true },
  },
});
```

### Environment Variables

สร้างไฟล์ `.env`:

```bash
# .env
VITE_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

ใช้ใน code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build Configuration

### Vite Configuration

สร้างไฟล์ `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
```

### Build Options

| Option | Type | Default | คำอธิบาย |
|--------|------|---------|-----------|
| **target** | `string` | `"esnext"` | JavaScript target |
| **minify** | `boolean` | `true` | Minify output |
| **sourcemap** | `boolean` | `false` | Generate source maps |

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Path Aliases

ตั้งค่า path aliases สำหรับ imports:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

## Middleware Configuration

สร้าง `middleware.ts` ที่ root:

```typescript
export function onRequest(event: any) {
  // Global middleware
  console.log("Request:", event.request.url);
}

export function onRequestResponse(event: any) {
  // Response middleware
}
```

## Deployment Configuration

### Vercel

สร้าง `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install"
}
```

### Netlify

สร้าง `netlify.toml`:

```toml
[build]
  command = "bun run build"
  publish = ".solid"

[dev]
  command = "bun run dev"
```

### Cloudflare Pages

สร้าง `wrangler.toml`:

```toml
name = "my-app"
compatibility_date = "2024-01-01"

[build]
command = "bun run build"
cwd = "."
```

## Performance Configuration

### Code Splitting

```typescript
export default defineConfig({
  splitChunks: true,
});
```

### Preload Strategy

```typescript
export default defineConfig({
  preload: {
    // Preload strategy
  },
});
```

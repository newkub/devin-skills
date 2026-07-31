# SolidStart Configuration Reference

## Overview

SolidStart configuration อยู่ใน `app.config.ts` ซึ่งกำหนด behavior ของ application ทั้งหมด รวมถึง SSR, routing, และ deployment

## app.config.ts

Configuration file หลักของ SolidStart

```typescript
export default {
  // SSR Configuration
  ssr: true,
  
  // Router Configuration
  router: {
    base: "/app",
    trailingSlash: "ignore"
  },
  
  // Server Configuration
  server: {
    preset: "vercel"
  },
  
  // Build Configuration
  build: {
    target: "es2020"
  }
}
```

## Configuration Options

### SSR Options

**ssr**
- Type: `boolean`
- Default: `true`
- Description: เปิด/ปิด Server-Side Rendering

```typescript
export default {
  ssr: true // เปิด SSR
}
```

**prerender**
- Type: `boolean | string[]`
- Default: `false`
- Description: Prerender routes สำหรับ SSG

```typescript
export default {
  prerender: true // Prerender ทุก routes
  // หรือ
  prerender: ["/", "/about", "/contact"] // Prerender เฉพาะ routes ที่ระบุ
}
```

### Router Options

**base**
- Type: `string`
- Default: `"/"`
- Description: Base path สำหรับ application

```typescript
export default {
  router: {
    base: "/my-app"
  }
}
```

**trailingSlash**
- Type: `"always" | "never" | "ignore"`
- Default: `"ignore"`
- Description: จัดการ trailing slash ใน URLs

```typescript
export default {
  router: {
    trailingSlash: "always" // เพิ่ม / ทุก URLs
  }
}
```

### Server Options

**preset**
- Type: `"vercel" | "netlify" | "cloudflare" | "node" | "static"`
- Default: `"node"`
- Description: Deployment platform preset

```typescript
export default {
  server: {
    preset: "vercel" // Deploy ไป Vercel
  }
}
```

**port**
- Type: `number`
- Default: `3000`
- Description: Port สำหรับ development server

```typescript
export default {
  server: {
    port: 4000
  }
}
```

### Build Options

**target**
- Type: `"es2015" | "es2020" | "esnext"`
- Default: `"es2020"`
- Description: JavaScript target สำหรับ build

```typescript
export default {
  build: {
    target: "esnext" // ใช้ features ล่าสุด
  }
}
```

**minify**
- Type: `boolean`
- Default: `true`
- Description: Minify code ใน production

```typescript
export default {
  build: {
    minify: true
  }
}
```

## Platform-specific Configuration

### Vercel

```typescript
export default {
  server: {
    preset: "vercel"
  }
}
```

เพิ่มเติมใน `vercel.json`:

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist/public",
  "framework": null
}
```

### Netlify

```typescript
export default {
  server: {
    preset: "netlify"
  }
}
```

เพิ่มเติมใน `netlify.toml`:

```toml
[build]
  command = "bun run build"
  publish = "dist/public"

[functions]
  node_bundler = "esbuild"
```

### Cloudflare

```typescript
export default {
  server: {
    preset: "cloudflare"
  }
}
```

เพิ่มเติมใน `wrangler.toml`:

```toml
name = "my-app"
main = "./dist/server"
compatibility_date = "2023-01-01"
```

### Node.js

```typescript
export default {
  server: {
    preset: "node"
  }
}
```

## Environment Variables

ใช้ `.env` files สำหรับ environment variables:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_PUBLIC_KEY=your-public-key
NODE_ENV=production
```

เข้าถึงใน code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## TypeScript Configuration

`tsconfig.json` สำหรับ TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client", "solid-start/env"]
  }
}
```

## Vite Configuration

`vite.config.ts` สำหรับ Vite-specific config:

```typescript
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000
  }
})
```

## Custom Configuration

สามารถ extend configuration ด้วย custom logic:

```typescript
import { defineConfig } from "solid-start/config"

export default defineConfig({
  ssr: process.env.NODE_ENV !== "development",
  router: {
    base: process.env.BASE_PATH || "/"
  }
})
```

## References

- [SolidStart Configuration](https://docs.solidjs.com/solid-start/reference/configuration)
- [SolidStart Deployment](https://docs.solidjs.com/solid-start/deploy)

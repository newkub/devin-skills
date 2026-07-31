# SolidStart CLI Reference

## Overview

SolidStart CLI ใช้สำหรับสร้างและจัดการ SolidStart projects โดยใช้ `bun create solid-start@latest`

## Installation

```bash
# สร้าง project ใหม่
bun create solid-start@latest my-app
# หรือ
bun create solid-start@latest my-app
# หรือ
bunx create-solid-start my-app
```

## Commands

### create-solid-start

สร้าง SolidStart project ใหม่ด้วย interactive prompts

```bash
bun create solid-start@latest [project-name] [options]
```

**Options**
- `--template` - เลือก template เฉพาะ
- `--ts` - ใช้ TypeScript (default)
- `--js` - ใช้ JavaScript
- `--server` - เลือก server environment (node, vercel, netlify, cloudflare)
- `--no-install` - ไม่ติดตั้ง dependencies อัตโนมัติ

**Examples**
```bash
# สร้าง project ด้วย default settings
bun create solid-start@latest my-app

# สร้าง project ด้วย TypeScript และ Vercel
bun create solid-start@latest my-app --server vercel

# สร้าง project โดยไม่ติดตั้ง dependencies
bun create solid-start@latest my-app --no-install
```

### dev

รัน development server

```bash
bun run dev
```

**Options**
- `--port` - กำหนด port (default: 3000)
- `--host` - กำหนด host (default: localhost)

**Examples**
```bash
bun run dev -- --port 4000
bun run dev -- --host 0.0.0.0
```

### build

สร้าง production build

```bash
bun run build
```

**Options**
- `--analyze` - analyze bundle size
- `--mode` - กำหนด build mode (production, development)

**Examples**
```bash
bun run build -- --analyze
bun run build -- --mode production
```

### start

รัน production server

```bash
bun start
```

### preview

Preview production build ใน development mode

```bash
bun run preview
```

## Templates

SolidStart มี templates หลายแบบสำหรับเริ่มต้น:

- **bare** - Minimal setup
- **todos** - Todo app example
- **with-auth** - With authentication
- **with-mdx** - With MDX support
- **with-tailwind** - With Tailwind CSS
- **with-vitest** - With Vitest testing

## Configuration

CLI configuration อยู่ใน `app.config.ts`:

```typescript
export default {
  ssr: true,
  router: {
    base: "/app"
  },
  server: {
    preset: "vercel"
  }
}
```

## Environment Variables

ใช้ `.env` files สำหรับ environment variables:

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_PUBLIC_KEY=your-public-key
```

## Package Manager Support

SolidStart รองรับ package managers หลายตัว:

- **bun** - Recommended (fastest, less disk space)
- **bun** - Supported (faster than bun)
- **yarn** - Supported

## Deployment Presets

CLI รองรับ deployment presets หลาย platform:

- **vercel** - Vercel deployment
- **netlify** - Netlify deployment
- **cloudflare** - Cloudflare Pages
- **node** - Node.js server
- **static** - Static site generation

## References

- [SolidStart Getting Started](https://docs.solidjs.com/solid-start/getting-started)
- [SolidStart CLI](https://docs.solidjs.com/solid-start/reference/cli)

# Installation

## Purpose

คู่มือการติดตั้ง SvelteKit และการสร้าง project ใหม่

## Scope

- Project creation
- Package installation
- TypeScript setup
- Environment setup
- Verification

## Quick Create

### Using sv (Recommended)

```bash
npx sv create my-app
```

### Interactive Mode

```bash
npx sv create
# Choose:
# - Add type checking: TypeScript
# - Select add-ons: ESLint, Prettier
# - Choose financing: No financing
```

### Manual Options

```bash
# Minimal
npx sv create my-app --template minimal

# TypeScript
npx sv create my-app --template minimal --types ts

# With add-ons
npx sv create my-app --add-ons eslint prettier
```

## Package Installation

### bun

```bash
bun install
```

### yarn

```bash
yarn install
```

### bun

```bash
bun install
```

### bun

```bash
bun install
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "allowJs": true
  }
}
```

## Project Structure

```
my-app/
├── src/
│   ├── routes/
│   │   └── +page.svelte
│   ├── app.html
│   └── app.d.ts
├── static/
│   └── favicon.png
├── package.json
├── svelte.config.js
├── vite.config.ts
└── tsconfig.json
```

## Development Server

### Start Dev Server

```bash
bun run dev
```

### Open Browser

```
http://localhost:5173
```

## Environment Variables

### Create .env

```bash
# Private (server-only)
DATABASE_URL=postgres://...

# Public (client-safe)
PUBLIC_API_URL=https://api.example.com
```

## Verification

### Check Installation

```bash
bun run dev
```

Should see:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

## Next Steps

- Read [Quick Start Guide](./quick-start.md)
- Explore [Features](./features.md)
- Learn about [Configuration](./configuration.md)
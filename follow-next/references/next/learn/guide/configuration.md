# Configuration

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['images.example.com'],
    formats: ['image/avif', 'image/webp']
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL
  }
};

module.exports = nextConfig;
```

## TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://...
API_SECRET=secret123

# Public (prefix with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=MyApp
```

## Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| reactStrictMode | boolean | true | Enable React strict mode |
| swcMinify | boolean | true | Use SWC minifier |
| output | string | - | Output mode ('standalone') |
